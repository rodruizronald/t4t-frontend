import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PAGINATION } from '../../constants/job'

export function useJobPagination(allJobs, searchQuery, activeFilters) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedJobId, setSelectedJobId] = useState(null)

  // Get current page from URL, default to 1
  const currentPage = parseInt(searchParams.get('p')) || PAGINATION.DEFAULT_PAGE

  // Calculate pagination values
  const totalJobs = allJobs.length
  const totalPages = Math.ceil(totalJobs / PAGINATION.PAGE_SIZE)
  const startIndex = (currentPage - 1) * PAGINATION.PAGE_SIZE
  const endIndex = startIndex + PAGINATION.PAGE_SIZE

  // Get jobs for current page
  const currentPageJobs = useMemo(() => {
    return allJobs.slice(startIndex, endIndex)
  }, [allJobs, startIndex, endIndex])

  // Handle page change
  const handlePageChange = newPage => {
    const newSearchParams = new URLSearchParams(searchParams)

    if (newPage === PAGINATION.DEFAULT_PAGE) {
      // Remove 'p' parameter for first page to keep URL clean
      newSearchParams.delete('p')
    } else {
      newSearchParams.set('p', newPage.toString())
    }

    setSearchParams(newSearchParams)

    // Auto-select first job of the new page
    const newStartIndex = (newPage - 1) * PAGINATION.PAGE_SIZE
    const newEndIndex = newStartIndex + PAGINATION.PAGE_SIZE
    const newPageJobs = allJobs.slice(newStartIndex, newEndIndex)

    if (newPageJobs.length > 0) {
      setSelectedJobId(newPageJobs[0].id)
    } else {
      setSelectedJobId(null)
    }

    // Scroll to top of job list
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Reset to page 1 when search query or filters change
  useEffect(() => {
    if (currentPage > PAGINATION.DEFAULT_PAGE) {
      const newSearchParams = new URLSearchParams(searchParams)
      newSearchParams.delete('p')
      setSearchParams(newSearchParams)
    }
    setSelectedJobId(null)
  }, [searchQuery, activeFilters]) // eslint-disable-line react-hooks/exhaustive-deps

  // Validate current page (redirect to last page if current page is too high)
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      const newSearchParams = new URLSearchParams(searchParams)
      if (totalPages === PAGINATION.DEFAULT_PAGE) {
        newSearchParams.delete('p')
      } else {
        newSearchParams.set('p', totalPages.toString())
      }
      setSearchParams(newSearchParams)
    }
  }, [currentPage, totalPages, searchParams, setSearchParams])

  // Auto-select first job on initial load or when currentPageJobs changes and no job is selected
  useEffect(() => {
    if (currentPageJobs.length > 0 && !selectedJobId) {
      setSelectedJobId(currentPageJobs[0].id)
    }
  }, [currentPageJobs, selectedJobId])

  return {
    // Pagination state
    currentPage,
    totalPages,
    totalJobs,
    currentPageJobs,

    // Job selection state
    selectedJobId,
    setSelectedJobId,

    // Actions
    handlePageChange,
  }
}
