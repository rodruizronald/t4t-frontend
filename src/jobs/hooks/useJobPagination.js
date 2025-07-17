import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PAGINATION } from '../constants'

export function useJobPagination(
  apiJobs,
  apiPagination,
  searchJobs,
  searchQuery,
  activeFilters
) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedJobId, setSelectedJobId] = useState(null)

  // Get current page from URL, default to 1
  const currentPage = parseInt(searchParams.get('p')) || PAGINATION.DEFAULT_PAGE

  // Calculate pagination values from API metadata
  const totalJobs = apiPagination?.total || 0
  const totalPages = apiPagination
    ? Math.ceil(apiPagination.total / apiPagination.limit)
    : PAGINATION.DEFAULT_PAGE

  // For server-side pagination, currentPageJobs = all apiJobs
  const currentPageJobs = apiJobs

  // Handle page change - make new API call
  const handlePageChange = async newPage => {
    const newSearchParams = new URLSearchParams(searchParams)

    if (newPage === PAGINATION.DEFAULT_PAGE) {
      newSearchParams.delete('p')
    } else {
      newSearchParams.set('p', newPage.toString())
    }

    setSearchParams(newSearchParams)

    // Make API call for new page
    try {
      await searchJobs(searchQuery, activeFilters, {
        page: newPage,
        pageSize: PAGINATION.PAGE_SIZE,
      })
    } catch (error) {
      console.error('Failed to fetch page:', error)
    }
  }

  // Auto-select first job when jobs change and no job is selected
  useEffect(() => {
    if (apiJobs.length > 0) {
      setSelectedJobId(apiJobs[0].id)
    }
  }, [apiJobs])

  // Only recalculates when dependencies change
  const selectedJob = useMemo(() => {
    return apiJobs.find(job => job.id === selectedJobId)
  }, [apiJobs, selectedJobId])

  return {
    // Same interface as useJobPagination
    currentPage,
    totalPages,
    totalJobs,
    currentPageJobs,
    selectedJob,
    selectedJobId,
    setSelectedJobId,
    handlePageChange,
    setSearchParams,
  }
}
