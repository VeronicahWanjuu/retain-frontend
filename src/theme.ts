import { createTheme } from '@mui/material/styles';
import type { PaletteMode } from '@mui/material';

// green for eg if there is  money in the bank, orange for careful of how you are using the money
export function makeTheme(mode: PaletteMode) {
  return createTheme({
    palette: {
      mode,
      primary: { main: mode === 'light' ? '#1b8a3d' : '#3ddc84' },
      secondary: { main: '#f5a623' },
      background:
        mode === 'light'
          ? { default: '#f2f7f3', paper: '#ffffff' }
          : { default: '#0e1512', paper: '#16211b' },
    },
    shape: { borderRadius: 12 },
  });
}