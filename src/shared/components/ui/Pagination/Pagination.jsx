import { Box, Button, IconButton } from '@mui/material'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  // Don't render if there's only one page or no pages
  if (totalPages <= 1) return null

  const generatePageNumbers = () => {
    const pages = []

    // Always show first page
    pages.push(1)

    // Calculate range around current page
    const startPage = Math.max(2, currentPage - 1)
    const endPage = Math.min(totalPages - 1, currentPage + 1)

    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pages.push('...')
    }

    // Add pages around current page
    for (let i = startPage; i <= endPage; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i)
      }
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pages.push('...')
    }

    // Always show last page (if different from first)
    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = generatePageNumbers()

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 1,
        py: 3,
        px: 2,
        borderTop: '1px solid #e0e0e0',
        bgcolor: 'white',
      }}
    >
      {/* Previous Button */}
      {currentPage > 1 && (
        <IconButton
          onClick={() => onPageChange(currentPage - 1)}
          sx={{
            color: '#0a66c2',
            border: '1px solid #e0e0e0',
            width: '36px',
            height: '36px',
            mr: 1,
            '&:hover': {
              bgcolor: '#f5f5f5',
            },
          }}
        >
          <ChevronLeft />
        </IconButton>
      )}

      {/* Page Numbers */}
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {pageNumbers.map((page, index) =>
          page === '...' ? (
            <Box
              key={`ellipsis-${index}`}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                color: '#666',
                fontSize: '0.875rem',
              }}
            >
              ...
            </Box>
          ) : (
            <Button
              key={page}
              variant={currentPage === page ? 'contained' : 'outlined'}
              onClick={() => onPageChange(page)}
              sx={{
                minWidth: '36px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                fontSize: '0.875rem',
                fontWeight: currentPage === page ? 'bold' : 'normal',
                p: 0,
                ...(currentPage === page
                  ? {
                      bgcolor: '#0a66c2',
                      color: 'white',
                      '&:hover': {
                        bgcolor: '#004182',
                      },
                    }
                  : {
                      color: '#0a66c2',
                      borderColor: '#e0e0e0',
                      '&:hover': {
                        bgcolor: '#f5f5f5',
                      },
                    }),
              }}
            >
              {page}
            </Button>
          )
        )}
      </Box>

      {/* Next Button */}
      {currentPage < totalPages && (
        <IconButton
          onClick={() => onPageChange(currentPage + 1)}
          sx={{
            color: '#0a66c2',
            border: '1px solid #e0e0e0',
            width: '36px',
            height: '36px',
            ml: 1,
            '&:hover': {
              bgcolor: '#f5f5f5',
            },
          }}
        >
          <ChevronRight />
        </IconButton>
      )}
    </Box>
  )
}
