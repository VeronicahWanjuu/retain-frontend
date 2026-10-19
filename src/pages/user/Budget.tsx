import { useEffect, useState } from 'react';
import { Alert, Box, Button, Chip, CircularProgress, Container, Paper, TextField, Typography } from '@mui/material';
import api from '../../api/axios';
import BudgetBar from '../../components/BudgetBar';
import MonthPicker from '../../components/MonthPicker';
import { errorText, money, statusChipColor } from '../../utils/helpers';
import type { DashboardData } from '../../types/types';

const Budget = () => {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [data, setData] = useState<DashboardData | null>(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    api
      .get<DashboardData>('/dashboard/', { params: { month, year } })
      .then((res) => {
        if (ignore) return;
        setData(res.data);
        setAmount(res.data.budget ? String(res.data.budget) : '');
      })
      .catch((e) => {
        if (!ignore) setMsg({ text: errorText(e), type: 'error' });
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [month, year, attempt]);

  const save = async () => {
    const value = Number(amount);
    if (amount === '' || Number.isNaN(value) || value < 0) {
      setMsg({ text: 'Enter a budget of 0 or more', type: 'error' });
      return;
    }
    setSaving(true);
    try {
      await api.post('/budget/', { amount: value }, { params: { month, year } });
      setMsg({ text: 'Budget saved', type: 'success' });
      setAttempt((a) => a + 1);
    } catch (e) {
      setMsg({ text: errorText(e), type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Typography variant="h5">Monthly budget</Typography>
        <MonthPicker month={month} year={year} onChange={(m, y) => { setMonth(m); setYear(y); }} />
      </Box>

      {msg && <Alert severity={msg.type} onClose={() => setMsg(null)} sx={{ mb: 2 }}>{msg.text}</Alert>}
      {loading && <CircularProgress />}

      {!loading && data && (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography>Spent: <strong>{money(data.total_spent)}</strong></Typography>
            <Chip label={data.status} color={statusChipColor(data.status)} size="small" />
          </Box>

          <BudgetBar spent={data.total_spent} budget={data.budget} />

          {data.budget > 0 && (
            <Typography sx={{ mt: 2 }} color={data.remaining < 0 ? 'error' : 'text.primary'}>
              {data.remaining < 0
                ? `You are ${money(Math.abs(data.remaining))} over budget.`
                : `${money(data.remaining)} left to spend.`}
            </Typography>
          )}

          <TextField
            fullWidth type="number" label="Budget amount (KES)" sx={{ mt: 3, mb: 2 }}
            value={amount} onChange={(e) => setAmount(e.target.value)}
          />
          <Button fullWidth variant="contained" disabled={saving} onClick={save}>
            {saving ? 'Saving...' : 'Save budget'}
          </Button>
        </Paper>
      )}
    </Container>
  );
};

export default Budget;