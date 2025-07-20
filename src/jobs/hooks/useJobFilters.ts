import { MouseEvent, useState } from 'react'

import {
  AnchorFilters,
  DATE_VALUES,
  DateValue,
  DEFAULT_FILTER_STATE,
  FILTER_TYPES,
  FilterState,
  FilterType,
} from '../constants'

// Return type for the useJobFilters hook
interface UseJobFiltersReturn {
  anchorEls: AnchorFilters
  activeFilters: FilterState
  handleFilterClick: (
    filter: FilterType,
    event: MouseEvent<HTMLElement>
  ) => void
  handleMenuClose: (filter: FilterType) => void
  handleFilterChange: (
    filterType: FilterType,
    value: string | DateValue
  ) => void
  getActiveFilterCount: (filter: FilterType) => number
}

export function useJobFilters(): UseJobFiltersReturn {
  const [anchorEls, setAnchorEls] = useState<AnchorFilters>(
    DEFAULT_FILTER_STATE.ANCHORS
  )
  const [activeFilters, setActiveFilters] = useState<FilterState>(
    DEFAULT_FILTER_STATE.FILTERS
  )

  const handleFilterClick = (
    filter: FilterType,
    event: MouseEvent<HTMLElement>
  ): void => {
    const chipElement =
      (event.currentTarget.closest('.MuiChip-root') as HTMLElement) ||
      event.currentTarget
    setAnchorEls(prev => ({ ...prev, [filter]: chipElement }))
  }

  const handleMenuClose = (filter: FilterType): void => {
    setAnchorEls(prev => ({ ...prev, [filter]: null }))
  }

  const handleFilterChange = (
    filterType: FilterType,
    value: string | DateValue
  ): void => {
    if (filterType === FILTER_TYPES.DATE) {
      setActiveFilters(prev => ({ ...prev, date: value as DateValue }))
    } else {
      setActiveFilters(prev => {
        const currentValues = prev[filterType] ?? []
        return {
          ...prev,
          [filterType]: currentValues.includes(value as string)
            ? currentValues.filter(item => item !== value)
            : [...currentValues, value as string],
        }
      })
    }
  }

  const getActiveFilterCount = (filter: FilterType): number => {
    if (filter === FILTER_TYPES.DATE) {
      return activeFilters.date !== DATE_VALUES.ANY ? 1 : 0
    }

    // Handle null values with optional chaining and nullish coalescing
    return activeFilters[filter]?.length ?? 0
  }

  return {
    // Filter state
    anchorEls,
    activeFilters,

    // Filter actions
    handleFilterClick,
    handleMenuClose,
    handleFilterChange,
    getActiveFilterCount,
  }
}
