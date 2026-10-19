import { Box, IconButton, Link as MuiLink, Paper, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Link as RouterLink } from 'react-router-dom';
import { money, paymentLabel } from '../utils/helpers';
import type { Expense } from '../types/types';

interface Props {
  expense: Expense;
  onEdit: (e: Expense) => void;
  onDelete: (e: Expense) => void;
}

const ExpenseCard = ({ expense, onEdit, onDelete }: Props) => (
  <Paper sx={{ p: 2, mb: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
    <Box sx={{ minWidth: 0 }}>
      <MuiLink component={RouterLink} to={`/expenses/${expense.id}`} underline="hover" color="inherit" fontWeight="bold">
        {expense.title}
      </MuiLink>
      <Typography variant="body2" color="text.secondary">
        {expense.date} · {expense.category_name} · {paymentLabel(expense.payment_method)}
      </Typography>
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
      <Typography fontWeight="bold" sx={{ mr: 0.5 }}>{money(expense.amount)}</Typography>
      <IconButton size="small" aria-label="edit" onClick={() => onEdit(expense)}>
        <EditIcon fontSize="small" />
      </IconButton>
      <IconButton size="small" color="error" aria-label="delete" onClick={() => onDelete(expense)}>
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Box>
  </Paper>
);

export default ExpenseCard;