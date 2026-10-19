import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const nav = useNavigate();
  return (
    <Box sx={{ textAlign: 'center', mt: 10, p: 2 }}>
      <Typography variant="h3" sx={{ mb: 1 }}>404</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>That page does not exist.</Typography>
      <Button variant="contained" onClick={() => nav('/dashboard')}>Back to dashboard</Button>
    </Box>
  );
};

export default NotFound;