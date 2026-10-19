import { useEffect, useState } from 'react';
import { Box, Button, MenuItem, Paper, TextField, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  setSearch, setCategory, setPaymentMethod, setStartDate, setEndDate,
  setMinAmount, setMaxAmount, setSort, resetFilters,
} from '../store/slices/expenseSlice';
import { PAYMENT_OPTIONS } from '../utils/helpers';
import type { Category } from '../types/types';

const FilterBar = ({ categories }: { categories: Category[] }) => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((s) => s.expenses);

  // the box updates instantly
  const [text, setText] = useState(filters.search);
  useEffect(() => {
    if (text === filters.search) return;
    const timer = setTimeout(() => dispatch(setSearch(text)), 400);
    return () => clearTimeout(timer);
  }, [text, filters.search, dispatch]);

  const shrink = { inputLabel: { shrink: true } };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="subtitle2" sx={{ mb: 2 }}>Find an expense</Typography>
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' } }}>
        <TextField size="small" label="Search title" value={text} onChange={(e) => setText(e.target.value)} />
        <TextField select size="small" label="Category" value={filters.category}
          onChange={(e) => dispatch(setCategory(e.target.value))}>
          <MenuItem value="">All</MenuItem>
          {categories.map((c) => (
            <MenuItem key={c.id} value={String(c.id)}>{c.name}</MenuItem>
          ))}
        </TextField>
        <TextField select size="small" label="Paid with" value={filters.payment_method}
          onChange={(e) => dispatch(setPaymentMethod(e.target.value))}>
          <MenuItem value="">All</MenuItem>
          {PAYMENT_OPTIONS.map((o) => (
            <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
          ))}
        </TextField>
        <TextField select size="small" label="Sort by" value={filters.sort}
          onChange={(e) => dispatch(setSort(e.target.value))}>
          <MenuItem value="-date">Newest first</MenuItem>
          <MenuItem value="date">Oldest first</MenuItem>
          <MenuItem value="-amount">Highest amount</MenuItem>
          <MenuItem value="amount">Lowest amount</MenuItem>
        </TextField>
        <TextField size="small" type="date" label="From" value={filters.start_date} slotProps={shrink}
          onChange={(e) => dispatch(setStartDate(e.target.value))} />
        <TextField size="small" type="date" label="To" value={filters.end_date} slotProps={shrink}
          onChange={(e) => dispatch(setEndDate(e.target.value))} />
        <TextField size="small" type="number" label="Min amount" value={filters.min_amount}
          onChange={(e) => dispatch(setMinAmount(e.target.value))} />
        <TextField size="small" type="number" label="Max amount" value={filters.max_amount}
          onChange={(e) => dispatch(setMaxAmount(e.target.value))} />
      </Box>
      <Button sx={{ mt: 2 }} variant="outlined" onClick={() => { setText(''); dispatch(resetFilters()); }}>
        Clear filters
      </Button>
    </Paper>
  );
};

export default FilterBar;