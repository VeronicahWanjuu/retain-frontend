import { Box, LinearProgress, Typography } from '@mui/material';
import { budgetColor, money } from '../utils/helpers';

interface Props {
  spent: number;
  budget: number;
}

// green while you are fine, orange near the limit, red once you pass it
const BudgetBar = ({ spent, budget }: Props) => {
  if (budget <= 0) return null;
  const percent = (spent / budget) * 100;

  return (
    <Box>
      <LinearProgress
        variant="determinate"
        value={Math.min(percent, 100)}
        color={budgetColor(percent)}
        sx={{ height: 12, borderRadius: 6 }}
      />
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        {Math.round(percent)}% used ({money(spent)} of {money(budget)})
      </Typography>
    </Box>
  );
};

export default BudgetBar;