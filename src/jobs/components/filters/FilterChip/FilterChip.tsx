import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Badge, Chip } from '@mui/material'
import React from 'react'

import { FilterType } from '../../../constants/filterTypes'

interface FilterChipProps {
  filter: FilterType
  isActive: HTMLElement | null
  activeCount: number
  onClick: (filter: FilterType, event: React.MouseEvent<HTMLElement>) => void
}

export default function FilterChip({
  filter,
  isActive,
  activeCount,
  onClick,
}: FilterChipProps) {
  return (
    <Badge
      badgeContent={activeCount}
      color='primary'
      invisible={activeCount === 0}
    >
      <Chip
        label={filter.charAt(0).toUpperCase() + filter.slice(1)}
        onDelete={e => onClick(filter, e)}
        deleteIcon={<ExpandMoreIcon />}
        sx={{
          bgcolor: isActive ? '#0a66c2' : '#ffffff',
          color: isActive ? '#ffffff' : '#313131',
          border: isActive ? 'none' : '1px solid #A3A3A3',
          fontWeight: 'bold',
          fontSize: 'body1.fontSize',
          '&:hover': {
            bgcolor: isActive ? '#004182' : '#E8F2FF',
            borderColor: '#0a66c2',
            borderWidth: '2px',
          },
          '& .MuiChip-deleteIcon': {
            color: 'inherit',
          },
        }}
      />
    </Badge>
  )
}
