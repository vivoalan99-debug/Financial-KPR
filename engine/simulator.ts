
import { 
  FinancialInputs, 
  MonthLedger, 
  SimulationResult, 
  ExpenseCategory,
  ExtraPaymentLog
} from '../types';
import { 
  SIM_HORIZON_MONTHS, 
  THR_MONTH, 
  COMP_MONTH, 
  BPJS_MONTHLY_INCREMENT_RATE,
  MONTH_NAMES,
  SIM_START_YEAR
} from '../constants';
import { 
  getInterestRateForYear, 
  calculateAnnuityInstallment 
} from './mortgage';
import { analyzeRisk } from './risk';

function projectFutureInterest(
  principal: number, 
  remainingMonths: number, 
  startYearIndex: number,
  startMonthInYear: number
): number {
  let totalInterest = 0;
  let currentPrincipal = principal;
  let monthsLeft = remainingMonths;
  let m = 0;

  while (monthsLeft > 0 && currentPrincipal > 0) {
    const absoluteMonth = (startYearIndex * 12) + startMonthInYear + m;
    const currentYearIndex = Math.floor(absoluteMonth / 12);
    const rate = getInterestRateForYear(currentYearIndex);
    
    const installment = calculateAnnuityInstallment(currentPrincipal, rate, monthsLeft);
    const interest = currentPrincipal * (rate / 12);
    const principalPaid = Math.min(currentPrincipal, installment - interest);
    
    totalInterest += interest;
    currentPrincipal -= principalPaid;
    monthsLeft--;
    m++;
  }
  return totalInterest;
}

export const runSimulation = (inputs: FinancialInputs): SimulationResult => {
  const ledger: MonthLedger[] = [];
  const extraPaymentLogs: ExtraPaymentLog[] = [];
  
  let currentBaseSalary = inputs.baseSalary;
  let currentBpjsBalance = inputs.initialBpjsBalance;
  let currentBufferBalance = 0;
  let currentEmergencyBalance = 0;
  let currentExtraBucket = 0;
  
  let mortgagePrincipal = inputs.mortgage.initialPrincipal;
  let mortgageRemainingMonths = inputs.mortgage.remainingTermMonths;
  let currentMortgageInstallment = 0;
  let lastInterestRate = -1;

  let totalInterestSaved = 0;
  let fullPayoffMonth: number | null = null;
  let monthsSinceUnemployment = -1;

  const initialRate = getInterestRateForYear(0);
  const avgInitialInstallment = calculateAnnuityInstallment(mortgagePrincipal, initialRate, mortgageRemainingMonths);

  for (let m = 0; m < SIM_HORIZON_MONTHS; m++) {
    const yearIndex = Math.floor(m / 12);
    const monthInYear = m % 12;
    const isNewYear = monthInYear === 0;
    const dateStr = `${MONTH_NAMES[monthInYear]} ${SIM_START_YEAR + yearIndex}`;

    const isEmployed = inputs.unemploymentMonth === undefined || m < inputs.unemploymentMonth;
    
    if (!isEmployed) monthsSinceUnemployment++;

    if (isEmployed && isNewYear && yearIndex > 0) {
      currentBaseSalary *= (1 + inputs.annualSalaryIncreasePercent / 100);
    }

    // --- Income Logic ---
    let salaryIncome = isEmployed ? currentBaseSalary : 0;
    if (inputs.unemploymentMonth === m) salaryIncome = currentBaseSalary;

    let thrIncome = (isEmployed && monthInYear === THR_MONTH) ? currentBaseSalary : 0;

    let compIncome = 0;
    if (isEmployed && monthInYear === COMP_MONTH) {
      compIncome = currentBaseSalary;
    } else if (!isEmployed && monthsSinceUnemployment === 1) {
      compIncome = currentBaseSalary; 
    }

    let bpjsClaim = 0;
    if (!isEmployed && monthsSinceUnemployment === 2) {
      bpjsClaim = currentBpjsBalance;
      currentBpjsBalance = 0;
    } else if (isEmployed) {
      currentBpjsBalance += currentBaseSalary * BPJS_MONTHLY_INCREMENT_RATE;
    }

    const totalIncome = salaryIncome + thrIncome + compIncome + bpjsClaim;

    // --- Outflow Logic ---
    let monthlyBaseExpenses = inputs.expenses.reduce((acc, exp) => {
      const annualGrowthFactor = Math.pow(1 + exp.annualIncreasePercent / 100, yearIndex);
      return acc + (exp.monthlyAmount * annualGrowthFactor);
    }, 0);

    const holidayExpenses = thrIncome * 0.5;
    const currentRate = getInterestRateForYear(yearIndex);
    
    if (currentRate !== lastInterestRate) {
      currentMortgageInstallment = calculateAnnuityInstallment(mortgagePrincipal, currentRate, mortgageRemainingMonths);
      lastInterestRate = currentRate;
    }

    let interestPaid = 0;
    let principalPaid = 0;
    let extraPaymentApplied = 0;
    let installmentBeforeRecalc = 0;
    let installmentAfterRecalc = 0;

    if (mortgagePrincipal > 0) {
      interestPaid = mortgagePrincipal * (currentRate / 12);
      principalPaid = Math.min(mortgagePrincipal, currentMortgageInstallment - interestPaid);
      
      if (isNewYear && m > 0 && currentExtraBucket > 0) {
        const minExtra = 6 * currentMortgageInstallment;
        if (currentExtraBucket >= minExtra || mortgagePrincipal < minExtra) {
          installmentBeforeRecalc = currentMortgageInstallment;
          const penaltyPercent = inputs.mortgage.extraPaymentPenaltyPercent;
          const totalPaid = Math.min(currentExtraBucket, mortgagePrincipal / (1 - penaltyPercent / 100));
          const effectiveExtra = totalPaid - (totalPaid * penaltyPercent / 100);

          const futureInterestBefore = projectFutureInterest(mortgagePrincipal, mortgageRemainingMonths, yearIndex, monthInYear);
          mortgagePrincipal -= effectiveExtra;
          currentExtraBucket -= totalPaid;
          extraPaymentApplied = effectiveExtra;
          currentMortgageInstallment = calculateAnnuityInstallment(mortgagePrincipal, currentRate, mortgageRemainingMonths);
          installmentAfterRecalc = currentMortgageInstallment;

          const savings = futureInterestBefore - projectFutureInterest(mortgagePrincipal, mortgageRemainingMonths, yearIndex, monthInYear);
          totalInterestSaved += savings;
          extraPaymentLogs.push({
            monthIndex: m, year: SIM_START_YEAR + yearIndex, date: dateStr, amountPaid: totalPaid,
            penaltyAmount: totalPaid * penaltyPercent / 100, principalReduced: effectiveExtra,
            installmentBefore: installmentBeforeRecalc, installmentAfter: installmentAfterRecalc,
            termReduction: 0, totalInterestSaved: savings
          });
        }
      }

      mortgagePrincipal -= principalPaid;
      mortgageRemainingMonths--;
      if (mortgagePrincipal <= 0) {
        mortgagePrincipal = 0;
        if (fullPayoffMonth === null) fullPayoffMonth = m;
      }
    }

    const totalExpenses = monthlyBaseExpenses + (mortgagePrincipal > 0 ? currentMortgageInstallment : 0) + holidayExpenses;
    const surplusForMonth = totalIncome - totalExpenses;

    // --- Metrics & Flags Logic ---
    const incomeToExpenseRatio = totalExpenses > 0 ? (totalIncome / totalExpenses) * 100 : 1000;
    const debtServiceRatio = totalIncome > 0 ? ((mortgagePrincipal > 0 ? currentMortgageInstallment : 0) / totalIncome) * 100 : 0;

    const riskFlags: string[] = [];
    if (surplusForMonth < 0) riskFlags.push('DEFICIT');
    if (debtServiceRatio > 35) riskFlags.push('DTI_HIGH');
    if (debtServiceRatio > 50) riskFlags.push('DTI_CRITICAL');
    if (!isEmployed && currentBufferBalance < 1000000) riskFlags.push('RUNWAY_LOW');
    if (mortgagePrincipal === 0) riskFlags.push('PAID_OFF');

    // --- Surplus Allocation ---
    let monthlySurplus = surplusForMonth;
    const bufferTarget = 3 * monthlyBaseExpenses + 1 * avgInitialInstallment;
    const emergencyTarget = 12 * monthlyBaseExpenses + 12 * avgInitialInstallment;
    
    if (monthlySurplus > 0) {
      const toBuffer = Math.min(monthlySurplus, bufferTarget - currentBufferBalance);
      currentBufferBalance += Math.max(0, toBuffer);
      monthlySurplus -= Math.max(0, toBuffer);
      
      const toEmergency = Math.min(monthlySurplus, emergencyTarget - currentEmergencyBalance);
      currentEmergencyBalance += Math.max(0, toEmergency);
      monthlySurplus -= Math.max(0, toEmergency);

      currentExtraBucket += Math.max(0, monthlySurplus);
    } else {
      let deficit = Math.abs(monthlySurplus);
      const fromBuffer = Math.min(deficit, currentBufferBalance);
      currentBufferBalance -= fromBuffer;
      deficit -= fromBuffer;
      const fromEmergency = Math.min(deficit, currentEmergencyBalance);
      currentEmergencyBalance -= fromEmergency;
      deficit -= fromEmergency;
    }

    ledger.push({
      monthIndex: m,
      date: dateStr,
      isEmployed,
      income: {
        salary: salaryIncome, thr: thrIncome, compensation: compIncome, bpjsClaim: bpjsClaim, total: totalIncome,
      },
      expenses: {
        totalBase: monthlyBaseExpenses,
        mortgageInstallment: mortgagePrincipal > 0 ? currentMortgageInstallment : 0,
        holidayExpenses,
        grandTotal: totalExpenses,
      },
      mortgage: {
        interestRate: currentRate, interestPaid, principalPaid,
        remainingPrincipal: mortgagePrincipal, extraPaymentApplied,
        interestSaved: 0, termReduction: 0,
        installmentBeforeRecalc, installmentAfterRecalc,
      },
      funds: {
        buffer: currentBufferBalance, emergency: currentEmergencyBalance,
        extraBucket: currentExtraBucket, bpjs: currentBpjsBalance,
        bufferTarget, emergencyTarget,
      },
      metrics: {
        incomeToExpenseRatio,
        debtServiceRatio,
      },
      surplus: surplusForMonth,
      riskFlags: riskFlags,
    });
  }

  return {
    ledger,
    risk: analyzeRisk(ledger),
    extraPaymentLogs,
    totalInterestSaved,
    fullPayoffMonth,
  };
};
