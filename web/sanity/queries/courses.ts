import {defineQuery} from 'next-sanity'

export const ALL_COURSES_QUERY = defineQuery(`
  *[_type == "course"] | order(title asc) {
    _id, title, "slug": slug.current, summary,
    coverImage {alt, asset->{_id, url, metadata {lqip, dimensions}}},
    level, price, popular, studentCount,
    "moduleCount": count(modules),
    "lessonCount": count(modules[].lessons[]),
    "duration": math::sum(modules[].lessons[]->duration),
    instructor->{_id, name, "slug": slug.current},
    category->{_id, title, "slug": slug.current}
  }
`)

export const POPULAR_COURSES_QUERY = defineQuery(`
  *[_type == "course" && popular == true] | order(studentCount desc, title asc) {
    _id, title, "slug": slug.current, summary,
    coverImage {alt, asset->{_id, url, metadata {lqip, dimensions}}},
    level, price, popular, studentCount,
    "moduleCount": count(modules),
    "lessonCount": count(modules[].lessons[]),
    "duration": math::sum(modules[].lessons[]->duration),
    instructor->{_id, name, "slug": slug.current},
    category->{_id, title, "slug": slug.current}
  }
`)

export const COURSE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "course" && slug.current == $slug][0] {
    _id, title, "slug": slug.current, summary,
    coverImage {alt, asset->{_id, url, metadata {lqip, dimensions}}},
    level, price, popular, studentCount,
    learningOutcomes[]{_key, icon, title, description},
    instructor->{
      _id, name, "slug": slug.current,
      photo {alt, asset->{_id, url, metadata {lqip, dimensions}}},
      expertise
    },
    category->{_id, title, "slug": slug.current, description},
    modules[]{
      _key, title, summary,
      lessons[]->{
        _id, title, "slug": slug.current,
        thumbnail {alt, asset->{_id, url, metadata {lqip, dimensions}}},
        duration, freePreview, studentCount, keyPoints
      }
    }
  }
`)
