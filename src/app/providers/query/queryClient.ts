import { QueryClient } from '@tanstack/react-query'

// Configure React Query with sensible defaults
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: How long until a query is considered stale
      staleTime: 5 * 60 * 1000, // 5 minutes

      // Cache time: How long to keep unused data in cache
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)

      // Retry configuration
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors (client errors)
        const hasStatus =
          error && typeof error === 'object' && 'status' in error
        if (
          hasStatus &&
          typeof (error as { status: unknown }).status === 'number'
        ) {
          const status = (error as { status: number }).status
          if (status >= 400 && status < 500) {
            return false
          }
        }

        // Retry up to 3 times for other errors
        return failureCount < 3
      },

      // Retry delay with exponential backoff
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Refetch on window focus (good for search results)
      refetchOnWindowFocus: false, // Set to true if you want fresh data on tab focus
    },
    mutations: {
      // Mutation defaults
      retry: false, // Usually don't retry mutations
    },
  },
})
