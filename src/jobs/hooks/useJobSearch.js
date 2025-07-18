import { useState, useCallback } from 'react'
import { jobService } from '../services/jobService'

/**
 * Custom hook for managing job search API calls
 * No UI state management - just API functionality
 */
export function useJobSearch() {
  const [searchState, setSearchState] = useState({
    jobs: [],
    pagination: null,
    lastSearchParams: null,
  })

  /**
   * Perform job search API call
   * @param {string} searchQuery - Search query string
   * @param {Object} filters - Active filters object
   * @param {Object} pagination - Pagination parameters
   * @returns {Promise} API response promise
   */
  const searchJobs = useCallback(
    async (searchQuery, filters, pagination) => {
      // Prevent duplicate requests
      const currentParams = JSON.stringify({ searchQuery, filters, pagination })
      if (currentParams === searchState.lastSearchParams) {
        console.log('Skipping duplicate search request')
        return searchState
      }

      console.log('Starting job search API call...', {
        searchQuery,
        filters,
        pagination,
      })

      try {
        // Make API call
        const result = await jobService.searchJobs(
          searchQuery,
          filters,
          pagination
        )

        console.log('Job search API successful:', {
          jobCount: result.jobs?.length || 0,
          pagination: result.pagination,
        })

        // Update state
        const newState = {
          jobs: result.jobs || [],
          pagination: result.pagination || null,
          lastSearchParams: currentParams,
        }

        setSearchState(newState)
        return newState
      } catch (error) {
        // Reset state on error
        const errorState = {
          jobs: [],
          pagination: null,
          lastSearchParams: currentParams,
        }

        setSearchState(errorState)

        // Re-throw for caller to handle if needed
        throw error
      }
    },
    [searchState] // Fixed: Include searchState in dependencies
  )

  /**
   * Clear search results and reset state
   */
  const clearSearch = useCallback(() => {
    console.log('Clearing search results')
    setSearchState({
      jobs: [],
      pagination: null,
      lastSearchParams: null,
    })
  }, [])

  /**
   * Retry the last search with same parameters
   */
  const retrySearch = useCallback(async () => {
    if (searchState.lastSearchParams) {
      console.log('Retrying last search...')
      const params = JSON.parse(searchState.lastSearchParams)

      // Temporarily clear lastSearchParams to allow retry
      setSearchState(prev => ({ ...prev, lastSearchParams: null }))

      return await searchJobs(
        params.searchQuery,
        params.filters,
        params.pagination
      )
    } else {
      console.warn('No previous search to retry')
    }
  }, [searchState.lastSearchParams, searchJobs])

  return {
    // State (read-only)
    jobs: searchState.jobs,
    pagination: searchState.pagination,

    // Actions
    searchJobs,
    clearSearch,
    retrySearch,
  }
}
