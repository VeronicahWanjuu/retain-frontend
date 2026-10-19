import axios from 'axios';
import type { BudgetStatus, PaymentMethod } from '../types/types';

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const PAYMENT_OPTIONS: { value: PaymentMethod; label: string }[] = [
  { value: 'mpesa', label: 'M-Pesa' },
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Card' },
  { value: 'bank', label: 'Bank transfer' },
  { value: 'other', label: 'Other' },
];

export const paymentLabel = (value: string) =>
  PAYMENT_OPTIONS.find((o) => o.value === value)?.label ?? value;

// shows 1500 as KES 1,500
export const money = (n: number) =>
  new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n);

// today's date in YYYY-MM-DD using the phone or laptop's own timezone
export const today = () => new Date().toLocaleDateString('en-CA');

// the progress bar: green, then orange from 80%, red at 100%
export function budgetColor(percent: number): 'success' | 'warning' | 'error' {
  if (percent >= 100) return 'error';
  if (percent >= 80) return 'warning';
  return 'success';
}

export function statusChipColor(
  status: BudgetStatus
): 'success' | 'warning' | 'error' | 'default' {
  if (status === 'over budget') return 'error';
  if (status === 'approaching budget') return 'warning';
  if (status === 'within budget') return 'success';
  return 'default';
}

// turns whatever the server said into one readable line for the user
export function errorText(err: unknown, fallback = 'Something went wrong. Try again.'): string {
  if (axios.isAxiosError(err)) {
    if (!err.response) return 'Cannot reach the server. Check your internet and try again.';
    const d = err.response.data;
    if (Array.isArray(d)) return d.join(' ');
    if (d && typeof d === 'object') {
      if (typeof d.detail === 'string') return d.detail;
      const parts = Object.entries(d).map(
        ([key, val]) => `${key}: ${Array.isArray(val) ? val.join(' ') : String(val)}`
      );
      if (parts.length) return parts.join(' | ');
    }
  }
  return fallback;
}