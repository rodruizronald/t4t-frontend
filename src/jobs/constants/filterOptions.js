import { FILTER_TYPES } from './filterTypes'

export const DATE_VALUES = {
  ANY: 'any',
  MONTH: 'month',
  WEEK: 'week',
  HOURS_24: '24hours',
}

export const DATE_OPTIONS = [
  { value: DATE_VALUES.ANY, label: 'Any time' },
  { value: DATE_VALUES.MONTH, label: 'Past month' },
  { value: DATE_VALUES.WEEK, label: 'Past week' },
  { value: DATE_VALUES.HOURS_24, label: 'Past 24 hours' },
]

export const COMPANY_OPTIONS = [
  'Canonical',
  'icorp',
  'HCLTech',
  'Blue Yonder',
  'Thales',
  'DXC Technology',
  'Oracle',
  'Varicent',
  'Amazon',
  'Microsoft',
  'Google',
  'Apple',
]

export const EXPERIENCE_OPTIONS = [
  'Entry-level',
  'Mid-level',
  'Senior',
  'Manager',
  'Director',
  'Executive',
]

export const MODE_OPTIONS = ['Remote', 'Hybrid', 'Onsite']

export const TYPE_OPTIONS = [
  'Full-time',
  'Part-time',
  'Contractor',
  'Temporary',
  'Internship',
]

export const FILTER_OPTIONS = {
  [FILTER_TYPES.DATE]: DATE_OPTIONS,
  [FILTER_TYPES.COMPANY]: COMPANY_OPTIONS,
  [FILTER_TYPES.EXPERIENCE]: EXPERIENCE_OPTIONS,
  [FILTER_TYPES.MODE]: MODE_OPTIONS,
  [FILTER_TYPES.TYPE]: TYPE_OPTIONS,
}
