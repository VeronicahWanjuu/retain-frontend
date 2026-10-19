import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ExpenseFilters } from '../../types/types';

const initialState: ExpenseFilters = {
  search: '',
  category: '',
  payment_method: '',
  start_date: '',
  end_date: '',
  min_amount: '',
  max_amount: '',
  sort: '-date',
  page: 1,
};

// changing any filter sends you back to page 1, otherwise you can land on an empty page
const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.page = 1;
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
      state.page = 1;
    },
    setPaymentMethod: (state, action: PayloadAction<string>) => {
      state.payment_method = action.payload;
      state.page = 1;
    },
    setStartDate: (state, action: PayloadAction<string>) => {
      state.start_date = action.payload;
      state.page = 1;
    },
    setEndDate: (state, action: PayloadAction<string>) => {
      state.end_date = action.payload;
      state.page = 1;
    },
    setMinAmount: (state, action: PayloadAction<string>) => {
      state.min_amount = action.payload;
      state.page = 1;
    },
    setMaxAmount: (state, action: PayloadAction<string>) => {
      state.max_amount = action.payload;
      state.page = 1;
    },
    setSort: (state, action: PayloadAction<string>) => {
      state.sort = action.payload;
      state.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    resetFilters: () => initialState,
  },
});

export const {
  setSearch, setCategory, setPaymentMethod, setStartDate, setEndDate,
  setMinAmount, setMaxAmount, setSort, setPage, resetFilters,
} = expenseSlice.actions;

export default expenseSlice.reducer;