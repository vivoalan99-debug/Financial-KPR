
export enum ExpenseCategory {
  MANDATORY = 'Mandatory',
  DISCRETIONARY = 'Discretionary',
}

export interface ExpenseItem {
  id: string;
  name: string;
  category: ExpenseCategory;
  monthlyAmount: number;
  annualIncreasePercent: number;
}

export interface MortgageInputs {
  initialPrincipal: number;
  remainingTermMonths: number;
  extraPaymentPenaltyPercent: number;
}

export interface FinancialInputs {
  baseSalary: number;
  annualSalaryIncreasePercent: number;
  initialBpjsBalance: number;
  expenses: ExpenseItem[];
  mortgage: MortgageInputs;
  unemploymentMonth?: number; // Month index (0-based) where employment ends
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export interface ExtraPaymentLog {
  monthIndex: number;
  year: number;
  date: string;
  amountPaid: number;
  penaltyAmount: number;
  principalReduced: number;
  installmentBefore: number;
  installmentAfter: number;
  termReduction: number; 
  totalInterestSaved: number;
}

export interface MonthLedger {
  monthIndex: number;
  date: string;
  isEmployed: boolean;
  income: {
    salary: number;
    thr: number;
    compensation: number;
    bpjsClaim: number; 
    total: number;
  };
  expenses: {
    totalBase: number;
    mortgageInstallment: number;
    holidayExpenses: number;
    grandTotal: number;
  };
  mortgage: {
    interestRate: number;
    interestPaid: number;
    principalPaid: number;
    remainingPrincipal: number;
    installmentBeforeRecalc?: number;
    installmentAfterRecalc?: number;
    extraPaymentApplied: number;
    interestSaved: number;
    termReduction: number;
  };
  funds: {
    buffer: number;
    emergency: number;
    extraBucket: number;
    bpjs: number;
    bufferTarget: number;
    emergencyTarget: number;
  };
  metrics: {
    incomeToExpenseRatio: number; // Income / Expenses %
    debtServiceRatio: number;     // Installment / Income %
  };
  surplus: number;
  riskFlags: string[];
}

export interface RiskAnalysis {
  liquidityRunwayMonths: number;
  mortgageStressMonth: number | null;
  depletionTimeline: {
    fund: string;
    month: number;
  }[];
  level: RiskLevel;
  explanation: string[];
}

export interface SimulationResult {
  ledger: MonthLedger[];
  risk: RiskAnalysis;
  extraPaymentLogs: ExtraPaymentLog[];
  totalInterestSaved: number;
  fullPayoffMonth: number | null;
}
