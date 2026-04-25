package com.nihongo.beginner.data

import com.nihongo.beginner.data.lessons.*

object LessonData {
    fun getAllLessons(): List<Lesson> = listOf(
        Lesson01.lesson,
        Lesson02.lesson,
        Lesson03.lesson,
        Lesson04.lesson,
        Lesson05.lesson,
        Lesson06.lesson,
        Lesson07.lesson,
        Lesson08.lesson,
        Lesson09.lesson,
        Lesson10.lesson,
        Lesson11.lesson,
        Lesson12.lesson,
        Lesson13.lesson,
        Lesson14.lesson,
        Lesson15.lesson,
        Lesson16.lesson,
        Lesson17.lesson,
        Lesson18.lesson,
        Lesson19.lesson,
        Lesson20.lesson,
        Lesson21.lesson,
        Lesson22.lesson,
        Lesson23.lesson
    )

    fun getLessonById(id: Int): Lesson? = getAllLessons().find { it.id == id }
}
