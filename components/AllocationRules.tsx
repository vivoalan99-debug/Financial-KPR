
import React from 'react';

export const AllocationRules: React.FC = () => {
  return (
    <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl border border-slate-800">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
            <span className="bg-indigo-500 p-1.5 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </span>
            Allocation Architecture
          </h2>
          <p className="text-slate-400 mt-2 text-sm font-medium">The deterministic ruleset governing surplus distribution.</p>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-slate-800 rounded-xl border border-slate-700">
            <span className="block text-[10px] uppercase font-black text-indigo-400 tracking-widest">Logic Type</span>
            <span className="text-sm font-bold">Waterfall Priority</span>
          </div>
          <div className="px-4 py-2 bg-slate-800 rounded-xl border border-slate-700">
            <span className="block text-[10px] uppercase font-black text-emerald-400 tracking-widest">Execution</span>
            <span className="text-sm font-bold">Monthly Recurring</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Step 1: Inflow */}
        <div className="space-y-4 relative">
          <div className="absolute -top-4 -left-4 text-4xl font-black text-white/5 select-none">01</div>
          <h4 className="text-xs uppercase font-black tracking-widest text-indigo-400">Inflow Sources</h4>
          <ul className="space-y-3">
            <li className="flex gap-3 items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
              <div>
                <p className="text-sm font-bold">Monthly Salary</p>
                <p className="text-[10px] text-slate-500 italic">Core operational liquidity.</p>
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <div>
                <p className="text-sm font-bold text-amber-100">THR (March)</p>
                <p className="text-[10px] text-slate-500 italic">50% reserved for holiday cost.</p>
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <div>
                <p className="text-sm font-bold text-emerald-100">Comp. (April)</p>
                <p className="text-[10px] text-slate-500 italic">100% focused on surplus.</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Step 2: Buffer */}
        <div className="space-y-4 relative border-l border-slate-800 pl-8">
          <div className="absolute -top-4 -left-4 text-4xl font-black text-white/5 select-none">02</div>
          <h4 className="text-xs uppercase font-black tracking-widest text-indigo-400">Phase I: Buffer</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            The first destination for all monthly surplus. Aimed at immediate survival.
          </p>
          <div className="bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-xl">
            <p className="text-[10px] font-bold text-indigo-300 uppercase mb-1">Target Equation</p>
            <p className="text-xs font-mono font-bold">(3x Expenses) + (1x Mortgage)</p>
          </div>
        </div>

        {/* Step 3: Emergency */}
        <div className="space-y-4 relative border-l border-slate-800 pl-8">
          <div className="absolute -top-4 -left-4 text-4xl font-black text-white/5 select-none">03</div>
          <h4 className="text-xs uppercase font-black tracking-widest text-emerald-400">Phase II: Emergency</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Long-term protection. Funded only after the Buffer target is met 100%.
          </p>
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl">
            <p className="text-[10px] font-bold text-emerald-300 uppercase mb-1">Target Equation</p>
            <p className="text-xs font-mono font-bold">(12x Expenses) + (12x Mortgage)</p>
          </div>
        </div>

        {/* Step 4: Extra Bucket */}
        <div className="space-y-4 relative border-l border-slate-800 pl-8">
          <div className="absolute -top-4 -left-4 text-4xl font-black text-white/5 select-none">04</div>
          <h4 className="text-xs uppercase font-black tracking-widest text-rose-400">Phase III: Acceleration</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Wealth preservation through debt mitigation. Receives all "overflow" surplus.
          </p>
          <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">
            <p className="text-[10px] font-bold text-rose-300 uppercase mb-1">Injection Trigger</p>
            <p className="text-xs font-bold">Bucket &ge; 6x Mortgage Installment</p>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-slate-800 flex items-center gap-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
        <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Simulation Note: Principal injections occur annually every January for maximal compound interest reduction.
      </div>
    </div>
  );
};
