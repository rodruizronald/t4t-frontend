import { DATE_VALUES } from '../constants/filterOptions'

/**
 * Convert frontend date filter to API date range
 * @param {string} dateFilter - Date filter value from frontend
 * @returns {Object} Object with date_from and date_to for API
 */
export const getDateRange = dateFilter => {
  const now = new Date()

  switch (dateFilter) {
    case DATE_VALUES.HOURS_24:
      return {
        date_from: formatDateForApi(getDateDaysAgo(1)),
        date_to: formatDateForApi(now),
      }

    case DATE_VALUES.WEEK:
      return {
        date_from: formatDateForApi(getDateDaysAgo(7)),
        date_to: formatDateForApi(now),
      }

    case DATE_VALUES.MONTH:
      return {
        date_from: formatDateForApi(getDateDaysAgo(30)),
        date_to: formatDateForApi(now),
      }

    case DATE_VALUES.ANY:
    default:
      // "Any time" = last 3 months as discussed
      return {
        date_from: formatDateForApi(getDateDaysAgo(90)),
        date_to: formatDateForApi(now),
      }
  }
}

/**
 * Get a date X days ago from now
 * @param {number} daysAgo - Number of days to subtract
 * @returns {Date} Date object for X days ago
 */
const getDateDaysAgo = daysAgo => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date
}

/**
 * Format date for API (YYYY-MM-DD format)
 * @param {Date} date - Date object to format
 * @returns {string} Date string in YYYY-MM-DD format
 */
const formatDateForApi = date => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

/**
 * Get human-readable description of date range
 * @param {string} dateFilter - Date filter value from frontend
 * @returns {string} Human-readable description
 */
export const getDateRangeDescription = dateFilter => {
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
 * @param {string} dateFilter - Date filter value from frontend
 * @returns {boolean} True if filter is active
 */
export const isDateFilterActive = dateFilter => {
  return dateFilter && dateFilter !== DATE_VALUES.ANY
}
