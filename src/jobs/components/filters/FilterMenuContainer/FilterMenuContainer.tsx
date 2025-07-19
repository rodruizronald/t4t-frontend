import React from 'react'

import type { FilterState } from '../../../constants/defaultFilters'
import type { FilterOptions } from '../../../constants/filterOptions'
import type { DateValue } from '../../../constants/filterOptions'
import { DATE_VALUES } from '../../../constants/filterOptions'
import type { FilterType } from '../../../constants/filterTypes'
import {
  CheckboxFilterContent,
  DateFilterContent,
  SearchFilterContent,
} from './FilterContent'
import FilterMenu from './FilterMenu'

interface FilterMenuContainerProps {
  filter: FilterType
  anchorEl: HTMLElement | null
  open: boolean
  onClose: () => void
  filterOptions: FilterOptions
  activeFilters: FilterState
  onFilterChange: (filterType: FilterType, value: string | DateValue) => void
  companySearchInput: string
  onCompanySearchChange: (value: string) => void
}

export default function FilterMenuContainer({
  filter,
  anchorEl,
  open,
  onClose,
  filterOptions,
  activeFilters,
  onFilterChange,
  companySearchInput,
  onCompanySearchChange,
}: FilterMenuContainerProps) {
  const renderFilterContent = () => {
    switch (filter) {
      case 'date':
        return (
          <DateFilterContent
            options={
              filterOptions.date as ReadonlyArray<{
                value: DateValue
                label: string
              }>
            }
            value={activeFilters.date ?? DATE_VALUES.ANY}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              onFilterChange('date', event.target.value as DateValue)
            }
          />
        )

      case 'company':
        return (
          <SearchFilterContent
            options={filterOptions.company as readonly string[]}
            selectedValues={activeFilters.company ?? []}
            onChange={(value: string) => onFilterChange('company', value)}
            searchValue={companySearchInput}
            onSearchChange={onCompanySearchChange}
            searchPlaceholder='Add a company'
          />
        )

      case 'experience':
      case 'mode':
      case 'type':
        return (
          <CheckboxFilterContent
            options={filterOptions[filter] as readonly string[]}
            selectedValues={activeFilters[filter] ?? []}
            onChange={(value: string) => onFilterChange(filter, value)}
          />
        )

      default:
        return null
    }
  }

  return (
    <FilterMenu anchorEl={anchorEl} open={open} onClose={onClose}>
      {renderFilterContent()}
    </FilterMenu>
  )
}
