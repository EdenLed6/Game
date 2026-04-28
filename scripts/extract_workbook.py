#!/usr/bin/env python3
"""Extract DigitalCourseWorkbook.kt into web/data/workbook.json.

Output:
{
  "pageTexts":      { "1": "...", "2": "...", ..., "55": "..." },
  "lessonForPage":  { "1": 1, "2": 1, ..., "55": 17 },
  "lessonTitles":   { "1": "Pronunciation and Japanglish", ..., "17": "Course summary" },
  "interactiveExercises": [
      { "id": ..., "lessonId": ..., "pageNumber": ..., "title": ..., "type": ...,
        "prompt": ..., "referenceText": ..., "japaneseToSpeak": ...,
        "hints": [...], "options": [...], "expectedAnswers": [...], "maxAnswerLength": ... },
    ...
  ]
}
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Prefer the read-only mirror at .ui-source/app/; fall back to legacy app/.
def _src_path() -> Path:
    candidates = [
        ROOT / ".ui-source" / "app" / "src" / "main" / "java" / "com" / "nihongo" / "beginner" / "data" / "DigitalCourseWorkbook.kt",
        ROOT / "app"        / "src" / "main" / "java" / "com" / "nihongo" / "beginner" / "data" / "DigitalCourseWorkbook.kt",
    ]
    for c in candidates:
        if c.is_file():
            return c
    return candidates[0]

SRC = _src_path()
OUT = ROOT / "web" / "data" / "workbook.json"

# Match Kotlin's String.japaneseSnippet() in DigitalCourseWorkbook.kt:
#   filter { it in '぀'..'ヿ' || it in '一'..'龯' }.take(80)
def japanese_snippet(text: str) -> str:
    out: list[str] = []
    for ch in text:
        c = ord(ch)
        if 0x3040 <= c <= 0x30FF or 0x4E00 <= c <= 0x9FAF:
            out.append(ch)
    return "".join(out[:80])


def trim_indent(s: str) -> str:
    """Reproduce Kotlin's String.trimIndent(): find the smallest non-blank-line indent and strip it."""
    lines = s.split("\n")
    # Drop leading and trailing blank lines for indent calc, but Kotlin keeps them; just calc min indent of non-blank.
    indents: list[int] = []
    for ln in lines:
        if ln.strip() == "":
            continue
        indents.append(len(ln) - len(ln.lstrip(" \t")))
    common = min(indents) if indents else 0
    out: list[str] = []
    for ln in lines:
        if ln.strip() == "":
            out.append(ln.strip())
        else:
            out.append(ln[common:])
    # Kotlin also strips a leading and trailing line if blank.
    if out and out[0] == "":
        out.pop(0)
    if out and out[-1] == "":
        out.pop()
    return "\n".join(out)


def parse_kotlin_string_at(src: str, i: int) -> tuple[str, int]:
    """Parse Kotlin string starting at src[i]: either "..." or \"\"\"...\"\"\". Returns (value, next_i)."""
    if src.startswith('"""', i):
        # Triple-quoted raw string
        j = i + 3
        end = src.find('"""', j)
        if end == -1:
            raise ValueError("Unterminated triple-quoted string")
        raw = src[j:end]
        # Could be followed by .trimIndent()
        next_i = end + 3
        m = re.match(r"\s*\.\s*trimIndent\s*\(\s*\)", src[next_i:])
        if m:
            raw = trim_indent(raw)
            next_i += m.end()
        return raw, next_i
    if src[i] == '"':
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
                    out.append(chr(int(src[i + 2 : i + 6], 16)))
                    i += 6
                else:
                    out.append(nxt)
                    i += 2
            elif ch == '"':
                return "".join(out), i + 1
            else:
                out.append(ch)
                i += 1
    raise ValueError(f"Expected string literal at {i}: {src[i:i+30]!r}")


def split_args(body: str) -> list[str]:
    parts: list[str] = []
    depth = 0
    cur: list[str] = []
    i = 0
    while i < len(body):
        ch = body[i]
        if body.startswith('"""', i):
            end = body.find('"""', i + 3)
            cur.append(body[i : end + 3])
            i = end + 3
            continue
        if ch == '"':
            j = i + 1
            while j < len(body):
                if body[j] == "\\":
                    j += 2
                    continue
                if body[j] == '"':
                    j += 1
                    break
                j += 1
            cur.append(body[i:j])
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
    out: dict[str, str] = {}
    for a in args:
        m = re.match(r"^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$", a, re.DOTALL)
        if m:
            out[m.group(1)] = m.group(2).strip()
    return out


def find_call(src: str, name: str, start: int = 0) -> tuple[int, int] | None:
    pat = re.compile(rf"\b{re.escape(name)}\s*\(")
    m = pat.search(src, start)
    if not m:
        return None
    open_idx = m.end() - 1
    depth = 0
    i = open_idx
    while i < len(src):
        if src.startswith('"""', i):
            end = src.find('"""', i + 3)
            i = end + 3
            continue
        ch = src[i]
        if ch == '"':
            _, i = parse_kotlin_string_at(src, i)
            continue
        if ch == "(":
            depth += 1
        elif ch == ")":
            depth -= 1
            if depth == 0:
                return open_idx, i
        i += 1
    raise ValueError(f"Unterminated {name}(...)")


# --- Step 1: parse pageTexts -------------------------------------------------

def parse_page_texts(src: str) -> dict[int, str]:
    """Parse `pageTexts: Map<Int, String> = mapOf(N to "..."<.trimIndent()>, ...)`"""
    loc = find_call(src, "mapOf")
    if not loc:
        raise ValueError("mapOf(...) not found")
    oi, ci = loc
    body = src[oi + 1 : ci]
    pages: dict[int, str] = {}
    pos = 0
    n = len(body)
    while pos < n:
        m = re.search(r"(\d+)\s+to\s+", body[pos:])
        if not m:
            break
        page_num = int(m.group(1))
        i = pos + m.end()
        # skip whitespace
        while i < n and body[i] in " \t\n\r":
            i += 1
        text, next_i = parse_kotlin_string_at(body, i)
        pages[page_num] = text
        pos = next_i
    return pages


# --- Step 2: parse lessonForPage and lessonTitle -----------------------------

def parse_lesson_for_page(src: str) -> dict[int, int]:
    """Parse `private fun lessonForPage(page: Int): Int? = when (page) { in 1..3 -> 1; ... }`"""
    m = re.search(r"fun lessonForPage\(page: Int\): Int\?\s*=\s*when\s*\(page\)\s*\{(.+?)\}", src, re.DOTALL)
    if not m:
        return {}
    body = m.group(1)
    out: dict[int, int] = {}
    for line in body.split("\n"):
        line = line.strip()
        rng = re.match(r"in\s+(\d+)\s*\.\.\s*(\d+)\s*->\s*(\d+)", line)
        if rng:
            a, b, lid = int(rng.group(1)), int(rng.group(2)), int(rng.group(3))
            for p in range(a, b + 1):
                out[p] = lid
    return out


def parse_lesson_titles(src: str) -> dict[int, str]:
    m = re.search(r"fun lessonTitle\(lessonId: Int\): String\s*=\s*when\s*\(lessonId\)\s*\{(.+?)\}", src, re.DOTALL)
    if not m:
        return {}
    body = m.group(1)
    titles: dict[int, str] = {}
    pos = 0
    while pos < len(body):
        mm = re.search(r"(\d+)\s*->\s*", body[pos:])
        if not mm:
            break
        lid = int(mm.group(1))
        i = pos + mm.end()
        while i < len(body) and body[i] in " \t\n\r":
            i += 1
        if i >= len(body) or body[i] != '"':
            pos = i + 1
            continue
        text, next_i = parse_kotlin_string_at(body, i)
        titles[lid] = text
        pos = next_i
    return titles


# --- Step 3: parse interactiveExercises --------------------------------------

class StringExpr:
    """Resolve a Kotlin expression composed of string literals, pageText(N), and `+`."""
    def __init__(self, page_texts: dict[int, str]):
        self.page_texts = page_texts

    def page_text(self, n: int) -> str:
        return self.page_texts.get(n, "")

    def evaluate(self, expr: str) -> str:
        expr = expr.strip()
        # Tokenize +
        parts = self._split_plus(expr)
        out_parts: list[str] = []
        for p in parts:
            out_parts.append(self._eval_atom(p.strip()))
        return "".join(out_parts)

    def _split_plus(self, expr: str) -> list[str]:
        parts: list[str] = []
        depth = 0
        cur: list[str] = []
        i = 0
        while i < len(expr):
            ch = expr[i]
            if expr.startswith('"""', i):
                end = expr.find('"""', i + 3)
                cur.append(expr[i : end + 3])
                i = end + 3
                continue
            if ch == '"':
                j = i + 1
                while j < len(expr):
                    if expr[j] == "\\":
                        j += 2
                        continue
                    if expr[j] == '"':
                        j += 1
                        break
                    j += 1
                cur.append(expr[i:j])
                i = j
                continue
            if ch in "([{":
                depth += 1
            elif ch in ")]}":
                depth -= 1
            if ch == "+" and depth == 0:
                parts.append("".join(cur))
                cur = []
                i += 1
                continue
            cur.append(ch)
            i += 1
        parts.append("".join(cur))
        return parts

    def _eval_atom(self, atom: str) -> str:
        atom = atom.strip()
        # Handle suffix .japaneseSnippet()
        snip = False
        m = re.search(r"\.\s*japaneseSnippet\s*\(\s*\)\s*$", atom)
        if m:
            atom = atom[: m.start()].strip()
            snip = True
        # Allow surrounding parens
        while atom.startswith("(") and atom.endswith(")"):
            # Verify matched
            d = 0
            ok = True
            for j, c in enumerate(atom):
                if c == "(":
                    d += 1
                elif c == ")":
                    d -= 1
                    if d == 0 and j != len(atom) - 1:
                        ok = False
                        break
            if not ok:
                break
            atom = atom[1:-1].strip()
        result: str
        if atom.startswith('"'):
            result, _ = parse_kotlin_string_at(atom, 0)
        else:
            m = re.match(r"^pageText\s*\(\s*(\d+)\s*\)\s*$", atom)
            if m:
                result = self.page_text(int(m.group(1)))
            else:
                # Could be a + chain inside parens — fallback to recursive eval
                result = self.evaluate(atom)
        if snip:
            result = japanese_snippet(result)
        return result


def parse_listof_strings(raw: str) -> list[str]:
    m = re.match(r"^\s*listOf\s*\(", raw, re.DOTALL)
    if not m:
        return []
    depth = 0
    i = m.end() - 1
    while i < len(raw):
        if raw.startswith('"""', i):
            end = raw.find('"""', i + 3)
            i = end + 3
            continue
        ch = raw[i]
        if ch == '"':
            _, i = parse_kotlin_string_at(raw, i)
            continue
        if ch == "(":
            depth += 1
        elif ch == ")":
            depth -= 1
            if depth == 0:
                break
        i += 1
    inside = raw[m.end() : i]
    parts = split_args(inside)
    out: list[str] = []
    for p in parts:
        s, _ = parse_kotlin_string_at(p.strip(), 0)
        out.append(s)
    return out


def parse_listof_hints(raw: str) -> list[dict[str, str]]:
    m = re.match(r"^\s*listOf\s*\(", raw, re.DOTALL)
    if not m:
        return []
    depth = 0
    i = m.end() - 1
    while i < len(raw):
        ch = raw[i]
        if raw.startswith('"""', i):
            end = raw.find('"""', i + 3)
            i = end + 3
            continue
        if ch == '"':
            _, i = parse_kotlin_string_at(raw, i)
            continue
        if ch == "(":
            depth += 1
        elif ch == ")":
            depth -= 1
            if depth == 0:
                break
        i += 1
    inside = raw[m.end() : i]
    out: list[dict[str, str]] = []
    pos = 0
    while True:
        loc = find_call(inside, "ExerciseHint", pos)
        if not loc:
            break
        oi, ci = loc
        body = inside[oi + 1 : ci]
        # Hint body is a single string arg (positional)
        s, _ = parse_kotlin_string_at(body.strip(), 0)
        out.append({"text": s})
        pos = ci + 1
    return out


def parse_interactive_exercises(src: str, page_texts: dict[int, str]) -> list[dict]:
    # Locate `private fun interactiveExercises(): List<WorkbookExercise> = listOf(`
    m = re.search(r"fun interactiveExercises\(\).*?=\s*listOf\s*\(", src, re.DOTALL)
    if not m:
        return []
    open_idx = m.end() - 1
    depth = 0
    i = open_idx
    while i < len(src):
        if src.startswith('"""', i):
            end = src.find('"""', i + 3)
            i = end + 3
            continue
        ch = src[i]
        if ch == '"':
            _, i = parse_kotlin_string_at(src, i)
            continue
        if ch == "(":
            depth += 1
        elif ch == ")":
            depth -= 1
            if depth == 0:
                close_idx = i
                break
        i += 1
    inside = src[m.end() : close_idx]

    expr = StringExpr(page_texts)
    out: list[dict] = []
    pos = 0
    while True:
        loc = find_call(inside, "WorkbookExercise", pos)
        if not loc:
            break
        oi, ci = loc
        body = inside[oi + 1 : ci]
        kw = parse_named_args(split_args(body))
        item: dict = {
            "id": expr.evaluate(kw["id"]),
            "lessonId": int(kw["lessonId"]),
            "pageNumber": int(kw["pageNumber"]),
            "title": expr.evaluate(kw["title"]),
            "type": kw["type"].split(".")[-1],
            "prompt": expr.evaluate(kw["prompt"]),
            "referenceText": expr.evaluate(kw["referenceText"]),
            "japaneseToSpeak": expr.evaluate(kw.get("japaneseToSpeak", '""')),
            "hints": parse_listof_hints(kw.get("hints", "listOf()")),
            "options": parse_listof_strings(kw.get("options", "listOf()")),
            "expectedAnswers": parse_listof_strings(kw.get("expectedAnswers", "listOf()")),
            "maxAnswerLength": int(kw.get("maxAnswerLength", "800")),
        }
        out.append(item)
        pos = ci + 1
    return out


def main() -> int:
    src = SRC.read_text(encoding="utf-8")
    pages = parse_page_texts(src)
    lesson_for_page = parse_lesson_for_page(src)
    titles = parse_lesson_titles(src)
    interactive = parse_interactive_exercises(src, pages)

    output = {
        "pageTexts": {str(k): v for k, v in sorted(pages.items())},
        "lessonForPage": {str(k): v for k, v in sorted(lesson_for_page.items())},
        "lessonTitles": {str(k): v for k, v in sorted(titles.items())},
        "interactiveExercises": interactive,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(
        f"Wrote workbook: {len(pages)} pages, {len(interactive)} interactive exercises, "
        f"{len(lesson_for_page)} page→lesson mappings, {len(titles)} titles."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
