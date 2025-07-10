import { Menu, Box, IconButton, Divider, Button } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

export default function FilterMenu({
  anchorEl,
  open,
  onClose,
  onApplyFilters,
  resultsCount,
  children,
}) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            minWidth: 280,
            maxWidth: 380,
            px: 2,
            py: 1,
            borderRadius: 3,
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
            border: '1px solid #e0e0e0',
          },
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        {/* Header - Close Button */}
        <Box sx={{ position: 'relative', height: 5, mb: 1 }}>
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: -8,
              top: -8,
              color: '#666',
              zIndex: 1,
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content Area - Dynamic Content */}
        <Box sx={{ maxHeight: 300, overflow: 'auto', mb: 2 }}>{children}</Box>

        {/* Footer - Action Buttons */}
        <Divider sx={{ mx: -2.5 }} />

        <Box
          sx={{
            display: 'flex',
            gap: 1.5,
            justifyContent: 'flex-end',
            mt: 2,
          }}
        >
          <Button
            onClick={onClose}
            sx={{
              color: '#313131',
              textTransform: 'none',
              borderRadius: '24px',
              px: 2,
              fontWeight: 'bold',
              fontSize: 'body1.fontSize',
              '&:hover': { bgcolor: '#f3f2ef' },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={onApplyFilters}
            sx={{
              bgcolor: '#0a66c2',
              textTransform: 'none',
              borderRadius: '24px',
              px: 2,
              fontWeight: 'bold',
              fontSize: 'body1.fontSize',
              '&:hover': { bgcolor: '#004182' },
            }}
          >
            Show {resultsCount} results
          </Button>
        </Box>
      </Box>
    </Menu>
  )
}
