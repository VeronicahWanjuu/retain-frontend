export type UserRole = 'user' | 'admin';
export type PaymentMethod = 'mpesa' | 'cash' | 'card' | 'bank' | 'other';
export type BudgetStatus =
  | 'no budget'
  | 'within budget'
  | 'approaching budget'
  | 'over budget';

export interface User {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
  role: UserRole;
  date_joined: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<void>;
}

export interface Category {
  id: number;
  name: string;
}

export interface Expense {
  id: number;
  title: string;
  amount: number;
  category: number | null;
  category_name: string;
  date: string;
  payment_method: PaymentMethod;
  notes: string;
  created_at: string;
  user: number;
  username: string;
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ExpenseFilters {
  search: string;
  category: string;
  payment_method: string;
  start_date: string;
  end_date: string;
  min_amount: string;
  max_amount: string;
  sort: string;
  page: number;
}

export interface ExpenseFormData {
  title: string;
  amount: string;
  category: string;
  date: string;
  payment_method: PaymentMethod;
  notes: string;
}

export interface CategoryTotal {
  name: string;
  total: number;
}

export interface CategoryStat {
  id: number;
  name: string;
  count: number;
  total: number;
}

export interface DashboardData {
  month: number;
  year: number;
  total_spent: number;
  budget: number;
  remaining: number;
  percent_used: number;
  status: BudgetStatus;
  highest_expense: Expense | null;
  by_category: CategoryTotal[];
  recent_expenses: Expense[];
}

export interface AdminData {
  total_users: number;
  total_expenses: number;
  total_value: number;
  this_month_count: number;
  by_category: CategoryStat[];
  top5_categories: CategoryStat[];
  bottom5_categories: CategoryStat[];
  recent_expenses: Expense[];
  recent_users: User[];
}