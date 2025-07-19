import { Checkbox, FormControlLabel } from '@mui/material'

interface CheckboxFilterContentProps {
  options: readonly string[]
  selectedValues: string[]
  onChange: (value: string) => void
}

export default function CheckboxFilterContent({
  options,
  selectedValues,
  onChange,
}: CheckboxFilterContentProps) {
  const handleCheckboxChange = (value: string) => {
    onChange(value)
  }

  return (
    <>
      {options.map(option => (
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
