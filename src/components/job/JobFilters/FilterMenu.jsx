import {
  Menu,
  Box,
  IconButton,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Divider,
  Button,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

export default function FilterMenu({
  filter,
  anchorEl,
  open,
  onClose,
  filterOptions,
  activeFilters,
  onFilterChange,
  onApplyFilters,
  resultsCount,
  companySearchInput,
  onCompanySearchChange,
}) {
  const handleDateChange = (event) => {
    onFilterChange('date', event.target.value)
  }

  const handleCheckboxChange = (filterType, value) => {
    onFilterChange(filterType, value)
  }

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            minWidth: 350,
            maxWidth: 400,
            p: 2.5,
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
          },
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: -8,
            top: -8,
            color: '#666',
          }}
        >
          <CloseIcon />
        </IconButton>

        {filter === 'company' && (
          <TextField
            fullWidth
            placeholder="Add a company"
            value={companySearchInput}
            onChange={(e) => onCompanySearchChange(e.target.value)}
            sx={{ mb: 2 }}
          />
        )}

        <Box sx={{ maxHeight: 300, overflow: 'auto', mb: 2 }}>
          {filter === 'date' ? (
            <RadioGroup value={activeFilters.date} onChange={handleDateChange}>
              {filterOptions.date?.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio sx={{ color: '#057642' }} />}
                  label={option.label}
                  sx={{ py: 1 }}
                />
              ))}
            </RadioGroup>
          ) : (
            filterOptions[filter]?.map((option) => (
              <FormControlLabel
                key={option}
                control={
                  <Checkbox
                    checked={activeFilters[filter]?.includes(
                      option.toLowerCase().replace(/\s+/g, '-')
                    )}
                    onChange={() =>
                      handleCheckboxChange(
                        filter,
                        option.toLowerCase().replace(/\s+/g, '-')
                      )
                    }
                    sx={{ color: '#0a66c2' }}
                  />
                }
                label={option}
                sx={{ display: 'flex', py: 1 }}
              />
            ))
          )}
        </Box>

        <Divider sx={{ mx: -2.5 }} />

        <Box
          sx={{
            display: 'flex',
            gap: 1.5,
            justifyContent: 'flex-end',
            mt: 2.5,
          }}
        >
          <Button
            onClick={onClose}
            sx={{
              color: '#313131',
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '24px',
              px: 3,
              '&:hover': { bgcolor: '#f3f2ef' },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => onApplyFilters(filter)}
            sx={{
              bgcolor: '#0a66c2',
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '24px',
              px: 3,
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