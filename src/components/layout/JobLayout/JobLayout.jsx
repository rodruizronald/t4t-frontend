import Header from '../../common/Header'
import { Box } from '@mui/material'
import { useState } from 'react'
import JobFilters from '../../job/JobFilters'
import JobList from '../../job/JobList'
import JobDetails from '../../job/JobDetails'
import { useFilterOptions } from '../../../hooks/job'
import { useServerPagination } from '../../../hooks/job/useServerPagination'
import { useJobFilters } from '../../../hooks/job/useJobFilters'
import { useJobSearch } from '../../../hooks/job/useJobSearch'
import { PAGINATION } from '../../../constants/job'

// Extract the URL reset logic to a separate function
const resetToPageOne = setSearchParams => {
  const newSearchParams = new URLSearchParams(window.location.search)
  newSearchParams.delete('p')

  window.history.replaceState(
    {},
    '',
    newSearchParams.toString()
      ? `${window.location.pathname}?${newSearchParams}`
      : window.location.pathname
  )

  setSearchParams(newSearchParams)
}

export default function JobLayout() {
  const filterOptions = useFilterOptions()
  const [searchQuery, setSearchQuery] = useState('')

  // Use API job search hook
  const {
    jobs: apiJobs,
    pagination: apiPagination,
    searchJobs,
  } = useJobSearch()

  // Use job filters hook
  const {
    anchorEls,
    activeFilters,
    handleFilterClick,
    handleMenuClose,
    handleFilterChange,
    getActiveFilterCount,
  } = useJobFilters()

  // Use server-side pagination hook
  const {
    currentPage,
    totalPages,
    totalJobs,
    currentPageJobs,
    selectedJob,
    selectedJobId,
    setSelectedJobId,
    handlePageChange,
    setSearchParams,
  } = useServerPagination(
    apiJobs,
    apiPagination,
    searchJobs,
    searchQuery,
    activeFilters
  )

  const handleSearch = async () => {
    // Reset to page 1 and clear selected job
    resetToPageOne(setSearchParams)

    try {
      await searchJobs(searchQuery, activeFilters, {
        page: PAGINATION.DEFAULT_PAGE, // Always start from page 1 for new searches
        pageSize: PAGINATION.PAGE_SIZE,
      })

      // Only clear selection after successful API call
      setSelectedJobId(null)

      console.log('Search completed successfully')
    } catch (error) {
      console.log('Search failed:', error)
    }
  }

  const handleJobSelect = job => {
    setSelectedJobId(job.id)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
        filterOptions={filterOptions}
        anchorEls={anchorEls}
        onFilterClick={handleFilterClick}
        getActiveFilterCount={getActiveFilterCount}
      />
      <JobFilters
        filterOptions={filterOptions}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        anchorEls={anchorEls}
        onMenuClose={handleMenuClose}
      />

      {/* Main Content Container - Fixed Height */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          minHeight: 0, // Important for flex children to be scrollable
          bgcolor: '#f5f5f5',
          px: { xs: 2, sm: 4, md: 8, lg: 18, xl: 36 }, // Responsive horizontal padding
          py: 2, // Small vertical padding for breathing room
        }}
      >
        {/* Job List Container - Independent Scrolling */}
        <Box
          sx={{
            width: '45%',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0, // Important for scrolling
          }}
        >
          <JobList
            jobs={currentPageJobs}
            selectedJobId={selectedJobId}
            onJobSelect={handleJobSelect}
            resultsCount={totalJobs}
            searchQuery={searchQuery}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </Box>

        {/* Job Details Container - Independent Scrolling */}
        <Box
          sx={{
            width: '55%',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0, // Important for scrolling
          }}
        >
          <JobDetails job={selectedJob} />
        </Box>
      </Box>
    </Box>
  )
}
