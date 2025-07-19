import { useCallback, useState } from 'react'

import { jobService } from '../api/jobService'
import type { FilterState } from '../constants/defaultFilters'
import type { Job } from '../types/models'
import type { PaginationParams } from '../types/pagination'

/**
 * Search state interface
 */
interface SearchState {
  jobs: Job[]
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  } | null
  lastSearchParams: string | null
}

/**
 * Search parameters for caching
 */
interface SearchParameters {
  searchQuery: string
  filters: Partial<FilterState>
  pagination: PaginationParams
}

/**
 * Return type for the useJobSearch hook
 */
interface UseJobSearchReturn {
  jobs: Job[]
  pagination: SearchState['pagination']
  searchJobs: (
    searchQuery: string,
    filters: Partial<FilterState>,
    pagination: PaginationParams
  ) => Promise<SearchState>
  clearSearch: () => void
  retrySearch: () => Promise<SearchState | undefined>
}

/**
 * Custom hook for managing job search API calls
 * No UI state management - just API functionality
 */
export function useJobSearch(): UseJobSearchReturn {
  const [searchState, setSearchState] = useState<SearchState>({
    jobs: [],
    pagination: null,
    lastSearchParams: null,
  })

  /**
   * Perform job search API call
   * @param searchQuery - Search query string
   * @param filters - Active filters object
   * @param pagination - Pagination parameters
   * @returns API response promise
   */
  const searchJobs = useCallback(
    async (
      searchQuery: string,
      filters: Partial<FilterState>,
      pagination: PaginationParams
    ): Promise<SearchState> => {
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
        const newState: SearchState = {
          jobs: result.jobs || [],
          pagination: result.pagination ?? null,
          lastSearchParams: currentParams,
        }

        setSearchState(newState)
        return newState
      } catch (error) {
        // Reset state on error
        const errorState: SearchState = {
          jobs: [],
          pagination: null,
          lastSearchParams: currentParams,
        }

        setSearchState(errorState)

        // Re-throw for caller to handle if needed
        throw error
      }
    },
    [searchState] // Include searchState in dependencies
  )

  /**
   * Clear search results and reset state
   */
  const clearSearch = useCallback((): void => {
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
  const retrySearch = useCallback(async (): Promise<
    SearchState | undefined
  > => {
    if (searchState.lastSearchParams) {
      console.log('Retrying last search...')
      const params = JSON.parse(
        searchState.lastSearchParams
      ) as SearchParameters

      // Temporarily clear lastSearchParams to allow retry
      setSearchState(prev => ({ ...prev, lastSearchParams: null }))

      return await searchJobs(
        params.searchQuery,
        params.filters,
        params.pagination
      )
    } else {
      console.warn('No previous search to retry')
      return undefined
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
