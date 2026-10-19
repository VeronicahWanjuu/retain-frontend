import { describe, it, expect } from 'vitest';
import reducer, { setSearch, setCategory, setPage, resetFilters } from './expenseSlice';

const start = reducer(undefined, { type: 'init' });

describe('expense filters', () => {
  it('starts on newest first, page 1', () => {
    expect(start.sort).toBe('-date');
    expect(start.page).toBe(1);
  });

  it('keeps the search text', () => {
    expect(reducer(start, setSearch('chips')).search).toBe('chips');
  });

  it('goes back to page 1 when a filter changes', () => {
    const onPage3 = reducer(start, setPage(3));
    expect(onPage3.page).toBe(3);
    expect(reducer(onPage3, setCategory('2')).page).toBe(1);
  });

  it('reset clears everything', () => {
    const messy = reducer(reducer(start, setSearch('x')), setCategory('4'));
    expect(reducer(messy, resetFilters())).toEqual(start);
  });
});