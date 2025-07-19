import { useState } from 'react'

import type { FilterState } from '../../constants/defaultFilters'
import type { FilterOptions } from '../../constants/filterOptions'
import type { DateValue } from '../../constants/filterOptions'
import type { FilterType } from '../../constants/filterTypes'
import FilterMenuContainer from './FilterMenuContainer'

// Type for anchor elements (HTML elements, not filter values)
type AnchorElements = Record<FilterType, HTMLElement | null>

interface JobFiltersProps {
  filterOptions: FilterOptions
  activeFilters: FilterState
  onFilterChange: (filterType: FilterType, value: string | DateValue) => void
  anchorEls: AnchorElements
  onMenuClose: (filter: FilterType) => void
}

export default function JobFilters({
  filterOptions,
  activeFilters,
  onFilterChange,
  anchorEls,
  onMenuClose,
}: JobFiltersProps) {
  const [companySearchInput, setCompanySearchInput] = useState('')

  return (
    <>
      {(Object.keys(filterOptions) as FilterType[]).map(filter => (
        <FilterMenuContainer
          key={filter}
          filter={filter}
          anchorEl={anchorEls[filter]}
          open={Boolean(anchorEls[filter])}
          onClose={() => onMenuClose(filter)}
          filterOptions={filterOptions}
          activeFilters={activeFilters}
          onFilterChange={onFilterChange}
          companySearchInput={companySearchInput}
          onCompanySearchChange={setCompanySearchInput}
        />
      ))}
    </>
  )
}
