import type { ReactNode } from 'react';
import { Paper, Typography } from '@mui/material';

interface Props {
  label: string;
  value: ReactNode;
  color?: string; 
}

const StatCard = ({ label, value, color }: Props) => (
  <Paper sx={{ p: 2.5, textAlign: 'center' }}>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="h5" component="div" sx={{ mt: 0.5, fontWeight: 700 }} color={color}>
      {value}
    </Typography>
  </Paper>
);

export default StatCard;