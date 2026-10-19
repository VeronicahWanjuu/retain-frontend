import { useState } from 'react';
import type { FormEvent } from 'react';
import { Alert, Box, Button, Paper, TextField, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { errorText } from '../../utils/helpers';

const Register = () => {
  const { register } = useAuth();
  const nav = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setErr('Fill in all three fields');
      return;
    }
    setBusy(true);
    setErr('');
    try {
      await register(username, email, password);
      nav('/login', { state: { registered: true } });
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
          Start saving smarter
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Free account, takes a minute.
        </Typography>

        {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}

        <TextField
          fullWidth label="Username" sx={{ mb: 2 }} autoComplete="username"
          value={username} onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          fullWidth label="Email" type="email" sx={{ mb: 2 }} autoComplete="email"
          value={email} onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth label="Password" type="password" sx={{ mb: 1 }} autoComplete="new-password"
          helperText="At least 8 characters, not too common"
          value={password} onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" fullWidth variant="contained" disabled={busy} sx={{ my: 2 }}>
          {busy ? 'Creating...' : 'Create account'}
        </Button>
        <Typography variant="body2" sx={{ textAlign: 'center' }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Register;