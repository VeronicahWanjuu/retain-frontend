import { describe, it, expect } from 'vitest';
import { budgetColor, statusChipColor } from './helpers';

describe('budget bar colours', () => {
  it('is green while comfortably under budget', () => {
    expect(budgetColor(0)).toBe('success');
    expect(budgetColor(79.9)).toBe('success');
  });

  it('turns orange from 80 percent', () => {
    expect(budgetColor(80)).toBe('warning');
    expect(budgetColor(99)).toBe('warning');
  });

  it('turns red at 100 percent and above', () => {
    expect(budgetColor(100)).toBe('error');
    expect(budgetColor(140)).toBe('error');
  });

  it('matches the chip colour to the status text', () => {
    expect(statusChipColor('over budget')).toBe('error');
    expect(statusChipColor('no budget')).toBe('default');
  });
});