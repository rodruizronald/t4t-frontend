export const FILTER_TYPES = {
  DATE: 'date',
  COMPANY: 'company',
  EXPERIENCE: 'experience',
  MODE: 'mode',
  TYPE: 'type',
} as const

// FilterType = the VALUES (right side) - "date" | "company" | "experience" | "mode" | "type"
export type FilterType = typeof FILTER_TYPES[keyof typeof FILTER_TYPES]

// FilterTypeKey = the KEYS (left side) - "DATE" | "COMPANY" | "EXPERIENCE" | "MODE" | "TYPE"
export type FilterTypeKey = keyof typeof FILTER_TYPES