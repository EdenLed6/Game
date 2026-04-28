#!/usr/bin/env python3
"""Extract Kotlin Lesson*.kt files into web/data/lessons.json.

The Kotlin lesson files follow a strict, regular shape:
  Lesson(
    id = N,
    number = "...",
    title = "...",
    subtitle = "...",
    emoji = "...",
    grammarPoints = listOf(GrammarPoint(...), ...),
    vocabulary    = listOf(VocabItem(...), ...),
    examples      = listOf(Example(...), ...),
    exercises     = listOf(QuizQuestion(question="...", options=listOf("...","..."), correctIndex=N, explanation="..."), ...),
    videoUrl      = "...",                                     // optional
    practiceCards = listOf(PracticeCard(...), ...)             // optional
  )

We tokenize at the character level, tracking string boundaries so we never
split inside a Kotlin "..." literal.

Source-of-truth = .ui-source/app/ (read-only Android tree). The bundled APK
source lives at app/, but the *new* truth is .ui-source/app/, so we resolve
that path first and fall back gracefully.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Prefer the read-only mirror at .ui-source/app/; fall back to legacy app/.
def _lessons_dir() -> Path:
    candidates = [
        ROOT / ".ui-source" / "app" / "src" / "main" / "java" / "com" / "nihongo" / "beginner" / "data" / "lessons",
        ROOT / "app"        / "src" / "main" / "java" / "com" / "nihongo" / "beginner" / "data" / "lessons",
    ]
    for c in candidates:
        if c.is_dir():
            return c
    return candidates[0]

LESSONS_DIR = _lessons_dir()
OUT_FILE = ROOT / "web" / "data" / "lessons.json"


def parse_kotlin_string(src: str, i: int) -> tuple[str, int]:
    """Parse a Kotlin "..." string starting at src[i] == '"'. Returns (value, next_index)."""
    assert src[i] == '"'
    i += 1
    out: list[str] = []
    while i < len(src):
        ch = src[i]
        if ch == "\\":
            nxt = src[i + 1]
            mapping = {"n": "\n", "t": "\t", "r": "\r", '"': '"', "\\": "\\", "'": "'", "$": "$"}
            if nxt in mapping:
                out.append(mapping[nxt])
                i += 2
            elif nxt == "u":
                hex_part = src[i + 2 : i + 6]
                out.append(chr(int(hex_part, 16)))
                i += 6
            else:
                out.append(nxt)
                i += 2
        elif ch == '"':
            return "".join(out), i + 1
        else:
            out.append(ch)
            i += 1
    raise ValueError("Unterminated string")


def split_top_level_args(src: str) -> list[str]:
    """Split a comma-separated Kotlin arg list, ignoring commas inside strings/parens/brackets."""
    parts: list[str] = []
    depth = 0
    cur: list[str] = []
    i = 0
    while i < len(src):
        ch = src[i]
        if ch == '"':
            # Copy the literal verbatim
            j = i + 1
            while j < len(src):
                if src[j] == "\\":
                    j += 2
                    continue
                if src[j] == '"':
                    j += 1
                    break
                j += 1
            cur.append(src[i:j])
            i = j
            continue
        if ch in "([{":
            depth += 1
        elif ch in ")]}":
            depth -= 1
        if ch == "," and depth == 0:
            parts.append("".join(cur).strip())
            cur = []
            i += 1
            continue
        cur.append(ch)
        i += 1
    last = "".join(cur).strip()
    if last:
        parts.append(last)
    return parts


def parse_named_args(args: list[str]) -> dict[str, str]:
    """For each `name = value` form, return a dict of name → raw value text."""
    out: dict[str, str] = {}
    for arg in args:
        m = re.match(r"^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$", arg, re.DOTALL)
        if not m:
            continue
        out[m.group(1)] = m.group(2).strip()
    return out


def find_call(src: str, name: str, start: int = 0) -> tuple[int, int] | None:
    """Find `name(` and return (open_paren_index, close_paren_index)."""
    pat = re.compile(rf"\b{re.escape(name)}\s*\(")
    m = pat.search(src, start)
    if not m:
        return None
    open_idx = m.end() - 1
    depth = 0
    i = open_idx
    while i < len(src):
        ch = src[i]
        if ch == '"':
            _, i = parse_kotlin_string(src, i)
            continue
        if ch == "(":
            depth += 1
        elif ch == ")":
            depth -= 1
            if depth == 0:
                return open_idx, i
        i += 1
    raise ValueError(f"Unterminated call to {name}")


def extract_first_string(value: str) -> str:
    value = value.lstrip()
    if not value.startswith('"'):
        raise ValueError(f"Expected string literal, got: {value[:40]!r}")
    s, _ = parse_kotlin_string(value, 0)
    return s


def extract_int(value: str) -> int:
    return int(value.strip())


def parse_listof(value: str, ctor: str) -> list[dict[str, str]]:
    """Given the raw text of a `listOf(Ctor(...), Ctor(...), ...)` value,
    return a list of dicts of named args for each `Ctor(...)` call inside.
    """
    inner_match = re.match(r"^\s*listOf\s*\(", value, re.DOTALL)
    if not inner_match:
        return []
    # Find matching close paren
    depth = 0
    i = inner_match.end() - 1
    while i < len(value):
        ch = value[i]
        if ch == '"':
            _, i = parse_kotlin_string(value, i)
            continue
        if ch == "(":
            depth += 1
        elif ch == ")":
            depth -= 1
            if depth == 0:
                break
        i += 1
    inside = value[inner_match.end() : i]
    items: list[dict[str, str]] = []
    pos = 0
    while True:
        loc = find_call(inside, ctor, pos)
        if not loc:
            break
        oi, ci = loc
        body = inside[oi + 1 : ci]
        items.append(parse_named_args(split_top_level_args(body)))
        pos = ci + 1
    return items


def parse_options_listof(raw: str) -> list[str]:
    """Parse `listOf("a", "b", ...)` into list of strings."""
    m = re.match(r"^\s*listOf\s*\(", raw, re.DOTALL)
    if not m:
        return []
    depth = 0
    i = m.end() - 1
    while i < len(raw):
        ch = raw[i]
        if ch == '"':
            _, i = parse_kotlin_string(raw, i)
            continue
        if ch == "(":
            depth += 1
        elif ch == ")":
            depth -= 1
            if depth == 0:
                break
        i += 1
    inside = raw[m.end() : i]
    parts = split_top_level_args(inside)
    return [extract_first_string(p) for p in parts]


def parse_lesson_file(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    loc = find_call(text, "Lesson")
    if not loc:
        raise ValueError(f"No Lesson(...) call in {path}")
    oi, ci = loc
    body = text[oi + 1 : ci]
    args = parse_named_args(split_top_level_args(body))

    grammar = []
    for g in parse_listof(args.get("grammarPoints", ""), "GrammarPoint"):
        item = {
            "title": extract_first_string(g["title"]),
            "content": extract_first_string(g["content"]),
        }
        if "pattern" in g:
            item["pattern"] = extract_first_string(g["pattern"])
        grammar.append(item)

    vocab = []
    for v in parse_listof(args.get("vocabulary", ""), "VocabItem"):
        vocab.append({
            "japanese": extract_first_string(v["japanese"]),
            "romaji": extract_first_string(v["romaji"]),
            "hebrew": extract_first_string(v["hebrew"]),
            "emoji": extract_first_string(v["emoji"]) if "emoji" in v else "",
            "imageKeyword": extract_first_string(v["imageKeyword"]) if "imageKeyword" in v else "",
        })

    examples = []
    for e in parse_listof(args.get("examples", ""), "Example"):
        examples.append({
            "romaji": extract_first_string(e["romaji"]),
            "japanese": extract_first_string(e["japanese"]) if "japanese" in e else "",
            "hebrew": extract_first_string(e["hebrew"]),
        })

    exercises = []
    for q in parse_listof(args.get("exercises", ""), "QuizQuestion"):
        exercises.append({
            "question": extract_first_string(q["question"]),
            "options": parse_options_listof(q["options"]),
            "correctIndex": extract_int(q["correctIndex"]),
            "explanation": extract_first_string(q["explanation"]) if "explanation" in q else "",
        })

    practice_cards = []
    for p in parse_listof(args.get("practiceCards", ""), "PracticeCard"):
        practice_cards.append({
            "promptLabel": extract_first_string(p["promptLabel"]),
            "prompt":      extract_first_string(p["prompt"]),
            "answer":      extract_first_string(p["answer"]),
            "answerSub":   extract_first_string(p["answerSub"]) if "answerSub" in p else "",
            "audioText":   extract_first_string(p["audioText"]) if "audioText" in p else "",
            "inputHint":   extract_first_string(p["inputHint"]) if "inputHint" in p else "כתבו את התשובה...",
        })

    video_url = ""
    if "videoUrl" in args:
        video_url = extract_first_string(args["videoUrl"])

    return {
        "id": extract_int(args["id"]),
        "number": extract_first_string(args["number"]),
        "title": extract_first_string(args["title"]),
        "subtitle": extract_first_string(args["subtitle"]),
        "emoji": extract_first_string(args["emoji"]),
        "grammarPoints": grammar,
        "vocabulary": vocab,
        "examples": examples,
        "exercises": exercises,
        "videoUrl": video_url,
        "practiceCards": practice_cards,
    }


def referenced_lesson_files(data_dir: Path) -> set[str] | None:
    """Read LessonData.kt and return the set of `LessonNN.lesson` references.
    Returns the matching `LessonNN.kt` filenames, or None if the file is missing.
    """
    data_file = data_dir / "LessonData.kt"
    if not data_file.is_file():
        return None
    text = data_file.read_text(encoding="utf-8")
    # Capture both `LessonNN.lesson` and `LessonNN`
    refs = re.findall(r"\bLesson(\d{1,3})\b", text)
    if not refs:
        return None
    return {f"Lesson{int(r):02d}.kt" for r in set(refs)}


def main() -> int:
    files = sorted(LESSONS_DIR.glob("Lesson*.kt"))
    if not files:
        print(f"No lesson files found in {LESSONS_DIR}", file=sys.stderr)
        return 1
    referenced = referenced_lesson_files(LESSONS_DIR.parent)
    if referenced:
        before = len(files)
        files = [p for p in files if p.name in referenced]
        skipped = before - len(files)
        if skipped:
            print(f"Skipping {skipped} Lesson*.kt file(s) not referenced by LessonData.kt", file=sys.stderr)
    lessons = [parse_lesson_file(p) for p in files]
    lessons.sort(key=lambda l: l["id"])
    OUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    OUT_FILE.write_text(
        json.dumps(lessons, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {len(lessons)} lessons to {OUT_FILE}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
