import { useMemo } from 'react'
import { FILTER_OPTIONS } from '../../constants/job'

export function useFilterOptions() {
  const filterOptions = useMemo(() => {
    // Future: Could fetch dynamic options from API
    // or filter based on available jobs
    return FILTER_OPTIONS
  }, [])

  return filterOptions
}
