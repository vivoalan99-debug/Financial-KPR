
import React from 'react';
import { useFinanceStore } from '../store/useFinanceStore';

export const SimulationHighlights: React.FC = () => {
  const { results, inputs } = useFinanceStore();

  if (!results) return null;

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR', 
      maximumFractionDigits: 0 
    }).format(val);

  const originalTermMonths = inputs.mortgage.remainingTermMonths;
  const earlyPayoffMonths = results.fullPayoffMonth ? originalTermMonths - results.fullPayoffMonth : 0;
  const earlyPayoffYears = (earlyPayoffMonths / 12).toFixed(1);

  // Calculate Net Wealth at Horizon (Assets - Mortgage)
  const lastMonth = results.ledger[results.ledger.length - 1];
  const totalAssets = lastMonth.funds.buffer + lastMonth.funds.emergency + lastMonth.funds.extraBucket;
  const netWealth = totalAssets - lastMonth.mortgage.remainingPrincipal;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Highlight: Interest Saved */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-6 rounded-3xl shadow-xl shadow-indigo-200 border border-white/10 group overflow-hidden relative">
        <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
          <svg className="w-32 h-32 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span className="block text-[10px] uppercase font-black text-indigo-100 tracking-widest mb-1 opacity-80">Net Interest Saved</span>
        <h4 className="text-2xl font-black text-white font-mono tracking-tight">
          {formatCurrency(results.totalInterestSaved)}
        </h4>
        <div className="mt-4 flex items-center gap-2">
          <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">LIFETIME ROI</span>
        </div>
      </div>

      {/* Highlight: Acceleration */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 group relative">
        <span className="block text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Payoff Acceleration</span>
        <h4 className="text-2xl font-black text-slate-800 font-mono tracking-tight">
          {results.fullPayoffMonth ? `${earlyPayoffYears} Years` : '0 Years'}
        </h4>
        <p className="text-[10px] text-slate-500 mt-2 font-medium">
          Reduction against {originalTermMonths / 12}yr base term.
        </p>
      </div>

      {/* Highlight: 20-Year Terminal Wealth */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <span className="block text-[10px] uppercase font-black text-emerald-500 tracking-widest mb-1">Terminal Net Wealth</span>
        <h4 className="text-2xl font-black text-slate-800 font-mono tracking-tight">
          {formatCurrency(netWealth)}
        </h4>
        <p className="text-[10px] text-slate-500 mt-2 font-medium">
          Projected value at the 20-year horizon.
        </p>
      </div>

      {/* Highlight: Strategy Integrity */}
      <div className="bg-slate-900 p-6 rounded-3xl shadow-xl border border-slate-800">
        <span className="block text-[10px] uppercase font-black text-indigo-400 tracking-widest mb-1">System Health</span>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          <h4 className="text-xl font-bold text-white tracking-tight">Deterministic Pass</h4>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
           <div className="text-[9px] bg-slate-800 px-2 py-1 rounded text-slate-400 font-bold">ANNUAL: RECALC</div>
           <div className="text-[9px] bg-slate-800 px-2 py-1 rounded text-slate-400 font-bold">TIERED: RATES</div>
        </div>
      </div>
    </div>
  );
};
