import { useState } from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from '@mui/material';
import api from '../api/axios';
import { PAYMENT_OPTIONS, errorText, today } from '../utils/helpers';
import type { Category, Expense, ExpenseFormData, PaymentMethod } from '../types/types';

interface Props {
  expense: Expense | null; 
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}

const ExpenseFormDialog = ({ expense, categories, onClose, onSaved }: Props) => {
  const [form, setForm] = useState<ExpenseFormData>(() =>
    expense
      ? {
          title: expense.title,
          amount: String(expense.amount),
          category: expense.category ? String(expense.category) : '',
          date: expense.date,
          payment_method: expense.payment_method,
          notes: expense.notes,
        }
      : { title: '', amount: '', category: '', date: today(), payment_method: 'mpesa', notes: '' }
  );
  const [errors, setErrors] = useState<Partial<Record<keyof ExpenseFormData, string>>>({});
  const [serverError, setServerError] = useState('');
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof ExpenseFormData>(key: K, value: ExpenseFormData[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    const found: typeof errors = {};
    if (!form.title.trim()) found.title = 'Give it a title';
    if (!form.amount || Number(form.amount) <= 0) found.amount = 'Amount must be more than 0';
    if (!form.date) found.date = 'Pick a date';
    setErrors(found);
    return Object.keys(found).length === 0;
  };

  const save = async () => {
    if (!validate()) return;
    setSaving(true);
    setServerError('');
    const payload = {
      title: form.title.trim(),
      amount: Number(form.amount),
      category: form.category ? Number(form.category) : null,
      date: form.date,
      payment_method: form.payment_method,
      notes: form.notes,
    };
    try {
      if (expense) await api.put(`/expenses/${expense.id}/`, payload);
      else await api.post('/expenses/', payload);
      onSaved();
    } catch (e) {
      setServerError(errorText(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{expense ? 'Edit expense' : 'Add expense'}</DialogTitle>
      <DialogContent sx={{ display: 'grid', gap: 2, pt: '8px !important' }}>
        {serverError && <Alert severity="error">{serverError}</Alert>}

        <TextField
          label="What did you spend on?" value={form.title}
          error={!!errors.title} helperText={errors.title}
          onChange={(e) => set('title', e.target.value)}
        />
        <TextField
          label="Amount (KES)" type="number" value={form.amount}
          error={!!errors.amount} helperText={errors.amount}
          onChange={(e) => set('amount', e.target.value)}
        />
        <TextField
          select label="Category" value={form.category}
          onChange={(e) => set('category', e.target.value)}
        >
          <MenuItem value="">Uncategorized</MenuItem>
          {categories.map((c) => (
            <MenuItem key={c.id} value={String(c.id)}>{c.name}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Date" type="date" value={form.date}
          error={!!errors.date} helperText={errors.date}
          slotProps={{ inputLabel: { shrink: true } }}
          onChange={(e) => set('date', e.target.value)}
        />
        <TextField
          select label="Paid with" value={form.payment_method}
          onChange={(e) => set('payment_method', e.target.value as PaymentMethod)}
        >
          {PAYMENT_OPTIONS.map((o) => (
            <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Notes (optional)" multiline rows={2} value={form.notes}
          onChange={(e) => set('notes', e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" disabled={saving} onClick={save}>
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExpenseFormDialog;