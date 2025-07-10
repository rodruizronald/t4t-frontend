import { TextField, FormControlLabel, Checkbox, Box } from '@mui/material'

export default function SearchFilterContent({
  options,
  selectedValues,
  onChange,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
}) {
  const handleCheckboxChange = (value) => {
    onChange(value)
  }

  return (
    <Box>
      <Box sx={{ pr: 4 }}>
        <TextField
          fullWidth
          size="small"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{
            mb: 1,
            px: 1.5,
            '& .MuiOutlinedInput-root': {
              borderRadius: '20px',
              bgcolor: '#ffffff',
              '&:hover fieldset': { borderColor: '#0a66c2' },
              '&.Mui-focused fieldset': { borderColor: '#0a66c2' },
            },
          }}
        />
      </Box>

      {options.map((option) => (
        <FormControlLabel
          key={option}
          control={
            <Checkbox
              checked={selectedValues.includes(
                option.toLowerCase().replace(/\s+/g, '-')
              )}
              onChange={() =>
                handleCheckboxChange(option.toLowerCase().replace(/\s+/g, '-'))
              }
              sx={{ color: '#0a66c2' }}
            />
          }
          label={option}
          sx={{
            display: 'flex',
            px: 1.5,
          }}
        />
      ))}
    </Box>
  )
}
