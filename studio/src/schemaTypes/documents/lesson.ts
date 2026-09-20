import {PlayIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const lesson = defineType({
  name: 'lesson',
  title: 'Lesson',
  type: 'document',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required().min(3).max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description: 'The canonical YouTube, Vimeo, or Bunny video URL.',
      validation: (rule) => rule.required().uri({scheme: ['https']}),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail image',
      type: 'imageWithAlt',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'duration',
      title: 'Duration (seconds)',
      type: 'number',
      validation: (rule) => rule.required().integer().positive().max(86400),
    }),
    defineField({
      name: 'freePreview',
      title: 'Free preview',
      type: 'boolean',
      description: 'Presentational label only; this does not grant access.',
      initialValue: false,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'studentCount',
      title: 'Student count',
      type: 'number',
      description: 'Optional display-only count.',
      validation: (rule) => rule.integer().min(0),
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'portableText',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'keyPoints',
      title: 'Key points',
      type: 'array',
      description: 'The concise “In this lesson you will” list.',
      of: [
        defineArrayMember({
          type: 'string',
          validation: (rule) => rule.min(5).max(180),
        }),
      ],
      validation: (rule) => rule.required().min(1).max(8).unique(),
    }),
    defineField({
      name: 'proTip',
      title: 'Pro tip',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(320),
    }),
    defineField({
      name: 'resources',
      title: 'Resources',
      type: 'array',
      of: [defineArrayMember({type: 'resource'})],
      validation: (rule) => rule.max(12),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      duration: 'duration',
      media: 'thumbnail',
    },
    prepare({title, duration, media}) {
      const minutes = duration ? Math.ceil(duration / 60) : 0
      return {title, subtitle: minutes ? `${minutes} min` : 'Duration not set', media}
    },
  },
})
