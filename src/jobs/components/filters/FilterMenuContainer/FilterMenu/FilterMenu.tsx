import CloseIcon from '@mui/icons-material/Close'
import { Box, IconButton, Menu } from '@mui/material'
import type { ReactNode } from 'react'

interface FilterMenuProps {
  anchorEl: HTMLElement | null
  open: boolean
  onClose: () => void
  children: ReactNode
}

export default function FilterMenu({
  anchorEl,
  open,
  onClose,
  children,
}: FilterMenuProps) {
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
        <Box sx={{ maxHeight: 300, overflow: 'auto', mb: 1 }}>{children}</Box>
      </Box>
    </Menu>
  )
}
