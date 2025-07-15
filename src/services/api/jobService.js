import { getApiBaseUrl } from './config'
import { buildApiParams, buildApiUrl } from '../../utils/apiParamsBuilder'
import { transformSearchResponse } from '../../utils/transformers/jobTransformer'

/**
 * Job API service
 */
class JobService {
  constructor() {
    this.baseUrl = getApiBaseUrl()
  }

  /**
   * Search for jobs using the API
   * @param {string} searchQuery - The search query
   * @param {Object} filters - The active filters
   * @param {Object} pagination - Pagination parameters
   * @returns {Promise} API response promise
   */
  async searchJobs(searchQuery, filters = {}, pagination = {}) {
    try {
      // Build API parameters
      const apiParams = buildApiParams(searchQuery, filters, pagination)
      const apiUrl = buildApiUrl(this.baseUrl, '/jobs', apiParams)

      console.log('=== API Call Details ===')
      console.log('Search Query:', searchQuery)
      console.log('Filters:', filters)
      console.log('Pagination:', pagination)
      console.log('API Params:', apiParams)
      console.log('API URL:', apiUrl)

      // Make the API call
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })

      console.log('=== API Response ===')
      console.log('Status:', response.status)
      console.log('Status Text:', response.statusText)
      console.log('Headers:', Object.fromEntries(response.headers.entries()))

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
      console.error('=== API Error ===')
      console.error('Error Type:', error.name)
      console.error('Error Message:', error.message)
      console.error('Full Error:', error)

      // Return mock structure for development
      console.log('Returning mock data due to API error')
      return {
        jobs: [],
        pagination: {
          total: 0,
          limit: pagination.pageSize || 20,
          offset: ((pagination.page || 1) - 1) * (pagination.pageSize || 20),
          hasMore: false,
        },
        error: {
          message: error.message,
          type: 'API_ERROR',
        },
      }
    }
  }
}

// Export singleton instance
export const jobService = new JobService()
export default jobService
