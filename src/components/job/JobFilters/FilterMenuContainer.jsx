import FilterMenu, {
  DateFilterContent,
  CheckboxFilterContent,
  SearchFilterContent,
} from '../../common/FilterMenu'

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
}) {
  const renderFilterContent = () => {
    switch (filter) {
      case 'date':
        return (
          <DateFilterContent
            options={filterOptions.date}
            value={activeFilters.date}
            onChange={event => onFilterChange('date', event.target.value)}
          />
        )

      case 'company':
        return (
          <SearchFilterContent
            options={filterOptions.company}
            selectedValues={activeFilters.company}
            onChange={value => onFilterChange('company', value)}
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
            options={filterOptions[filter]}
            selectedValues={activeFilters[filter]}
            onChange={value => onFilterChange(filter, value)}
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
