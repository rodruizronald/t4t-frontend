import { useState } from 'react'
import FilterMenuContainer from './FilterMenuContainer'

export default function JobFilters({
  filterOptions,
  activeFilters,
  onFilterChange,
  anchorEls,
  onMenuClose,
  onApplyFilters,
  resultsCount,
}) {
  const [companySearchInput, setCompanySearchInput] = useState('')

  return (
    <>
      {Object.keys(filterOptions).map((filter) => (
        <FilterMenuContainer
          key={filter}
          filter={filter}
          anchorEl={anchorEls[filter]}
          open={Boolean(anchorEls[filter])}
          onClose={() => onMenuClose(filter)}
          filterOptions={filterOptions}
          activeFilters={activeFilters}
          onFilterChange={onFilterChange}
          onApplyFilters={onApplyFilters}
          resultsCount={resultsCount}
          companySearchInput={companySearchInput}
          onCompanySearchChange={setCompanySearchInput}
        />
      ))}
    </>
  )
}