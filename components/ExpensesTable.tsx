
import React from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { ExpenseCategory } from '../types';

export const ExpensesTable: React.FC = () => {
  const { inputs, updateExpense, addExpense, removeExpense, calculate } = useFinanceStore();

  const handleBlur = () => {
    calculate();
  };

  const formatIDR = (val: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Monthly Expenses</h2>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-0.5">Operating Cost Audit</p>
        </div>
        <button 
          onClick={() => { addExpense(); calculate(); }}
          className="flex items-center gap-2 text-sm font-bold bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-100"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          Add Item
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black tracking-[0.2em] border-b border-slate-100">
              <th className="px-6 py-4">Expense Description</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4 text-right">Monthly Amount</th>
              <th className="px-6 py-4 text-right">Annual Inc</th>
              <th className="px-6 py-4 w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {inputs.expenses.map((exp) => (
              <tr key={exp.id} className="group hover:bg-indigo-50/30 transition-colors">
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={exp.name}
                    onChange={(e) => updateExpense(exp.id, { name: e.target.value })}
                    onBlur={handleBlur}
                    className="w-full bg-transparent border-none focus:ring-2 focus:ring-indigo-500/20 rounded-lg px-2 py-1 -mx-2 font-semibold text-slate-700"
                    placeholder="Expense name..."
                  />
                </td>
                <td className="px-6 py-4">
                  <select
                    value={exp.category}
                    onChange={(e) => updateExpense(exp.id, { category: e.target.value as ExpenseCategory })}
                    onBlur={handleBlur}
                    className="bg-transparent border-none focus:ring-2 focus:ring-indigo-500/20 rounded-lg px-2 py-1 -mx-2 text-xs font-bold uppercase tracking-tight text-slate-500 cursor-pointer"
                  >
                    <option value={ExpenseCategory.MANDATORY}>Mandatory</option>
                    <option value={ExpenseCategory.DISCRETIONARY}>Discretionary</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1 font-mono">
                    <span className="text-slate-300 font-bold text-xs">Rp</span>
                    <input
                      type="number"
                      value={exp.monthlyAmount}
                      onChange={(e) => updateExpense(exp.id, { monthlyAmount: Number(e.target.value) })}
                      onBlur={handleBlur}
                      className="w-28 bg-transparent border-none focus:ring-2 focus:ring-indigo-500/20 rounded-lg px-2 py-1 text-right font-bold text-slate-700"
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1 font-mono">
                    <input
                      type="number"
                      value={exp.annualIncreasePercent}
                      onChange={(e) => updateExpense(exp.id, { annualIncreasePercent: Number(e.target.value) })}
                      onBlur={handleBlur}
                      className="w-16 bg-transparent border-none focus:ring-2 focus:ring-indigo-500/20 rounded-lg px-2 py-1 text-right font-bold text-slate-700"
                    />
                    <span className="text-slate-300 font-bold text-xs">%</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => { removeExpense(exp.id); calculate(); }}
                    className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 transition-all p-1"
                    title="Remove expense"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-6 bg-slate-50/50 flex justify-between items-center border-t border-slate-100">
        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Committed Monthly</span>
        <div className="text-xl font-black text-indigo-600 font-mono tracking-tight">
          {formatIDR(inputs.expenses.reduce((acc, e) => acc + e.monthlyAmount, 0))}
        </div>
      </div>
    </div>
  );
};
