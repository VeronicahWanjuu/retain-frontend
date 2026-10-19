import { useEffect, useState } from 'react';
import { Alert, Box, Button, CircularProgress, Container, Paper, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import StatCard from '../../components/StatCard';
import { errorText, money } from '../../utils/helpers';
import type { AdminData, CategoryStat } from '../../types/types';

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <Paper sx={{ p: 2.5 }}>
    <Typography variant="h6" sx={{ mb: 1.5 }}>{title}</Typography>
    {children}
  </Paper>
);

const StatRows = ({ items }: { items: CategoryStat[] }) => (
  <>
    {items.map((c) => (
      <Box key={c.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography>{c.name}</Typography>
        <Typography color="text.secondary">
          {c.count} expenses · {money(c.total)}
        </Typography>
      </Box>
    ))}
  </>
);

const AdminDashboard = () => {
  const nav = useNavigate();
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get<AdminData>('/admin-dashboard/')
      .then((res) => setData(res.data))
      .catch((e) => setError(errorText(e)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Admin dashboard</Typography>
        <Button variant="outlined" onClick={() => nav('/admin/categories')}>Manage categories</Button>
      </Box>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {data && (
        <Box sx={{ display: 'grid', gap: 2 }}>
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' } }}>
            <StatCard label="Registered users" value={data.total_users} />
            <StatCard label="Expenses recorded" value={data.total_expenses} />
            <StatCard label="Total value" value={money(data.total_value)} />
            <StatCard label="Expenses this month" value={data.this_month_count} />
          </Box>

          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
            <Section title="Top 5 most-used categories"><StatRows items={data.top5_categories} /></Section>
            <Section title="Bottom 5 least-used categories"><StatRows items={data.bottom5_categories} /></Section>
          </Box>

          <Section title="Total spending per category">
            <StatRows items={data.by_category} />
          </Section>

          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
            <Section title="Recently added expenses">
              {data.recent_expenses.length === 0 && <Typography color="text.secondary">None yet.</Typography>}
              {data.recent_expenses.map((e) => (
                <Box key={e.id} sx={{ mb: 1 }}>
                  <Typography>{e.title}: {money(e.amount)}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    by {e.username} · added {new Date(e.created_at).toLocaleDateString()}
                  </Typography>
                </Box>
              ))}
            </Section>
            <Section title="Recently registered users">
              {data.recent_users.map((u) => (
                <Box key={u.id} sx={{ mb: 1 }}>
                  <Typography>{u.username}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {u.email} · joined {new Date(u.date_joined).toLocaleDateString()}
                  </Typography>
                </Box>
              ))}
            </Section>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default AdminDashboard;