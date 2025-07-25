import { config } from '@app/config'

import type { FilterState } from '../constants/defaultFilters'
import type { SearchResponse } from '../types/models'
import type { PaginationParams } from '../types/pagination'
import { buildApiParams, buildApiUrl } from './paramsBuilder'
import { transformSearchResponse } from './transformer'

/**
 * Error response from the job API
 */
interface ApiError {
  message: string
  type: string
}

/**
 * Extended search response with possible error
 */
interface SearchResponseWithError extends SearchResponse {
  error?: ApiError
}

/**
 * Job API service
 */
class JobService {
  private baseUrl: string

  constructor() {
    this.baseUrl = config.apiUrl
  }

  /**
   * Search for jobs using the API
   * @param searchQuery - The search query
   * @param filters - The active filters
   * @param pagination - Pagination parameters
   * @returns API response promise
   */
  async searchJobs(
    searchQuery: string,
    filters: Partial<FilterState> = {},
    pagination: PaginationParams = {}
  ): Promise<SearchResponseWithError> {
    try {
      // Build API parameters
      const apiParams = buildApiParams(searchQuery, filters, pagination)
      const apiUrl = buildApiUrl(this.baseUrl, '/jobs', apiParams)

      // Make the API call
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(
          `API request failed: ${response.status} ${response.statusText}`
        )
      }

      // Parse response
      const rawData = await response.json()
      console.log('Raw API Data:', rawData)

      // Transform response to frontend format
      const transformedData = transformSearchResponse(rawData)
      console.log('Transformed Data:', transformedData)

      return transformedData
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'

      return {
        jobs: [],
        pagination: {
          total: 0,
          limit: pagination.pageSize ?? 20,
          offset: ((pagination.page ?? 1) - 1) * (pagination.pageSize ?? 20),
          hasMore: false,
        },
        error: {
          message: errorMessage,
          type: 'API_ERROR',
        },
      }
    }
  }
}

// Export singleton instance
export const jobService = new JobService()
export default jobService
