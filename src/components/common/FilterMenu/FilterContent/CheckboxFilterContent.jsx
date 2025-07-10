import { FormControlLabel, Checkbox } from '@mui/material'

export default function CheckboxFilterContent({
  options,
  selectedValues,
  onChange,
}) {
  const handleCheckboxChange = (value) => {
    onChange(value)
  }

  return (
    <>
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
    </>
  )
}
