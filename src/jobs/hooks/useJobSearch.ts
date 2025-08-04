import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'

import { useLogger } from '@/services/logging'

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
}

/**
 * Search parameters for query key
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
  isLoading: boolean
  isError: boolean
  error: Error | null
  searchJobs: (
    searchQuery: string,
    filters: Partial<FilterState>,
    pagination: PaginationParams
  ) => Promise<SearchState>
  clearSearch: () => void
  retrySearch: () => void
}

/**
 * Custom hook for managing job search API calls using React Query
 */
export function useJobSearch(): UseJobSearchReturn {
  const logger = useLogger('useJobSearch')
  const queryClient = useQueryClient()

  // Track current search parameters for query key
  const [searchParams, setSearchParams] = useState<SearchParameters | null>(
    null
  )

  // Create query key from search parameters
  const queryKey = searchParams
    ? ([
        'jobs',
        'search',
        searchParams.searchQuery,
        searchParams.filters,
        searchParams.pagination,
      ] as const)
    : (['jobs', 'search', 'empty'] as const)

  // Use React Query for the actual API call
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey,
    queryFn: async (): Promise<SearchState> => {
      if (!searchParams) {
        // Return empty state for the 'empty' query key
        return {
          jobs: [],
          pagination: null,
        }
      }

      const { searchQuery, filters, pagination } = searchParams

      logger.info('Starting job search API call', {
        searchQuery,
        filters,
        pagination,
      })

      const result = await jobService.searchJobs(
        searchQuery,
        filters,
        pagination
      )

      logger.info('Job search API successful', {
        jobCount: result.jobs?.length || 0,
        pagination: result.pagination,
      })

      return {
        jobs: result.jobs || [],
        pagination: result.pagination ?? null,
      }
    },
    enabled: !!searchParams && !!searchParams.searchQuery?.trim(), // Only run if we have valid search params
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    placeholderData: previousData => previousData,
  })

  /**
   * Perform job search by updating search parameters (triggers React Query)
   */
  const searchJobs = useCallback(
    async (
      searchQuery: string,
      filters: Partial<FilterState>,
      pagination: PaginationParams
    ): Promise<SearchState> => {
      // Don't search if query is empty or just whitespace
      if (!searchQuery || searchQuery.trim() === '') {
        logger.debug('Skipping search - empty query')
        setSearchParams(null)
        const emptyState: SearchState = {
          jobs: [],
          pagination: null,
        }
        return emptyState
      }

      const newParams: SearchParameters = {
        searchQuery: searchQuery.trim(),
        filters,
        pagination,
      }

      // Check if parameters are the same to prevent unnecessary requests
      const currentParamsString = JSON.stringify(searchParams)
      const newParamsString = JSON.stringify(newParams)

      if (currentParamsString === newParamsString) {
        logger.debug('Skipping duplicate search request')
        return data ?? { jobs: [], pagination: null }
      }

      logger.debug('Updating search parameters', {
        searchQuery: newParams.searchQuery,
        filters: newParams.filters,
        pagination: newParams.pagination,
      })
      setSearchParams(newParams)

      // Wait for the query to complete and return the result
      const result = await queryClient.fetchQuery({
        queryKey: [
          'jobs',
          'search',
          newParams.searchQuery,
          newParams.filters,
          newParams.pagination,
        ],
        queryFn: async (): Promise<SearchState> => {
          logger.info('Starting job search API call', {
            searchQuery: newParams.searchQuery,
            filters: newParams.filters,
            pagination: newParams.pagination,
          })
          const apiResult = await jobService.searchJobs(
            newParams.searchQuery,
            newParams.filters,
            newParams.pagination
          )
          logger.info('Job search API successful', {
            jobCount: apiResult.jobs?.length || 0,
            pagination: apiResult.pagination,
          })
          return {
            jobs: apiResult.jobs || [],
            pagination: apiResult.pagination ?? null,
          }
        },
        staleTime: 5 * 60 * 1000,
      })

      return result
    },
    [searchParams, data, queryClient, logger]
  )

  /**
   * Clear search results and reset state
   */
  const clearSearch = useCallback((): void => {
    logger.debug('Clearing search results')
    setSearchParams(null)
    // Optionally clear related queries from cache
    queryClient.removeQueries({ queryKey: ['jobs', 'search'] })
  }, [queryClient, logger])

  /**
   * Retry the last search
   */
  const retrySearch = useCallback((): void => {
    if (searchParams) {
      logger.info('Retrying last search')
      refetch()
    } else {
      logger.warn('No previous search to retry')
    }
  }, [searchParams, refetch, logger])

  return {
    // State from React Query
    jobs: data?.jobs ?? [],
    pagination: data?.pagination ?? null,
    isLoading,
    isError,
    error: error as Error | null,

    // Actions
    searchJobs,
    clearSearch,
    retrySearch,
  }
}
