import { FILTER_TYPES, type FilterType } from './filterTypes'

// Date filter constants
export const DATE_VALUES = {
  ANY: 'any',
  MONTH: 'month',
  WEEK: 'week',
  HOURS_24: '24hours',
} as const

export type DateValue = (typeof DATE_VALUES)[keyof typeof DATE_VALUES]

// Date options with proper typing
export const DATE_OPTIONS: ReadonlyArray<{ value: DateValue; label: string }> =
  [
    { value: DATE_VALUES.ANY, label: 'Any time' },
    { value: DATE_VALUES.MONTH, label: 'Past month' },
    { value: DATE_VALUES.WEEK, label: 'Past week' },
    { value: DATE_VALUES.HOURS_24, label: 'Past 24 hours' },
  ] as const

// Company options
export const COMPANY_OPTIONS: readonly string[] = [
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
] as const

// Experience options
export const EXPERIENCE_OPTIONS: readonly string[] = [
  'Entry-level',
  'Mid-level',
  'Senior',
  'Manager',
  'Director',
  'Executive',
] as const

// Work mode options
export const MODE_OPTIONS: readonly string[] = [
  'Remote',
  'Hybrid',
  'On-site',
] as const

// Employment type options
export const TYPE_OPTIONS: readonly string[] = [
  'Full-time',
  'Part-time',
  'Contractor',
  'Temporary',
  'Internship',
] as const

// Combined filter options with proper typing
export const FILTER_OPTIONS: Record<
  FilterType,
  readonly string[] | ReadonlyArray<{ value: DateValue; label: string }>
> = {
  [FILTER_TYPES.DATE]: DATE_OPTIONS,
  [FILTER_TYPES.COMPANY]: COMPANY_OPTIONS,
  [FILTER_TYPES.EXPERIENCE]: EXPERIENCE_OPTIONS,
  [FILTER_TYPES.MODE]: MODE_OPTIONS,
  [FILTER_TYPES.TYPE]: TYPE_OPTIONS,
} as const

// Export types for use in components
export type CompanyOption = (typeof COMPANY_OPTIONS)[number]
export type ExperienceOption = (typeof EXPERIENCE_OPTIONS)[number]
export type ModeOption = (typeof MODE_OPTIONS)[number]
export type TypeOption = (typeof TYPE_OPTIONS)[number]
