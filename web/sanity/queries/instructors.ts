import {defineQuery} from 'next-sanity'

export const ALL_INSTRUCTORS_QUERY = defineQuery(`
  *[_type == "instructor"] | order(name asc) {
    _id, name, "slug": slug.current,
    photo {alt, asset->{_id, url, metadata {lqip, dimensions}}},
    expertise,
    "courseCount": count(*[_type == "course" && instructor._ref == ^._id])
  }
`)

export const INSTRUCTOR_BY_SLUG_QUERY = defineQuery(`
  *[_type == "instructor" && slug.current == $slug][0] {
    _id, name, "slug": slug.current,
    photo {alt, asset->{_id, url, metadata {lqip, dimensions}}},
    expertise, bio[]{...},
    "courses": *[_type == "course" && instructor._ref == ^._id] | order(title asc) {
      _id, title, "slug": slug.current, summary,
      coverImage {alt, asset->{_id, url, metadata {lqip, dimensions}}},
      level, price, popular, studentCount,
      "moduleCount": count(modules),
      "lessonCount": count(modules[].lessons[]),
      "duration": math::sum(modules[].lessons[]->duration),
      category->{_id, title, "slug": slug.current}
    }
  }
`)
