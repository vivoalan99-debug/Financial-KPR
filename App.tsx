
import React, { useEffect, useState, useMemo } from 'react';
import { useFinanceStore } from './store/useFinanceStore';
import { ExpensesTable } from './components/ExpensesTable';
import { RiskSummary } from './components/RiskSummary';
import { ScenarioChart } from './components/ScenarioChart';
import { ExtraPaymentHistory } from './components/ExtraPaymentHistory';
import { AllocationRules } from './components/AllocationRules';

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

  const [ledgerYearPage, setLedgerYearPage] = useState(0);

  useEffect(() => {
    calculate();
  }, [calculate]);

  const handleUnemploymentToggle = (type: 'none' | 'now' | 'custom') => {
    if (type === 'none') setUnemploymentMonth(undefined);
    else if (type === 'now') setUnemploymentMonth(0);
    else setUnemploymentMonth(12);
    calculate();
  };

  const paginatedLedger = useMemo(() => {
    if (!results) return [];
    return results.ledger.slice(ledgerYearPage * 12, (ledgerYearPage + 1) * 12);
  }, [results, ledgerYearPage]);

  const totalYears = results ? Math.ceil(results.ledger.length / 12) : 0;

  const formatNum = (val: number) => val.toLocaleString('id-ID');

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-indigo-900 text-white pt-8 pb-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Financial Survival Engine</h1>
            <p className="text-indigo-200 mt-2 max-w-lg">
              Deterministic monthly simulation of income, mortgage repayment tiers, and emergency runway depletion.
            </p>
          </div>
          <div className="flex gap-2">
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
              <span className="block text-xs uppercase font-bold text-indigo-300">Start Date</span>
              <span className="text-lg font-mono">January 2026</span>
            </div>
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
              <span className="block text-xs uppercase font-bold text-indigo-300">Granularity</span>
              <span className="text-lg font-mono">Monthly</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 -mt-8 space-y-8">
        
        {/* Core Inputs Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Income Details
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Monthly Base Salary</label>
                  <input 
                    type="number" 
                    value={inputs.baseSalary} 
                    onChange={(e) => { updateBaseSalary(Number(e.target.value)); calculate(); }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Annual Increase (%)</label>
                  <input 
                    type="number" 
                    value={inputs.annualSalaryIncreasePercent} 
                    onChange={(e) => { updateAnnualIncrease(Number(e.target.value)); calculate(); }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="flex justify-between items-center group relative">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                  Mortgage
                </h2>
                <div className="relative group/info">
                  <button className="text-slate-300 hover:text-indigo-500 transition-colors p-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  {/* Tooltip Content */}
                  <div className="invisible group-hover/info:visible opacity-0 group-hover/info:opacity-100 absolute left-full ml-4 top-0 w-80 bg-slate-900/95 backdrop-blur-md text-white p-5 rounded-2xl shadow-2xl border border-slate-800 transition-all duration-200 z-50 pointer-events-none">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400 mb-3 underline decoration-indigo-500/50 underline-offset-4">Deterministic Recalc Engine</h4>
                    <div className="space-y-3 font-sans">
                      <p className="text-[11px] leading-relaxed text-slate-300">
                        The engine applies a multi-tier interest schedule:
                      </p>
                      <ul className="text-[10px] grid grid-cols-2 gap-2 text-slate-400 font-mono">
                        <li className="bg-slate-800/50 p-1.5 rounded-lg border border-slate-700">Y1-3: <span className="text-emerald-400 font-bold">3.65%</span></li>
                        <li className="bg-slate-800/50 p-1.5 rounded-lg border border-slate-700">Y4-6: <span className="text-amber-400 font-bold">7.65%</span></li>
                        <li className="bg-slate-800/50 p-1.5 rounded-lg border border-slate-700">Y7-10: <span className="text-rose-400 font-bold">9.65%</span></li>
                        <li className="bg-slate-800/50 p-1.5 rounded-lg border border-slate-700">Y11+: <span className="text-rose-600 font-bold">10.65%</span></li>
                      </ul>
                      <p className="text-[11px] leading-relaxed text-slate-300">
                        <span className="text-indigo-300 font-bold">Logic:</span> Extra payments reduce principal immediately. Installments are recalculated to keep the <span className="italic">original payoff month</span> fixed, effectively lowering your monthly operating cost.
                      </p>
                    </div>
                    <div className="absolute top-4 -left-2 w-4 h-4 bg-slate-900 border-l border-b border-slate-800 transform rotate-45" />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Principal Amount</label>
                  <input 
                    type="number" 
                    value={inputs.mortgage.initialPrincipal} 
                    onChange={(e) => { updateMortgage({ initialPrincipal: Number(e.target.value) }); calculate(); }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Remaining Term (Months)</label>
                  <input 
                    type="number" 
                    value={inputs.mortgage.remainingTermMonths} 
                    onChange={(e) => { updateMortgage({ remainingTermMonths: Number(e.target.value) }); calculate(); }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Extra Payment Penalty (%)</label>
                  <input 
                    type="number" 
                    value={inputs.mortgage.extraPaymentPenaltyPercent} 
                    onChange={(e) => { updateMortgage({ extraPaymentPenaltyPercent: Number(e.target.value) }); calculate(); }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <ExpensesTable />
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Survival Scenarios</h3>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => handleUnemploymentToggle('none')}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${inputs.unemploymentMonth === undefined ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  Full Employment
                </button>
                <button 
                  onClick={() => handleUnemploymentToggle('now')}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${inputs.unemploymentMonth === 0 ? 'bg-rose-600 text-white shadow-lg shadow-rose-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  Unemployed Immediately
                </button>
                <button 
                  onClick={() => handleUnemploymentToggle('custom')}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${inputs.unemploymentMonth === 12 ? 'bg-amber-600 text-white shadow-lg shadow-amber-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  Unemployed After 1 Year
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                Rules: Employment loss known 1 month in advance. Final salary paid last month. 
                Compensation paid following month. BPJS claimable 1 month after unemployment.
              </p>
            </div>
          </div>
        </div>

        {/* Allocation Rules Section */}
        <AllocationRules />

        {/* Dashboard Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RiskSummary />
          <ScenarioChart />
        </div>

        {/* Extra Payment Section */}
        <ExtraPaymentHistory />

        {/* Audit Log / Ledger Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-slate-50/30">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Deterministic Output Ledger (Audit)</h3>
              <p className="text-sm text-slate-500 font-medium">A granular month-by-month trace of all simulation variables.</p>
            </div>
            
            {/* Pagination Controls */}
            <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
              <button 
                disabled={ledgerYearPage <= 0}
                onClick={() => setLedgerYearPage(p => p - 1)}
                className="p-2 rounded-xl hover:bg-slate-100 disabled:opacity-20 disabled:hover:bg-transparent transition-all"
              >
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
              </button>
              
              <div className="relative px-4">
                <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Year</span>
                <select 
                  value={ledgerYearPage}
                  onChange={(e) => setLedgerYearPage(Number(e.target.value))}
                  className="block w-full bg-transparent text-lg font-black text-slate-800 focus:outline-none cursor-pointer appearance-none pr-4"
                >
                  {Array.from({ length: totalYears }).map((_, i) => (
                    <option key={i} value={i}>{i + 1}</option>
                  ))}
                </select>
              </div>

              <button 
                disabled={ledgerYearPage >= totalYears - 1}
                onClick={() => setLedgerYearPage(p => p + 1)}
                className="p-2 rounded-xl hover:bg-slate-100 disabled:opacity-20 disabled:hover:bg-transparent transition-all"
              >
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto font-mono text-[10px] 2xl:text-xs">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-900 text-slate-400 uppercase font-black tracking-widest">
                <tr>
                  <th className="p-4 border-b border-slate-800">Month</th>
                  <th className="p-4 border-b border-slate-800 text-white">Salary</th>
                  <th className="p-4 border-b border-slate-800 text-white">THR/Comp</th>
                  <th className="p-4 border-b border-slate-800 text-white">Claim</th>
                  <th className="p-4 border-b border-slate-800 text-white">Total Inc</th>
                  <th className="p-4 border-b border-slate-800">Expense</th>
                  <th className="p-4 border-b border-slate-800">Buffer</th>
                  <th className="p-4 border-b border-slate-800">Emergency</th>
                  <th className="p-4 border-b border-slate-800">Principal</th>
                  <th className="p-4 border-b border-slate-800 text-rose-400">Extra</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedLedger.map((m) => (
                  <tr key={m.monthIndex} className={`${m.isEmployed ? 'hover:bg-slate-50' : 'bg-rose-50/50 hover:bg-rose-50'} transition-colors group`}>
                    <td className="p-4 whitespace-nowrap font-bold text-slate-900 border-r border-slate-50">{m.date}</td>
                    
                    {/* Detailed Income breakdown */}
                    <td className="p-4 whitespace-nowrap text-slate-600 border-r border-slate-50">
                      {m.income.salary > 0 ? formatNum(m.income.salary) : '-'}
                    </td>
                    <td className="p-4 whitespace-nowrap text-indigo-600 font-bold border-r border-slate-50">
                      {(m.income.thr + m.income.compensation) > 0 ? `+${formatNum(m.income.thr + m.income.compensation)}` : '-'}
                    </td>
                    <td className="p-4 whitespace-nowrap text-amber-600 font-bold border-r border-slate-50">
                      {m.income.bpjsClaim > 0 ? `+${formatNum(m.income.bpjsClaim)}` : '-'}
                    </td>
                    <td className="p-4 whitespace-nowrap font-black text-slate-900 bg-slate-50/50 border-r border-slate-50 group-hover:bg-indigo-50/50 transition-colors">
                      {formatNum(m.income.total)}
                    </td>

                    <td className="p-4 whitespace-nowrap text-rose-500 font-medium">{formatNum(m.expenses.grandTotal)}</td>
                    <td className="p-4 whitespace-nowrap font-bold text-indigo-600">{formatNum(m.funds.buffer)}</td>
                    <td className="p-4 whitespace-nowrap font-bold text-emerald-600">{formatNum(m.funds.emergency)}</td>
                    <td className="p-4 whitespace-nowrap text-slate-600">{formatNum(m.mortgage.remainingPrincipal)}</td>
                    <td className="p-4 whitespace-nowrap">
                      {m.mortgage.extraPaymentApplied > 0 ? (
                        <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded font-black text-[9px] 2xl:text-xs">
                          -{formatNum(m.mortgage.extraPaymentApplied)}
                        </span>
                      ) : '-'}
                    </td>
                  </tr>
                ))}
                {paginatedLedger.length === 0 && (
                  <tr>
                    <td colSpan={10} className="p-12 text-center text-slate-400 italic font-sans">
                      No simulation data available for this temporal window.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="bg-slate-900/5 px-8 py-4 border-t border-slate-100 text-[10px] font-bold text-slate-400 flex justify-between uppercase tracking-[0.2em]">
            <span>Audit Year {ledgerYearPage + 1} of {totalYears}</span>
            <span className="text-slate-500">System Integrity: Verified</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
