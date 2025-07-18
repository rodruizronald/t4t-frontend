import { format, subDays } from 'date-fns'

import { DATE_VALUES, type DateValue } from '../constants/filterOptions'

/**
 * Date range object for API requests
 */
export interface DateRange {
  date_from: string
  date_to: string
}

/**
 * Convert frontend date filter to API date range
 * @param dateFilter - Date filter value from frontend
 * @returns Object with date_from and date_to for API
 */
export const getDateRange = (dateFilter: DateValue): DateRange => {
  const now = new Date()

  switch (dateFilter) {
    case DATE_VALUES.HOURS_24:
      return {
        date_from: formatDateForApi(subDays(now, 1)),
        date_to: formatDateForApi(now),
      }

    case DATE_VALUES.WEEK:
      return {
        date_from: formatDateForApi(subDays(now, 7)),
        date_to: formatDateForApi(now),
      }

    case DATE_VALUES.MONTH:
      return {
        date_from: formatDateForApi(subDays(now, 30)),
        date_to: formatDateForApi(now),
      }

    case DATE_VALUES.ANY:
    default:
      // "Any time" = last 3 months as discussed
      return {
        date_from: formatDateForApi(subDays(now, 90)),
        date_to: formatDateForApi(now),
      }
  }
}

/**
 * Format date for API (YYYY-MM-DD format)
 * @param date - Date object to format
 * @returns Date string in YYYY-MM-DD format
 */
const formatDateForApi = (date: Date): string => format(date, 'yyyy-MM-dd')

/**
 * Get human-readable description of date range
 * @param dateFilter - Date filter value from frontend
 * @returns Human-readable description
 */
export const getDateRangeDescription = (dateFilter: DateValue): string => {
  switch (dateFilter) {
    case DATE_VALUES.HOURS_24:
      return 'Jobs posted in the last 24 hours'

    case DATE_VALUES.WEEK:
      return 'Jobs posted in the last week'

    case DATE_VALUES.MONTH:
      return 'Jobs posted in the last month'

    case DATE_VALUES.ANY:
    default:
      return 'Jobs posted in the last 3 months'
  }
}

/**
 * Check if a date filter is active (not "any")
 * @param dateFilter - Date filter value from frontend
 * @returns True if filter is active
 */
export const isDateFilterActive = (dateFilter: DateValue | null): boolean => {
  return dateFilter !== null && dateFilter !== DATE_VALUES.ANY
}
