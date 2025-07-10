import { useState } from 'react'
import { 
  FILTER_TYPES, 
  DATE_VALUES, 
  DEFAULT_EMPTY_FILTERS, 
  DEFAULT_REFERENCE_FILTERS 
} from '../../constants/job'

export function useJobFilters() {
  const [anchorEls, setAnchorEls] = useState(DEFAULT_REFERENCE_FILTERS)
  const [activeFilters, setActiveFilters] = useState(DEFAULT_EMPTY_FILTERS)

  const handleFilterClick = (filter, event) => {
    const chipElement =
      event.currentTarget.closest('.MuiChip-root') || event.currentTarget
    setAnchorEls((prev) => ({ ...prev, [filter]: chipElement }))
  }

  const handleMenuClose = (filter) => {
    setAnchorEls((prev) => ({ ...prev, [filter]: null }))
  }

  const handleFilterChange = (filterType, value) => {
    if (filterType === FILTER_TYPES.DATE) {
      setActiveFilters((prev) => ({ ...prev, date: value }))
    } else {
      setActiveFilters((prev) => ({
        ...prev,
        [filterType]: prev[filterType].includes(value)
          ? prev[filterType].filter((item) => item !== value)
          : [...prev[filterType], value],
      }))
    }
  }

  const handleApplyFilters = (filter) => {
    handleMenuClose(filter)
    console.log('Applied filters:', activeFilters)
  }

  const getActiveFilterCount = (filter) => {
    if (filter === FILTER_TYPES.DATE) return activeFilters.date !== DATE_VALUES.ANY ? 1 : 0
    return activeFilters[filter].length
  }

  return {
    // Filter state
    anchorEls,
    activeFilters,
    
    // Filter actions
    handleFilterClick,
    handleMenuClose,
    handleFilterChange,
    handleApplyFilters,
    getActiveFilterCount,
  }
}