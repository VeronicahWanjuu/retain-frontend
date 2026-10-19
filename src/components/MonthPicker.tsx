import { Box, MenuItem, TextField } from '@mui/material';
import { MONTHS } from '../utils/helpers';

interface Props {
  month: number;
  year: number;
  onChange: (month: number, year: number) => void;
}

const MonthPicker = ({ month, year, onChange }: Props) => {
  const thisYear = new Date().getFullYear();
  const years = [thisYear - 2, thisYear - 1, thisYear, thisYear + 1];

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <TextField
        select size="small" label="Month" value={month} sx={{ minWidth: 130 }}
        onChange={(e) => onChange(Number(e.target.value), year)}
      >
        {MONTHS.map((m, i) => (
          <MenuItem key={m} value={i + 1}>{m}</MenuItem>
        ))}
      </TextField>
      <TextField
        select size="small" label="Year" value={year} sx={{ minWidth: 100 }}
        onChange={(e) => onChange(month, Number(e.target.value))}
      >
        {years.map((y) => (
          <MenuItem key={y} value={y}>{y}</MenuItem>
        ))}
      </TextField>
    </Box>
  );
};

export default MonthPicker;