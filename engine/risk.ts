
import { MonthLedger, RiskAnalysis, RiskLevel } from '../types';

export const analyzeRisk = (ledger: MonthLedger[]): RiskAnalysis => {
  const explanation: string[] = [];
  let liquidityRunwayMonths = 0;
  let mortgageStressMonth: number | null = null;
  const depletionTimeline: { fund: string; month: number }[] = [];

  // Finding the first month where total outflows cannot be met by inflows + existing liquidity
  // To simulate "Survival", we look at the 'unemployed' phase if it exists,
  // or simply check months with negative surplus where funds are depleted.
  
  let foundDefault = false;
  
  for (let i = 0; i < ledger.length; i++) {
    const month = ledger[i];
    
    // Check for mortgage default
    if (month.mortgage.remainingPrincipal > 0 && month.expenses.mortgageInstallment > 0) {
      const totalAvailable = month.income.total + month.funds.buffer + month.funds.emergency + month.funds.bpjs;
      if (totalAvailable < month.expenses.grandTotal && !foundDefault) {
        mortgageStressMonth = i;
        foundDefault = true;
      }
    }

    // Runway calculation: only useful if we are looking at the unemployment scenario
    // If employed forever, runway is "max". If unemployed, we count months.
    if (!month.isEmployed) {
       const totalAvailable = month.income.total + month.funds.buffer + month.funds.emergency + month.funds.bpjs;
       if (totalAvailable >= month.expenses.grandTotal) {
         liquidityRunwayMonths++;
       }
    }
  }

  // Deterministic Risk Logic
  let level = RiskLevel.LOW;
  
  // If no unemployment is set, "runway" is effectively infinite in this deterministic view, 
  // but we can evaluate based on fund completeness.
  const lastMonth = ledger[ledger.length - 1];
  const emergencyIsFull = lastMonth.funds.emergency >= lastMonth.funds.emergencyTarget;

  if (liquidityRunwayMonths < 6) {
    level = RiskLevel.HIGH;
    explanation.push("Liquidity runway is critically short (less than 6 months).");
  } else if (liquidityRunwayMonths < 12) {
    level = RiskLevel.MEDIUM;
    explanation.push("Liquidity runway is moderate (6-11 months).");
  } else {
    level = RiskLevel.LOW;
    explanation.push("Liquidity runway is healthy (12+ months).");
  }

  if (!emergencyIsFull && level !== RiskLevel.HIGH) {
    level = RiskLevel.MEDIUM;
    explanation.push("Emergency fund is not yet fully funded to target.");
  }

  if (mortgageStressMonth !== null && mortgageStressMonth < 12) {
    level = RiskLevel.HIGH;
    explanation.push(`Mortgage default risk detected at month ${mortgageStressMonth} under current scenario.`);
  }

  return {
    liquidityRunwayMonths,
    mortgageStressMonth,
    depletionTimeline,
    level,
    explanation,
  };
};
