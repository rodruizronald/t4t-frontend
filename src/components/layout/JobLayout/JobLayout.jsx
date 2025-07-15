import Header from '../../common/Header'
import { Box } from '@mui/material'
import { useState } from 'react'
import JobFilters from '../../job/JobFilters'
import JobList from '../../job/JobList'
import JobDetails from '../../job/JobDetails'
import { mockJobs } from '../../../mocks/mockJobs'
import { useFilterOptions } from '../../../hooks/job'
import { useJobPagination } from '../../../hooks/job/useJobPagination'
import { useJobFilters } from '../../../hooks/job/useJobFilters'
import {
  getApiBaseUrl,
  getEnvironmentMode,
  isDevelopment,
} from '../../../services/api/config'
import { jobService } from '../../../services/api/jobService'
import {
  EXPERIENCE_OPTIONS,
  MODE_OPTIONS,
  TYPE_OPTIONS,
} from '../../../constants/job/filterOptions'

export default function JobLayout() {
  const filterOptions = useFilterOptions()
  const [searchQuery, setSearchQuery] = useState('support engineer')

  // Replace the inline mock data with imported data
  const [allJobs] = useState(mockJobs)

  // Use job filters hook
  const {
    anchorEls,
    activeFilters,
    handleFilterClick,
    handleMenuClose,
    handleFilterChange,
    getActiveFilterCount,
  } = useJobFilters()

  // Use pagination hook
  const {
    currentPage,
    totalPages,
    totalJobs,
    currentPageJobs,
    selectedJobId,
    setSelectedJobId,
    handlePageChange,
  } = useJobPagination(allJobs, searchQuery, activeFilters)

  const handleSearch = () => {
    console.log('Searching for:', searchQuery)
  }

  const handleJobSelect = job => {
    setSelectedJobId(job.id)
    console.log('Selected job:', job)
  }

  const selectedJob =
    currentPageJobs.find(job => job.id === selectedJobId) ||
    allJobs.find(job => job.id === selectedJobId)

  // TEMPORARY: Test environment configuration
  console.log('=== Step 1 Validation ===')
  console.log('API Base URL:', getApiBaseUrl())
  console.log('Environment Mode:', getEnvironmentMode())
  console.log('Is Development:', isDevelopment())
  console.log('JobService Base URL:', jobService.baseUrl)

  // TEMPORARY: Test filter constants
  console.log('=== Step 2 Validation ===')
  console.log('Experience Options:', EXPERIENCE_OPTIONS)
  console.log('Mode Options:', MODE_OPTIONS)
  console.log('Type Options:', TYPE_OPTIONS)

  // Test the transformation that CheckboxFilterContent does
  console.log(
    'Experience API values:',
    EXPERIENCE_OPTIONS.map(option => option.toLowerCase().replace(/\s+/g, '-'))
  )
  console.log(
    'Mode API values:',
    MODE_OPTIONS.map(option => option.toLowerCase().replace(/\s+/g, '-'))
  )
  console.log(
    'Type API values:',
    TYPE_OPTIONS.map(option => option.toLowerCase().replace(/\s+/g, '-'))
  )

  // Test the service method
  jobService.searchJobs('test query', {}, { page: 1 })

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
