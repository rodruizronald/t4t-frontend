import { FormControlLabel, Radio, RadioGroup } from '@mui/material'
import React from 'react'

import type { DateValue } from '../../../../constants/filterOptions'

interface DateFilterContentProps {
  options: ReadonlyArray<{ value: DateValue; label: string }>
  value: DateValue
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function DateFilterContent({
  options,
  value,
  onChange,
}: DateFilterContentProps) {
  return (
    <RadioGroup value={value} onChange={onChange}>
      {options.map(option => (
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
