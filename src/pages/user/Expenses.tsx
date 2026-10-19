import { useEffect, useState } from 'react';
import { Alert, Box, Button, CircularProgress, Container, Pagination, Snackbar, Typography } from '@mui/material';
import api from '../../api/axios';
import ConfirmDialog from '../../components/ConfirmDialog';
import ExpenseCard from '../../components/ExpenseCard';
import ExpenseFormDialog from '../../components/ExpenseFormDialog';
import FilterBar from '../../components/FilterBar';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setPage } from '../../store/slices/expenseSlice';
import { errorText } from '../../utils/helpers';
import type { Category, Expense, ExpenseFilters, Paginated } from '../../types/types';

const PAGE_SIZE = 10;

// only send the filters the user actually filled in
const buildParams = (f: ExpenseFilters) => {
  const params: Record<string, string | number> = { sort: f.sort, page: f.page };
  if (f.search) params.search = f.search;
  if (f.category) params.category = f.category;
  if (f.payment_method) params.payment_method = f.payment_method;
  if (f.start_date) params.start_date = f.start_date;
  if (f.end_date) params.end_date = f.end_date;
  if (f.min_amount) params.min_amount = f.min_amount;
  if (f.max_amount) params.max_amount = f.max_amount;
  return params;
};

const Expenses = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((s) => s.expenses);

  const [data, setData] = useState<Paginated<Expense> | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [reload, setReload] = useState(0);
  const [formFor, setFormFor] = useState<Expense | 'new' | null>(null);
  const [toDelete, setToDelete] = useState<Expense | null>(null);
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    api.get<Category[]>('/categories/').then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setLoadError('');
    api
      .get<Paginated<Expense>>('/expenses/', { params: buildParams(filters) })
      .then((res) => {
        if (!ignore) setData(res.data);
      })
      .catch((e) => {
        if (!ignore) setLoadError(errorText(e));
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [filters, reload]);

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await api.delete(`/expenses/${toDelete.id}/`);
      setToast({ text: 'Expense deleted', type: 'success' });
      // if that was the last one on this page, step back a page
      if (data && data.results.length === 1 && filters.page > 1) dispatch(setPage(filters.page - 1));
      else setReload((r) => r + 1);
    } catch (e) {
      setToast({ text: errorText(e), type: 'error' });
    }
    setToDelete(null);
  };

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">My expenses</Typography>
        <Button variant="contained" onClick={() => setFormFor('new')}>+ Add expense</Button>
      </Box>

      <FilterBar categories={categories} />

      {loading && <CircularProgress />}
      {loadError && <Alert severity="error">{loadError}</Alert>}

      {!loading && !loadError && data && data.count === 0 && (
        <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
          No expenses found. Add one, or clear your filters.
        </Typography>
      )}

      {!loadError && data?.results.map((e) => (
        <ExpenseCard key={e.id} expense={e} onEdit={setFormFor} onDelete={setToDelete} />
      ))}

      {data && data.count > PAGE_SIZE && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={Math.ceil(data.count / PAGE_SIZE)}
            page={filters.page}
            onChange={(_, p) => dispatch(setPage(p))}
            color="primary"
          />
        </Box>
      )}

      {formFor !== null && (
        <ExpenseFormDialog
          expense={formFor === 'new' ? null : formFor}
          categories={categories}
          onClose={() => setFormFor(null)}
          onSaved={() => {
            setToast({ text: formFor === 'new' ? 'Expense added' : 'Expense updated', type: 'success' });
            setFormFor(null);
            setReload((r) => r + 1);
          }}
        />
      )}

      <ConfirmDialog
        open={toDelete !== null}
        title="Delete this expense?"
        text={toDelete ? `"${toDelete.title}" will be removed for good.` : ''}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />

      <Snackbar open={toast !== null} autoHideDuration={3000} onClose={() => setToast(null)}>
        <Alert severity={toast?.type ?? 'success'} variant="filled">{toast?.text}</Alert>
      </Snackbar>
    </Container>
  );
};

export default Expenses;