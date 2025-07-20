import type {
  CompanyOption,
  DateValue,
  ExperienceOption,
  ModeOption,
  TypeOption,
} from './filterOptions'
import { DATE_VALUES } from './filterOptions'
import { FILTER_TYPES, FilterType } from './filterTypes'

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

// Type for the anchor elements for each filter
export type AnchorFilters = Record<FilterType, HTMLElement | null>

export const DEFAULT_FILTER_STATE = {
  FILTERS: {
    [FILTER_TYPES.DATE]: DATE_VALUES.ANY,
    [FILTER_TYPES.COMPANY]: [],
    [FILTER_TYPES.EXPERIENCE]: [],
    [FILTER_TYPES.MODE]: [],
    [FILTER_TYPES.TYPE]: [],
  } as const satisfies FilterState,

  ANCHORS: {
    [FILTER_TYPES.DATE]: null,
    [FILTER_TYPES.COMPANY]: null,
    [FILTER_TYPES.EXPERIENCE]: null,
    [FILTER_TYPES.MODE]: null,
    [FILTER_TYPES.TYPE]: null,
  } as const satisfies AnchorFilters,
} as const

// Export the type for DEFAULT_FILTER_STATE
export type DefaultFilterState = typeof DEFAULT_FILTER_STATE
