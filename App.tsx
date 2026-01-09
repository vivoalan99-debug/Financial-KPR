
import React, { useEffect, useMemo } from 'react';
import { useFinanceStore } from './store/useFinanceStore';
import { ExpensesTable } from './components/ExpensesTable';
import { RiskSummary } from './components/RiskSummary';
import { ScenarioChart } from './components/ScenarioChart';
import { ExtraPaymentHistory } from './components/ExtraPaymentHistory';
import { AllocationRules } from './components/AllocationRules';
import { SimulationHighlights } from './components/SimulationHighlights';
import { MonthlyAuditLedger } from './components/MonthlyAuditLedger';

const App: React.FC = () => {
  const { 
    inputs, 
    updateBaseSalary, 
    updateAnnualIncrease, 
    updateMortgage,
    setUnemploymentMonth,
    calculate,
    results
  } = useFinanceStore();

  useEffect(() => {
    calculate();
  }, [calculate]);

  const handleUnemploymentToggle = (type: 'none' | 'now' | 'custom') => {
    if (type === 'none') setUnemploymentMonth(undefined);
    else if (type === 'now') setUnemploymentMonth(0);
    else setUnemploymentMonth(12);
    calculate();
  };

  return (
    <div className="min-h-screen pb-20 bg-[#f8fafc]">
      {/* Header */}
      <header className="bg-indigo-900 text-white pt-10 pb-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
              <span className="bg-white/10 p-2 rounded-2xl backdrop-blur-md">
                <svg className="w-8 h-8 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </span>
              Survival Engine v3.1
            </h1>
            <p className="text-indigo-200 mt-3 max-w-lg font-medium opacity-80">
              Deterministic monthly simulation of income waterfalls, mortgage repayment tiers, and emergency fund depletion over a 20-year horizon.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/5 border border-white/10 p-5 rounded-3xl backdrop-blur-md min-w-[140px]">
              <span className="block text-[10px] uppercase font-black text-indigo-300 tracking-[0.2em] mb-1">Epoch</span>
              <span className="text-xl font-mono font-black">JAN 2026</span>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-3xl backdrop-blur-md min-w-[140px]">
              <span className="block text-[10px] uppercase font-black text-indigo-300 tracking-[0.2em] mb-1">Horizon</span>
              <span className="text-xl font-mono font-black">20 YEARS</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 -mt-10 space-y-10">
        
        {/* Input Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 space-y-6">
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
                <div className="bg-indigo-50 p-2 rounded-xl">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                Income Matrix
              </h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Monthly Base Salary</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold">Rp</span>
                    <input 
                      type="number" 
                      value={inputs.baseSalary} 
                      onChange={(e) => { updateBaseSalary(Number(e.target.value)); calculate(); }}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-4 py-3 font-mono font-bold text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Annual Increase (%)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={inputs.annualSalaryIncreasePercent} 
                      onChange={(e) => { updateAnnualIncrease(Number(e.target.value)); calculate(); }}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 font-mono font-bold text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold">%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 space-y-6">
              <div className="flex justify-between items-center group relative">
                <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
                  <div className="bg-rose-50 p-2 rounded-xl">
                    <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                  </div>
                  Debt Core
                </h2>
                <div className="relative group/info">
                  <button className="text-slate-300 hover:text-indigo-500 transition-colors p-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <div className="invisible group-hover/info:visible opacity-0 group-hover/info:opacity-100 absolute left-full ml-6 top-0 w-80 bg-slate-900/95 backdrop-blur-md text-white p-6 rounded-[2rem] shadow-2xl border border-slate-800 transition-all duration-300 z-50 pointer-events-none">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-4 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                      Deterministic Amortization
                    </h4>
                    <div className="space-y-4 font-sans">
                      <p className="text-[11px] leading-relaxed text-slate-300 font-medium">
                        The engine enforces a strictly tiered interest schedule:
                      </p>
                      <ul className="text-[10px] grid grid-cols-2 gap-2 text-slate-400 font-mono">
                        <li className="bg-slate-800/50 p-2 rounded-xl border border-slate-700">Y1-3: <span className="text-emerald-400 font-bold">3.65%</span></li>
                        <li className="bg-slate-800/50 p-2 rounded-xl border border-slate-700">Y4-6: <span className="text-amber-400 font-bold">7.65%</span></li>
                        <li className="bg-slate-800/50 p-2 rounded-xl border border-slate-700">Y7-10: <span className="text-rose-400 font-bold">9.65%</span></li>
                        <li className="bg-slate-800/50 p-2 rounded-xl border border-slate-700">Y11+: <span className="text-rose-600 font-bold">10.65%</span></li>
                      </ul>
                      <p className="text-[11px] leading-relaxed text-slate-300">
                        <span className="text-indigo-300 font-bold">Logic:</span> Accel payments are principal-only. Installments recalc while fixing maturity to original 20yr epoch.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Initial Principal</label>
                  <input 
                    type="number" 
                    value={inputs.mortgage.initialPrincipal} 
                    onChange={(e) => { updateMortgage({ initialPrincipal: Number(e.target.value) }); calculate(); }}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 font-mono font-bold text-slate-700 focus:border-rose-500 focus:bg-white focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Remaining Term (Mo)</label>
                  <input 
                    type="number" 
                    value={inputs.mortgage.remainingTermMonths} 
                    onChange={(e) => { updateMortgage({ remainingTermMonths: Number(e.target.value) }); calculate(); }}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 font-mono font-bold text-slate-700 focus:border-rose-500 focus:bg-white focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Accel Penalty (%)</label>
                  <input 
                    type="number" 
                    value={inputs.mortgage.extraPaymentPenaltyPercent} 
                    onChange={(e) => { updateMortgage({ extraPaymentPenaltyPercent: Number(e.target.value) }); calculate(); }}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 font-mono font-bold text-slate-700 focus:border-rose-500 focus:bg-white focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <ExpensesTable />
            
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-amber-50 p-2 rounded-xl">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <h3 className="text-xl font-black text-slate-800">Survival Stress Scenarios</h3>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => handleUnemploymentToggle('none')}
                  className={`px-6 py-3 rounded-2xl text-sm font-black tracking-tight transition-all active:scale-95 ${inputs.unemploymentMonth === undefined ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                  Continuity: Stable
                </button>
                <button 
                  onClick={() => handleUnemploymentToggle('now')}
                  className={`px-6 py-3 rounded-2xl text-sm font-black tracking-tight transition-all active:scale-95 ${inputs.unemploymentMonth === 0 ? 'bg-rose-600 text-white shadow-xl shadow-rose-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                  Shock: Immediate Lost
                </button>
                <button 
                  onClick={() => handleUnemploymentToggle('custom')}
                  className={`px-6 py-3 rounded-2xl text-sm font-black tracking-tight transition-all active:scale-95 ${inputs.unemploymentMonth === 12 ? 'bg-amber-600 text-white shadow-xl shadow-amber-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                  Delayed: 12-Month Drift
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-6 font-medium leading-relaxed max-w-2xl">
                <span className="font-black text-slate-500 uppercase mr-2 tracking-widest">Protocol:</span> 
                Employment loss known T-1 month. Severance paid T+1 month. BPJS liquidation at T+2 months. Waterfall rules prioritize buffer restoration before debt acceleration.
              </p>
            </div>
          </div>
        </div>

        {/* Allocation Hierarchy */}
        <AllocationRules />

        {/* Analytics Section */}
        <div className="space-y-10">
          <SimulationHighlights />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RiskSummary />
            <ScenarioChart />
          </div>
        </div>

        {/* Acceleration History */}
        <ExtraPaymentHistory />

        {/* Full Deterministic Audit Trace */}
        <MonthlyAuditLedger />
      </main>
    </div>
  );
};

export default App;
