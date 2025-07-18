export const PAGINATION = {
  PAGE_SIZE: 20,
  DEFAULT_PAGE: 1,
} as const

// Export individual constants with explicit types
export const PAGE_SIZE: number = PAGINATION.PAGE_SIZE
export const DEFAULT_PAGE: number = PAGINATION.DEFAULT_PAGE

// Type for pagination configuration
export type PaginationConfig = typeof PAGINATION