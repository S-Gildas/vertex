import {UserIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const instructor = defineType({
  name: 'instructor',
  title: 'Instructor',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required().min(2).max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'imageWithAlt',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'expertise',
      title: 'Expertise',
      type: 'array',
      description: 'Short topics learners will recognize, such as Next.js or accessibility.',
      of: [defineArrayMember({type: 'string'})],
      validation: (rule) => rule.required().min(1).max(8).unique(),
    }),
    defineField({
      name: 'bio',
      title: 'Biography',
      type: 'portableText',
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'expertise.0', media: 'photo'},
  },
})
