import { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem,
  useMediaQuery, useTheme,
} from '@mui/material';
import type { PaletteMode } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface Props {
  mode: PaletteMode;
  onToggleMode: () => void;
}

const Navbar = ({ mode, onToggleMode }: Props) => {
  const { user, isAdmin, logout } = useAuth();
  const nav = useNavigate();
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down('md'));
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const links = [
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'Expenses', to: '/expenses' },
    { label: 'Budget', to: '/budget' },
    ...(isAdmin
      ? [
          { label: 'Admin', to: '/admin' },
          { label: 'Categories', to: '/admin/categories' },
        ]
      : []),
  ];

  const go = (to: string) => {
    setAnchor(null);
    nav(to);
  };

  const signOut = () => {
    setAnchor(null);
    logout();
    nav('/login');
  };

  return (
    <AppBar position="static" color="primary" enableColorOnDark>
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, cursor: 'pointer', fontWeight: 700 }}
          onClick={() => nav(user ? '/dashboard' : '/login')}
        >
          PesaSave
        </Typography>

        <IconButton color="inherit" onClick={onToggleMode} aria-label="switch light or dark mode">
          {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>

        {user && !small && (
          <Box sx={{ display: 'flex', gap: 1, ml: 1 }}>
            {links.map((l) => (
              <Button key={l.to} color="inherit" onClick={() => go(l.to)}>
                {l.label}
              </Button>
            ))}
            <Button color="inherit" variant="outlined" onClick={signOut}>
              Logout
            </Button>
          </Box>
        )}

        {user && small && (
          <>
            <IconButton color="inherit" onClick={(e) => setAnchor(e.currentTarget)} aria-label="open menu">
              <MenuIcon />
            </IconButton>
            <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
              {links.map((l) => (
                <MenuItem key={l.to} onClick={() => go(l.to)}>
                  {l.label}
                </MenuItem>
              ))}
              <MenuItem onClick={signOut}>Logout</MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;