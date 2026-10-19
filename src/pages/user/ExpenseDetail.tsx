import { useEffect, useState } from 'react';
import { Alert, Box, Button, CircularProgress, Container, Paper, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import ConfirmDialog from '../../components/ConfirmDialog';
import { errorText, money, paymentLabel } from '../../utils/helpers';
import type { Expense } from '../../types/types';

const ExpenseDetail = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const [expense, setExpense] = useState<Expense | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    api
      .get<Expense>(`/expenses/${id}/`)
      .then((res) => setExpense(res.data))
      .catch((e) => setError(errorText(e)))
      .finally(() => setLoading(false));
  }, [id]);

  const remove = async () => {
    try {
      await api.delete(`/expenses/${id}/`);
      nav('/expenses');
    } catch (e) {
      setError(errorText(e));
      setConfirm(false);
    }
  };

  const row = (label: string, value: string) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: 1, borderColor: 'divider' }}>
      <Typography color="text.secondary">{label}</Typography>
      <Typography>{value}</Typography>
    </Box>
  );

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Button onClick={() => nav('/expenses')} sx={{ mb: 2 }}>Back to expenses</Button>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {expense && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>{expense.title}</Typography>
          {row('Amount', money(expense.amount))}
          {row('Category', expense.category_name)}
          {row('Date', expense.date)}
          {row('Paid with', paymentLabel(expense.payment_method))}
          {row('Notes', expense.notes || 'None')}
          <Button color="error" variant="outlined" sx={{ mt: 3 }} onClick={() => setConfirm(true)}>
            Delete expense
          </Button>
        </Paper>
      )}

      <ConfirmDialog
        open={confirm}
        title="Delete this expense?"
        text="This cannot be undone."
        onConfirm={remove}
        onCancel={() => setConfirm(false)}
      />
    </Container>
  );
};

export default ExpenseDetail;