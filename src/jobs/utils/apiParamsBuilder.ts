import { getDateRange, isDateFilterActive } from './dateUtils'
import type { FilterState } from '../constants/defaultFilters'

/**
 * API parameters interface
 */
export interface ApiParams {
  q?: string
  date_from?: string
  date_to?: string
  company?: string
  experience_level?: string
  work_mode?: string
  employment_type?: string
  limit: number
  offset: number
  [key: string]: string | number | undefined
}

/**
 * Search parameters interface for type-safe parameter handling
 */
export interface SearchParams {
  [key: string]: string | number | boolean | undefined | null
}

/**
 * Pagination parameters interface
 */
export interface PaginationParams {
  page?: number
  pageSize?: number
}

/**
 * Build API query parameters from frontend search state
 * @param searchQuery - The search query string
 * @param activeFilters - Active filters from frontend
 * @param pagination - Pagination parameters
 * @returns Query parameters object for API
 */
export const buildApiParams = (
  searchQuery = '',
  activeFilters: Partial<FilterState> = {},
  pagination: PaginationParams = {}
): ApiParams => {
  const params: ApiParams = {
    limit: 20,
    offset: 0,
  }

  // Add search query
  if (searchQuery?.trim()) {
    params.q = searchQuery.trim()
  }

  // Add date range filters
  if (activeFilters.date && isDateFilterActive(activeFilters.date)) {
    const dateRange = getDateRange(activeFilters.date)
    params.date_from = dateRange.date_from
    params.date_to = dateRange.date_to
  }

  // Add company filters
  const companyFilters = activeFilters.company ?? []
  if (companyFilters.length > 0) {
    params.company = companyFilters.join(',')
  }

  // Add experience level filters
  const experienceFilters = activeFilters.experience ?? []
  if (experienceFilters.length > 0) {
    params.experience_level = experienceFilters.join(',')
  }

  // Add work mode filters
  const modeFilters = activeFilters.mode ?? []
  if (modeFilters.length > 0) {
    params.work_mode = modeFilters.join(',')
  }

  // Add employment type filters
  const typeFilters = activeFilters.type ?? []
  if (typeFilters.length > 0) {
    params.employment_type = typeFilters.join(',')
  }

  // Add pagination parameters
  const { page = 1, pageSize = 20 } = pagination
  params.limit = pageSize
  params.offset = (page - 1) * pageSize

  return params
}

/**
 * Convert params object to URL search string
 * @param params - Parameters object
 * @returns URL search string (without leading ?)
 */
export const paramsToSearchString = (params: SearchParams): string => {
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
 * @param baseUrl - Base API URL
 * @param endpoint - API endpoint
 * @param params - Query parameters
 * @returns Complete URL with query string
 */
export const buildApiUrl = (
  baseUrl: string,
  endpoint: string,
  params: SearchParams
): string => {
  const searchString = paramsToSearchString(params)
  const separator = endpoint.includes('?') ? '&' : '?'

  return searchString
    ? `${baseUrl}${endpoint}${separator}${searchString}`
    : `${baseUrl}${endpoint}`
}

/**
 * Get human-readable description of active filters
 * @param activeFilters - Active filters from frontend
 * @param searchQuery - Search query string
 * @returns Description of current search/filter state
 */
export const getSearchDescription = (
  activeFilters: Partial<FilterState>,
  searchQuery = ''
): string => {
  const descriptions: string[] = []

  if (searchQuery?.trim()) {
    descriptions.push(`searching for "${searchQuery.trim()}"`)
  }

  if (activeFilters.date && isDateFilterActive(activeFilters.date)) {
    descriptions.push(`posted ${activeFilters.date}`)
  }

  const companyFilters = activeFilters.company ?? []
  if (companyFilters.length > 0) {
    descriptions.push(`at ${companyFilters.length} companies`)
  }

  const experienceFilters = activeFilters.experience ?? []
  if (experienceFilters.length > 0) {
    descriptions.push(`${experienceFilters.length} experience levels`)
  }

  const modeFilters = activeFilters.mode ?? []
  if (modeFilters.length > 0) {
    descriptions.push(`${modeFilters.length} work modes`)
  }

  const typeFilters = activeFilters.type ?? []
  if (typeFilters.length > 0) {
    descriptions.push(`${typeFilters.length} job types`)
  }

  return descriptions.length > 0 ? descriptions.join(', ') : 'all jobs'
}

/**
 * Count total number of active filters
 * @param activeFilters - Active filters from frontend
 * @returns Total count of active filters
 */
export const getActiveFilterCount = (
  activeFilters: Partial<FilterState>
): number => {
  let count = 0

  if (activeFilters.date && isDateFilterActive(activeFilters.date)) count++

  const companyFilters = activeFilters.company ?? []
  if (companyFilters.length > 0) count++

  const experienceFilters = activeFilters.experience ?? []
  if (experienceFilters.length > 0) count++

  const modeFilters = activeFilters.mode ?? []
  if (modeFilters.length > 0) count++

  const typeFilters = activeFilters.type ?? []
  if (typeFilters.length > 0) count++

  return count
}
