import {BulbOutlineIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const learningOutcome = defineType({
  name: 'learningOutcome',
  title: 'Learning outcome',
  type: 'object',
  icon: BulbOutlineIcon,
  fields: [
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Choose the semantic icon that best represents this outcome.',
      options: {
        list: [
          {title: 'Code', value: 'code'},
          {title: 'Compass', value: 'compass'},
          {title: 'Gauge', value: 'gauge'},
          {title: 'Layers', value: 'layers'},
          {title: 'Lightbulb', value: 'lightbulb'},
          {title: 'Play', value: 'play'},
          {title: 'Puzzle', value: 'puzzle'},
          {title: 'Rocket', value: 'rocket'},
          {title: 'Shield', value: 'shield'},
          {title: 'Sparkles', value: 'sparkles'},
          {title: 'Target', value: 'target'},
          {title: 'Workflow', value: 'workflow'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required().min(3).max(80),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().min(10).max(240),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'description'},
  },
})
