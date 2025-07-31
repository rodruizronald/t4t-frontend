import type { ApiError } from '@services/api/client'
import { apiClient } from '@services/api/client'

import type { FilterState } from '../constants/defaultFilters'
import type { ApiSearchResponse } from '../types/api'
import type { SearchResponse } from '../types/models'
import type { PaginationParams } from '../types/pagination'
import { buildApiParams } from './paramsBuilder'
import { transformSearchResponse } from './transformer'

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

      // Make the API call using ApiClient
      const rawData = await apiClient.get<ApiSearchResponse>('/jobs', {
        params: apiParams,
      })

      // Transform response to frontend format
      const transformedData = transformSearchResponse(rawData)

      return transformedData
    } catch (error) {
      // ApiClient already handles error transformation
      const apiError = error as ApiError

      return {
        jobs: [],
        pagination: {
          total: 0,
          limit: pagination.pageSize ?? 20,
          offset: ((pagination.page ?? 1) - 1) * (pagination.pageSize ?? 20),
          hasMore: false,
        },
        error: apiError,
      }
    }
  }
}

// Export singleton instance
export const jobService = new JobService()
export default jobService
