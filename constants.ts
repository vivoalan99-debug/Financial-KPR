
export const SIM_START_YEAR = 2026;
export const SIM_HORIZON_MONTHS = 240; // 20 years

export const MORTGAGE_INTEREST_SCHEDULE = [
  { startYear: 1, endYear: 3, rate: 0.0365 },
  { startYear: 4, endYear: 6, rate: 0.0765 },
  { startYear: 7, endYear: 10, rate: 0.0965 },
  { startYear: 11, endYear: 20, rate: 0.1065 },
];

export const BPJS_MONTHLY_INCREMENT_RATE = 0.057; // 5.7% of base salary

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const THR_MONTH = 2; // March (0-indexed)
export const COMP_MONTH = 3; // April (0-indexed)
