import { Box, CircularProgress, Typography } from '@mui/material'

import Pagination from '@/shared/components/Pagination'

import type { Job } from '../../types/models'
import JobListItem from './JobListItem'

interface JobListProps {
  jobs?: Job[]
  selectedJobId?: string
  onJobSelect: (job: Job) => void
  isLoading?: boolean
  isFetching?: boolean
  resultsCount?: number
  searchQuery?: string
  // Pagination props
  currentPage?: number
  totalPages?: number
  onPageChange: (page: number) => void
}

export default function JobList({
  jobs = [],
  selectedJobId,
  onJobSelect,
  isLoading = false,
  isFetching = false,
  resultsCount = 0,
  searchQuery = '',
  // Pagination props
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}: JobListProps) {
  return (
    <Box
      sx={{
        flex: 1,
        bgcolor: 'white',
        border: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: 2,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        // Fade effect during API calls
        opacity: isFetching ? 0.6 : 1,
        transition: 'opacity 250ms ease-in-out',
        // Disable interactions during API calls
        pointerEvents: isFetching ? 'none' : 'auto',
        cursor: isFetching ? 'not-allowed' : 'default',
      }}
    >
      {/* Sticky Header */}
      <Box
        sx={{
          px: 2.5,
          py: 3.5,
          bgcolor: '#0a66c2',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          flexShrink: 0, // Prevent header from shrinking
        }}
      >
        <Typography
          variant='body1'
          sx={{ fontWeight: 'bold', fontSize: 'body1.fontSize' }}
        >
          {searchQuery || 'All Jobs'}
        </Typography>
        <Typography variant='body1' sx={{ fontSize: 'body1.fontSize' }}>
          {resultsCount} results
        </Typography>
      </Box>

      {/* Scrollable Job List Content */}
      <Box
        sx={{
          flex: 1,
          overflow: isFetching ? 'hidden' : 'auto', // Disable scrolling during API calls
          minHeight: 0, // Important for flex scrolling
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Job Items Container */}
        <Box sx={{ flex: 1 }}>
          {isLoading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '200px',
              }}
            >
              <CircularProgress />
            </Box>
          ) : jobs.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '200px',
                textAlign: 'center',
                p: 3,
              }}
            >
              <Typography variant='h6' color='text.secondary' sx={{ mb: 1 }}>
                No jobs found
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Try adjusting your search criteria or filters
              </Typography>
            </Box>
          ) : (
            jobs.map((job, index) => (
              <JobListItem
                key={job.id || index}
                job={job}
                isSelected={selectedJobId === job.id}
                onClick={() => onJobSelect(job)}
                isLast={index === jobs.length - 1}
              />
            ))
          )}
        </Box>

        {/* Pagination - Only show when there are jobs and not loading */}
        {!isLoading && jobs.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        )}
      </Box>
    </Box>
  )
}
