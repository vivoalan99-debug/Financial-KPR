
import { MORTGAGE_INTEREST_SCHEDULE } from '../constants';

/**
 * Calculates the monthly installment for a mortgage using the annuity formula.
 * C = P * [ r * (1+r)^n ] / [ (1+r)^n - 1 ]
 */
export const calculateAnnuityInstallment = (
  principal: number,
  annualRate: number,
  remainingMonths: number
): number => {
  if (remainingMonths <= 0 || principal <= 0) return 0;
  
  const r = annualRate / 12;
  const n = remainingMonths;
  
  // Handle 0% interest case (though not in our schedule)
  if (r === 0) return principal / n;

  const installment = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return installment;
};

/**
 * Retrieves the locked interest rate for a specific year index.
 */
export const getInterestRateForYear = (yearIndex: number): number => {
  const year = yearIndex + 1; // 1-based year for comparison
  const schedule = MORTGAGE_INTEREST_SCHEDULE.find(
    (s) => year >= s.startYear && year <= s.endYear
  );
  return schedule ? schedule.rate : MORTGAGE_INTEREST_SCHEDULE[MORTGAGE_INTEREST_SCHEDULE.length - 1].rate;
};
