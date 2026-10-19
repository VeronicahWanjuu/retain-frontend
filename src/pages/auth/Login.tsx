import { useState } from 'react';
import type { FormEvent } from 'react';
import { Alert, Box, Button, Paper, TextField, Typography } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { errorText } from '../../utils/helpers';

const Login = () => {
  const { login } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const state = location.state as { from?: string; registered?: boolean } | null;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setErr('Enter your username and password');
      return;
    }
    setBusy(true);
    setErr('');
    try {
      await login(username, password);
      nav(state?.from ?? '/dashboard', { replace: true });
    } catch (error) {
      setErr(errorText(error));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2, mt: { xs: 2, sm: 6 } }}>
      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 4, width: '100%', maxWidth: 380 }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          Welcome back
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Sign in to see where your money went.
        </Typography>

        {state?.registered && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Account created. You can sign in now.
          </Alert>
        )}
        {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}

        <TextField
          fullWidth label="Username" sx={{ mb: 2 }} autoComplete="username"
          value={username} onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          fullWidth label="Password" type="password" sx={{ mb: 3 }} autoComplete="current-password"
          value={password} onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" fullWidth variant="contained" disabled={busy} sx={{ mb: 2 }}>
          {busy ? 'Signing in...' : 'Sign in'}
        </Button>
        <Typography variant="body2" sx={{ textAlign: 'center' }}>
          New here? <Link to="/register">Create an account</Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;