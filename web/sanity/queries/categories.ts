import {defineQuery} from 'next-sanity'

export const ALL_CATEGORIES_QUERY = defineQuery(`
  *[_type == "category"] | order(title asc) {
    _id, title, "slug": slug.current, description,
    "courseCount": count(*[_type == "course" && category._ref == ^._id])
  }
`)

export const CATEGORY_BY_SLUG_QUERY = defineQuery(`
  *[_type == "category" && slug.current == $slug][0] {
    _id, title, "slug": slug.current, description,
    "courses": *[_type == "course" && category._ref == ^._id] | order(title asc) {
      _id, title, "slug": slug.current, summary,
      coverImage {alt, asset->{_id, url, metadata {lqip, dimensions}}},
      level, price, popular, studentCount,
      "moduleCount": count(modules),
      "lessonCount": count(modules[].lessons[]),
      "duration": math::sum(modules[].lessons[]->duration),
      instructor->{_id, name, "slug": slug.current}
    }
  }
`)
