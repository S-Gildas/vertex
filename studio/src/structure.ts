import type {StructureResolver} from 'sanity/structure'

const contentTypes = ['course', 'lesson', 'instructor', 'category']

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Vertex content')
    .items([
      S.documentTypeListItem('course').title('Courses'),
      S.documentTypeListItem('lesson').title('Lessons'),
      S.divider(),
      S.documentTypeListItem('instructor').title('Instructors'),
      S.documentTypeListItem('category').title('Categories'),
      ...S.documentTypeListItems().filter(
        (item) => !contentTypes.includes(item.getId() ?? ''),
      ),
    ])
