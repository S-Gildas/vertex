import 'server-only'

import type {
  ALL_CATEGORIES_QUERY_RESULT,
  ALL_COURSES_QUERY_RESULT,
  ALL_INSTRUCTORS_QUERY_RESULT,
  CATEGORY_BY_SLUG_QUERY_RESULT,
  COURSE_BY_SLUG_QUERY_RESULT,
  INSTRUCTOR_BY_SLUG_QUERY_RESULT,
  LESSON_BY_SLUG_QUERY_RESULT,
} from '../../sanity.types'
import {client} from '../lib/client'
import {
  ALL_CATEGORIES_QUERY,
  ALL_COURSES_QUERY,
  ALL_INSTRUCTORS_QUERY,
  CATEGORY_BY_SLUG_QUERY,
  COURSE_BY_SLUG_QUERY,
  INSTRUCTOR_BY_SLUG_QUERY,
  LESSON_BY_SLUG_QUERY,
  POPULAR_COURSES_QUERY,
} from '../queries'

const readOptions = {next: {revalidate: 3600}}

export type CourseCard = ALL_COURSES_QUERY_RESULT[number]
export type CourseDetail = NonNullable<COURSE_BY_SLUG_QUERY_RESULT>
export type LessonRecord = NonNullable<LESSON_BY_SLUG_QUERY_RESULT>
export type InstructorCard = ALL_INSTRUCTORS_QUERY_RESULT[number]
export type InstructorDetail = NonNullable<INSTRUCTOR_BY_SLUG_QUERY_RESULT>
export type CategoryCard = ALL_CATEGORIES_QUERY_RESULT[number]
export type CategoryDetail = NonNullable<CATEGORY_BY_SLUG_QUERY_RESULT>

export function getCourses() {
  return client.fetch(ALL_COURSES_QUERY, {}, readOptions)
}

export function getPopularCourses() {
  return client.fetch(POPULAR_COURSES_QUERY, {}, readOptions)
}

export function getCourseBySlug(slug: string) {
  return client.fetch(COURSE_BY_SLUG_QUERY, {slug}, readOptions)
}

export async function getLessonBySlug(slug: string) {
  const lesson = await client.fetch(LESSON_BY_SLUG_QUERY, {slug}, readOptions)
  if (!lesson) return null

  const {course, ...lessonFields} = lesson
  if (!course) return {...lessonFields, course: null}

  const {modules, ...courseFields} = course
  const courseModules = modules ?? []
  const moduleIndex = courseModules.findIndex((module) =>
    (module.lessons ?? []).some((item) => item?._id === lesson._id),
  )
  const courseModule = moduleIndex >= 0 ? courseModules[moduleIndex] : null
  const lessonIndex = courseModule?.lessons?.findIndex((item) => item?._id === lesson._id) ?? -1

  return {
    ...lessonFields,
    course: {
      ...courseFields,
      modules: courseModules,
      module:
        courseModule && lessonIndex >= 0
          ? {
              _key: courseModule._key,
              title: courseModule.title,
              summary: courseModule.summary,
              moduleIndex,
              lessonIndex,
            }
          : null,
    },
  }
}

export function getInstructors() {
  return client.fetch(ALL_INSTRUCTORS_QUERY, {}, readOptions)
}

export function getInstructorBySlug(slug: string) {
  return client.fetch(INSTRUCTOR_BY_SLUG_QUERY, {slug}, readOptions)
}

export function getCategories() {
  return client.fetch(ALL_CATEGORIES_QUERY, {}, readOptions)
}

export function getCategoryBySlug(slug: string) {
  return client.fetch(CATEGORY_BY_SLUG_QUERY, {slug}, readOptions)
}
