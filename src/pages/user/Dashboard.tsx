import { useEffect, useState } from 'react';
import { Alert, Box, Button, Chip, CircularProgress, Container, LinearProgress, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import StatCard from '../../components/StatCard';
import BudgetBar from '../../components/BudgetBar';
import MonthPicker from '../../components/MonthPicker';
import { errorText, money, paymentLabel, statusChipColor } from '../../utils/helpers';
import type { DashboardData } from '../../types/types';

const Dashboard = () => {
  const nav = useNavigate();
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let ignore = false; 
    setLoading(true);
    setError('');
    api
      .get<DashboardData>('/dashboard/', { params: { month, year } })
      .then((res) => {
        if (!ignore) setData(res.data);
      })
      .catch((e) => {
        if (!ignore) setError(errorText(e));
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [month, year, attempt]);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Typography variant="h5">My dashboard</Typography>
        <MonthPicker month={month} year={year} onChange={(m, y) => { setMonth(m); setYear(y); }} />
      </Box>

      {loading && <CircularProgress />}

      {error && (
        <Alert severity="error" action={<Button color="inherit" onClick={() => setAttempt((a) => a + 1)}>Retry</Button>}>
          {error}
        </Alert>
      )}

      {!loading && !error && data && (
        <Box sx={{ display: 'grid', gap: 2 }}>
          {data.status === 'no budget' && (
            <Alert severity="info" action={<Button color="inherit" onClick={() => nav('/budget')}>Set budget</Button>}>
              You have no budget for this month yet.
            </Alert>
          )}

          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' } }}>
            <StatCard label="Spent" value={money(data.total_spent)} />
            <StatCard label="Budget" value={money(data.budget)} />
            <StatCard
              label="Remaining"
              value={money(data.remaining)}
              color={data.budget > 0 ? (data.remaining < 0 ? 'error.main' : 'success.main') : undefined}
            />
            <StatCard
              label="Status"
              value={<Chip label={data.status} color={statusChipColor(data.status)} />}
            />
          </Box>

          <Paper sx={{ p: 2.5 }}>
            <BudgetBar spent={data.total_spent} budget={data.budget} />
          </Paper>

          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
            <Paper sx={{ p: 2.5 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>Biggest expense</Typography>
              {data.highest_expense ? (
                <>
                  <Typography>
                    {data.highest_expense.title}: <strong>{money(data.highest_expense.amount)}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {data.highest_expense.date} · {data.highest_expense.category_name}
                  </Typography>
                </>
              ) : (
                <Typography color="text.secondary">Nothing spent this month yet.</Typography>
              )}
            </Paper>

            <Paper sx={{ p: 2.5 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>Spending by category</Typography>
              {data.by_category.length === 0 && (
                <Typography color="text.secondary">No spending to show yet.</Typography>
              )}
              {data.by_category.map((c) => (
                <Box key={c.name} sx={{ mb: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>{c.name}</Typography>
                    <Typography>{money(c.total)}</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={data.total_spent ? (c.total / data.total_spent) * 100 : 0}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
              ))}
            </Paper>
          </Box>

          <Paper sx={{ p: 2.5 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Recent expenses</Typography>
            {data.recent_expenses.length === 0 && (
              <Typography color="text.secondary">
                No expenses yet. Add your first one on the Expenses page.
              </Typography>
            )}
            {data.recent_expenses.map((e) => (
              <Box key={e.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: 1, borderColor: 'divider' }}>
                <Box>
                  <Typography>{e.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {e.date} · {e.category_name} · {paymentLabel(e.payment_method)}
                  </Typography>
                </Box>
                <Typography fontWeight="bold">{money(e.amount)}</Typography>
              </Box>
            ))}
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default Dashboard;