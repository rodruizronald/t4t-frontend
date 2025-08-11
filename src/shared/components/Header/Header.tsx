import {
  AnchorFilters,
  DEFAULT_FILTER_STATE,
  FILTER_OPTIONS,
  FilterOptions,
  FilterType,
} from '@jobs/constants'
import SearchIcon from '@mui/icons-material/Search'
import {
  AppBar,
  Box,
  Button,
  Container,
  InputAdornment,
  Stack,
  TextField,
} from '@mui/material'
import { MouseEvent } from 'react'

import FilterChip from '@/jobs/components/filters/FilterChip'

interface HeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onSearch: () => void
  filterOptions?: FilterOptions
  anchorEls?: AnchorFilters
  onFilterClick: (filter: FilterType, event: MouseEvent<HTMLElement>) => void
  getActiveFilterCount: (filter: FilterType) => number
}

export default function Header({
  searchQuery,
  onSearchChange,
  onSearch,
  filterOptions = FILTER_OPTIONS,
  anchorEls = DEFAULT_FILTER_STATE.ANCHORS,
  onFilterClick,
  getActiveFilterCount,
}: HeaderProps) {
  return (
    <AppBar
      position='sticky'
      sx={{
        bgcolor: '#ffffff',
        color: '#000000',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
        borderBottom: '1px solid #e0e0e0',
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          px: { xs: 2, sm: 4, md: 8, lg: 18, xl: 36 },
        }}
      >
        <Box sx={{ py: 2 }}>
          {/* Search Row */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            alignItems={{ xs: 'stretch', sm: 'center' }}
            sx={{ mb: 2.5 }}
          >
            <Button
              variant='contained'
              disabled
              sx={{
                bgcolor: '#0a66c2',
                minWidth: 80,
                borderRadius: 1,
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: 'body1.fontSize',
                '&:hover': { bgcolor: '#004182' },
                '&.Mui-disabled': {
                  bgcolor: '#0a66c2',
                  color: 'white',
                },
              }}
            >
              JobHub
            </Button>

            <TextField
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && onSearch()}
              placeholder='Job title or skill'
              autoComplete='off'
              size='small'
              sx={{
                maxWidth: { xs: '100%', sm: 200 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: '20px',
                  bgcolor: '#ffffff',
                  '&:hover fieldset': { borderColor: '#0a66c2' },
                  '&.Mui-focused fieldset': { borderColor: '#0a66c2' },
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <SearchIcon sx={{ color: '#666' }} />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              variant='contained'
              onClick={onSearch}
              sx={{
                bgcolor: '#0a66c2',
                borderRadius: '24px',
                px: 3,
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: 'body1.fontSize',
                '&:hover': { bgcolor: '#004182' },
              }}
            >
              Search
            </Button>
          </Stack>

          {/* Filters Row */}
          <Stack direction='row' spacing={1} flexWrap='wrap' sx={{ gap: 1 }}>
            {(Object.keys(filterOptions) as FilterType[]).map(filter => (
              <FilterChip
                key={filter}
                filter={filter}
                isActive={anchorEls[filter] ?? null}
                activeCount={getActiveFilterCount(filter)}
                onClick={onFilterClick}
              />
            ))}
          </Stack>
        </Box>
      </Container>
    </AppBar>
  )
}
