import {
  AppBar,
  Box,
  Button,
  TextField,
  Container,
  Stack,
  InputAdornment,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import FilterChip from '../FilterChip'

export default function Header({
  searchQuery,
  onSearchChange,
  onSearch,
  filterOptions = {},
  anchorEls = {},
  onFilterClick,
  getActiveFilterCount,
}) {
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
        maxWidth={true}
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
              sx={{
                bgcolor: '#0a66c2',
                minWidth: 80,
                borderRadius: 1,
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: 'body1.fontSize',
                '&:hover': { bgcolor: '#004182' },
              }}
            >
              JobHub
            </Button>

            <TextField
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && onSearch()}
              placeholder='Job title or skill'
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
            {Object.keys(filterOptions).map(filter => (
              <FilterChip
                key={filter}
                filter={filter}
                isActive={anchorEls[filter]}
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
