import {category} from './documents/category'
import {course} from './documents/course'
import {instructor} from './documents/instructor'
import {lesson} from './documents/lesson'
import {courseModule} from './objects/courseModule'
import {imageWithAlt} from './objects/imageWithAlt'
import {learningOutcome} from './objects/learningOutcome'
import {portableText} from './objects/portableText'
import {resource} from './objects/resource'

export const schema = {
  types: [
    course,
    lesson,
    instructor,
    category,
    courseModule,
    learningOutcome,
    resource,
    portableText,
    imageWithAlt,
  ],
}
