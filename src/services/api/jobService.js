import { getApiBaseUrl } from './config'

/**
 * Job API service
 */
class JobService {
  constructor() {
    this.baseUrl = getApiBaseUrl()
  }

  /**
   * Search for jobs (placeholder - will be implemented in later steps)
   * @param {string} searchQuery - The search query
   * @param {Object} filters - The active filters
   * @param {Object} pagination - Pagination parameters
   * @returns {Promise} API response promise
   */
  async searchJobs(searchQuery, filters = {}, pagination = {}) {
    // TODO: Implement in Step 6
    console.log('JobService.searchJobs called with:', {
      searchQuery,
      filters,
      pagination,
      baseUrl: this.baseUrl,
    })

    // Return mock structure for now
    return Promise.resolve({
      data: [],
      pagination: {
        total: 0,
        limit: 20,
        offset: 0,
        has_more: false,
      },
    })
  }
}

// Export singleton instance
export const jobService = new JobService()
export default jobService
