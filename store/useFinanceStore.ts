
import { create } from 'zustand';
import { FinancialInputs, ExpenseCategory, SimulationResult } from '../types';
import { runSimulation } from '../engine/simulator';

interface FinanceState {
  inputs: FinancialInputs;
  results: SimulationResult | null;
  
  // Actions
  updateBaseSalary: (val: number) => void;
  updateAnnualIncrease: (val: number) => void;
  updateMortgage: (mortgage: Partial<FinancialInputs['mortgage']>) => void;
  addExpense: () => void;
  removeExpense: (id: string) => void;
  updateExpense: (id: string, updates: any) => void;
  setUnemploymentMonth: (month: number | undefined) => void;
  calculate: () => void;
}

const initialExpenses = [
  { id: '1', name: 'Groceries', category: ExpenseCategory.MANDATORY, monthlyAmount: 5000000, annualIncreasePercent: 5 },
  { id: '2', name: 'Utilities', category: ExpenseCategory.MANDATORY, monthlyAmount: 1500000, annualIncreasePercent: 3 },
  { id: '3', name: 'Internet/Phone', category: ExpenseCategory.MANDATORY, monthlyAmount: 500000, annualIncreasePercent: 0 },
  { id: '4', name: 'Entertainment', category: ExpenseCategory.DISCRETIONARY, monthlyAmount: 2000000, annualIncreasePercent: 2 },
];

export const useFinanceStore = create<FinanceState>((set, get) => ({
  inputs: {
    baseSalary: 25000000,
    annualSalaryIncreasePercent: 5,
    initialBpjsBalance: 15000000,
    expenses: initialExpenses,
    mortgage: {
      initialPrincipal: 850000000,
      remainingTermMonths: 180,
      extraPaymentPenaltyPercent: 1,
    },
    unemploymentMonth: undefined,
  },
  results: null,

  updateBaseSalary: (val) => set((state) => ({ inputs: { ...state.inputs, baseSalary: val } })),
  updateAnnualIncrease: (val) => set((state) => ({ inputs: { ...state.inputs, annualSalaryIncreasePercent: val } })),
  updateMortgage: (m) => set((state) => ({ inputs: { ...state.inputs, mortgage: { ...state.inputs.mortgage, ...m } } })),
  
  addExpense: () => set((state) => ({
    inputs: {
      ...state.inputs,
      expenses: [...state.inputs.expenses, {
        id: Math.random().toString(36).substr(2, 9),
        name: 'New Expense',
        category: ExpenseCategory.MANDATORY,
        monthlyAmount: 0,
        annualIncreasePercent: 0
      }]
    }
  })),

  removeExpense: (id) => set((state) => ({
    inputs: {
      ...state.inputs,
      expenses: state.inputs.expenses.filter(e => e.id !== id)
    }
  })),

  updateExpense: (id, updates) => set((state) => ({
    inputs: {
      ...state.inputs,
      expenses: state.inputs.expenses.map(e => e.id === id ? { ...e, ...updates } : e)
    }
  })),

  setUnemploymentMonth: (month) => set((state) => ({
    inputs: { ...state.inputs, unemploymentMonth: month }
  })),

  calculate: () => {
    const { inputs } = get();
    const results = runSimulation(inputs);
    set({ results });
  }
}));
