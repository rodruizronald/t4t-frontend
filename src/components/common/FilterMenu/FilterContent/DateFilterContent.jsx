import { RadioGroup, FormControlLabel, Radio } from '@mui/material'

export default function DateFilterContent({ options, value, onChange }) {
  return (
    <RadioGroup value={value} onChange={onChange}>
      {options.map((option) => (
        <FormControlLabel
          key={option.value}
          value={option.value}
          control={<Radio sx={{ color: '#057642' }} />}
          label={option.label}
          sx={{
            px: 1.5,
          }}
        />
      ))}
    </RadioGroup>
  )
}
