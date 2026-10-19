import { useMemo, useState } from 'react';
import type { PaletteMode } from '@mui/material';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { AuthProvider } from './context/AuthContext';
import { makeTheme } from './theme';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AdminRoute from './components/layout/AdminRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/user/Dashboard';
import Expenses from './pages/user/Expenses';
import ExpenseDetail from './pages/user/ExpenseDetail';
import Budget from './pages/user/Budget';
import AdminDashboard from './pages/admin/AdminDashboard';
import Categories from './pages/admin/Categories';
import NotFound from './pages/NotFound';

function App() {
  // remembers dark mode; first visit follows the phone/laptop setting
  const [mode, setMode] = useState<PaletteMode>(() => {
    const saved = localStorage.getItem('mode');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const theme = useMemo(() => makeTheme(mode), [mode]);

  const toggleMode = () => {
    const next = mode === 'light' ? 'dark' : 'light';
    setMode(next);
    localStorage.setItem('mode', next);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Provider store={store}>
        <AuthProvider>
          <BrowserRouter>
            <Navbar mode={mode} onToggleMode={toggleMode} />
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
              <Route path="/expenses/:id" element={<ProtectedRoute><ExpenseDetail /></ProtectedRoute>} />
              <Route path="/budget" element={<ProtectedRoute><Budget /></ProtectedRoute>} />
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/categories" element={<AdminRoute><Categories /></AdminRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </Provider>
    </ThemeProvider>
  );
}

export default App;