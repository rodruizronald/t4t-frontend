import { getDateRange, isDateFilterActive } from './dateUtils'
import { FILTER_TYPES } from '../constants/job/filterTypes'

/**
 * Build API query parameters from frontend search state
 * @param {string} searchQuery - The search query string
 * @param {Object} activeFilters - Active filters from frontend
 * @param {Object} pagination - Pagination parameters
 * @returns {Object} Query parameters object for API
 */
export const buildApiParams = (
  searchQuery = '',
  activeFilters = {},
  pagination = {}
) => {
  const params = {}

  // Add search query
  if (searchQuery && searchQuery.trim()) {
    params.q = searchQuery.trim()
  }

  // Add date range filters
  if (isDateFilterActive(activeFilters.date)) {
    const dateRange = getDateRange(activeFilters.date)
    params.date_from = dateRange.date_from
    params.date_to = dateRange.date_to
  }

  // Add company filters
  if (activeFilters.company && activeFilters.company.length > 0) {
    params.company = activeFilters.company.join(',')
  }

  // Add experience level filters
  if (activeFilters.experience && activeFilters.experience.length > 0) {
    params.experience_level = activeFilters.experience.join(',')
  }

  // Add work mode filters
  if (activeFilters.mode && activeFilters.mode.length > 0) {
    params.work_mode = activeFilters.mode.join(',')
  }

  // Add employment type filters
  if (activeFilters.type && activeFilters.type.length > 0) {
    params.employment_type = activeFilters.type.join(',')
  }

  // Add pagination parameters
  const { page = 1, pageSize = 20 } = pagination
  params.limit = pageSize
  params.offset = (page - 1) * pageSize

  return params
}

/**
 * Convert params object to URL search string
 * @param {Object} params - Parameters object
 * @returns {string} URL search string (without leading ?)
 */
export const paramsToSearchString = params => {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value.toString())
    }
  })

  return searchParams.toString()
}

/**
 * Build complete API URL with query parameters
 * @param {string} baseUrl - Base API URL
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Query parameters
 * @returns {string} Complete URL with query string
 */
export const buildApiUrl = (baseUrl, endpoint, params) => {
  const searchString = paramsToSearchString(params)
  const separator = endpoint.includes('?') ? '&' : '?'

  return searchString
    ? `${baseUrl}${endpoint}${separator}${searchString}`
    : `${baseUrl}${endpoint}`
}

/**
 * Get human-readable description of active filters
 * @param {Object} activeFilters - Active filters from frontend
 * @param {string} searchQuery - Search query string
 * @returns {string} Description of current search/filter state
 */
export const getSearchDescription = (activeFilters, searchQuery) => {
  const descriptions = []

  if (searchQuery && searchQuery.trim()) {
    descriptions.push(`searching for "${searchQuery.trim()}"`)
  }

  if (isDateFilterActive(activeFilters.date)) {
    descriptions.push(`posted ${activeFilters.date}`)
  }

  if (activeFilters.company && activeFilters.company.length > 0) {
    descriptions.push(`at ${activeFilters.company.length} companies`)
  }

  if (activeFilters.experience && activeFilters.experience.length > 0) {
    descriptions.push(`${activeFilters.experience.length} experience levels`)
  }

  if (activeFilters.mode && activeFilters.mode.length > 0) {
    descriptions.push(`${activeFilters.mode.length} work modes`)
  }

  if (activeFilters.type && activeFilters.type.length > 0) {
    descriptions.push(`${activeFilters.type.length} job types`)
  }

  return descriptions.length > 0 ? descriptions.join(', ') : 'all jobs'
}

/**
 * Count total number of active filters
 * @param {Object} activeFilters - Active filters from frontend
 * @returns {number} Total count of active filters
 */
export const getActiveFilterCount = activeFilters => {
  let count = 0

  if (isDateFilterActive(activeFilters.date)) count++
  if (activeFilters.company && activeFilters.company.length > 0) count++
  if (activeFilters.experience && activeFilters.experience.length > 0) count++
  if (activeFilters.mode && activeFilters.mode.length > 0) count++
  if (activeFilters.type && activeFilters.type.length > 0) count++

  return count
}
