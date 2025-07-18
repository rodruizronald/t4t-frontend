import { FILTER_TYPES } from './filterTypes'
import { DATE_VALUES } from './filterOptions'
import type {
  DateValue,
  CompanyOption,
  ExperienceOption,
  ModeOption,
  TypeOption,
} from './filterOptions'

// Type for individual filter values
export type FilterValue =
  | DateValue
  | CompanyOption[]
  | ExperienceOption[]
  | ModeOption[]
  | TypeOption[]
  | null

// Type for the complete filter state
export interface FilterState {
  [FILTER_TYPES.DATE]: DateValue | null
  [FILTER_TYPES.COMPANY]: CompanyOption[] | null
  [FILTER_TYPES.EXPERIENCE]: ExperienceOption[] | null
  [FILTER_TYPES.MODE]: ModeOption[] | null
  [FILTER_TYPES.TYPE]: TypeOption[] | null
}

export const DEFAULT_EMPTY_FILTERS: FilterState = {
  [FILTER_TYPES.DATE]: DATE_VALUES.ANY,
  [FILTER_TYPES.COMPANY]: [],
  [FILTER_TYPES.EXPERIENCE]: [],
  [FILTER_TYPES.MODE]: [],
  [FILTER_TYPES.TYPE]: [],
} as const

export const DEFAULT_REFERENCE_FILTERS: FilterState = {
  [FILTER_TYPES.DATE]: null,
  [FILTER_TYPES.COMPANY]: null,
  [FILTER_TYPES.EXPERIENCE]: null,
  [FILTER_TYPES.MODE]: null,
  [FILTER_TYPES.TYPE]: null,
} as const
