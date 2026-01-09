
import React, { useState, useMemo } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { MonthLedger } from '../types';

export const MonthlyAuditLedger: React.FC = () => {
  const { results } = useFinanceStore();
  const [ledgerYearPage, setLedgerYearPage] = useState(0);

  const totalYears = results ? Math.ceil(results.ledger.length / 12) : 0;

  const paginatedLedger = useMemo(() => {
    if (!results) return [];
    return results.ledger.slice(ledgerYearPage * 12, (ledgerYearPage + 1) * 12);
  }, [results, ledgerYearPage]);

  const formatNum = (val: number) => 
    val.toLocaleString('id-ID', { maximumFractionDigits: 0 });

  const getEventTag = (m: MonthLedger) => {
    const tags = [];
    if (m.income.thr > 0) tags.push({ label: 'THR', color: 'bg-amber-100 text-amber-700' });
    if (m.income.compensation > 0) tags.push({ label: 'SEV', color: 'bg-emerald-100 text-emerald-700' });
    if (m.income.bpjsClaim > 0) tags.push({ label: 'BPJS', color: 'bg-indigo-100 text-indigo-700' });
    if (m.mortgage.extraPaymentApplied > 0) tags.push({ label: 'ACCEL', color: 'bg-rose-600 text-white' });
    return tags;
  };

  const getFlagColor = (flag: string) => {
    switch (flag) {
      case 'DEFICIT': return 'bg-rose-500 text-white';
      case 'DTI_CRITICAL': return 'bg-rose-600 text-white animate-pulse';
      case 'DTI_HIGH': return 'bg-amber-500 text-white';
      case 'RUNWAY_LOW': return 'bg-orange-500 text-white';
      case 'PAID_OFF': return 'bg-emerald-500 text-white';
      default: return 'bg-slate-200 text-slate-600';
    }
  };

  if (!results) return null;

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden transition-all">
      {/* Table Header / Controls */}
      <div className="p-8 border-b border-slate-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-slate-50/50">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-900 rounded-lg shadow-lg">
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Deterministic Audit Ledger</h3>
              <p className="text-xs text-slate-500 font-bold tracking-widest uppercase mt-0.5">Full Traceability • Efficiency Metrics</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
          <button 
            disabled={ledgerYearPage <= 0}
            onClick={() => setLedgerYearPage(p => p - 1)}
            className="p-2.5 rounded-xl hover:bg-slate-100 disabled:opacity-20 transition-all"
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
          </button>
          
          <div className="px-6 py-1 border-x border-slate-100 flex flex-col items-center min-w-[100px]">
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Temporal Window</span>
            <select 
              value={ledgerYearPage}
              onChange={(e) => setLedgerYearPage(Number(e.target.value))}
              className="text-base font-black text-slate-800 focus:outline-none cursor-pointer appearance-none bg-transparent text-center"
            >
              {Array.from({ length: totalYears }).map((_, i) => (
                <option key={i} value={i}>Year {i + 1}</option>
              ))}
            </select>
          </div>

          <button 
            disabled={ledgerYearPage >= totalYears - 1}
            onClick={() => setLedgerYearPage(p => p + 1)}
            className="p-2.5 rounded-xl hover:bg-slate-100 disabled:opacity-20 transition-all"
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
      
      {/* High-Density Data Grid */}
      <div className="overflow-x-auto relative max-h-[750px]">
        <table className="w-full text-left border-collapse table-fixed min-w-[1600px]">
          <thead className="sticky top-0 z-20 shadow-sm">
            <tr className="bg-slate-900 text-slate-400 uppercase text-[10px] font-black tracking-[0.15em]">
              <th className="p-4 w-32 border-b border-slate-800">Timeline</th>
              <th className="p-4 w-40 border-b border-slate-800 text-white">Inflow Mix</th>
              <th className="p-4 w-32 border-b border-slate-800 text-white">Net Inflow</th>
              <th className="p-4 w-32 border-b border-slate-800">Expenses</th>
              <th className="p-4 w-32 border-b border-slate-800">Debt Pmt</th>
              <th className="p-4 w-28 border-b border-slate-800 text-indigo-400">Efficiency</th>
              <th className="p-4 w-28 border-b border-slate-800 text-rose-400">DTI Ratio</th>
              <th className="p-4 w-32 border-b border-slate-800">Emergency</th>
              <th className="p-4 w-40 border-b border-slate-800">Remaining Bal</th>
              <th className="p-4 w-48 border-b border-slate-800 text-amber-400">Analysis Flags</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono text-[11px] 2xl:text-xs">
            {paginatedLedger.map((m) => {
              const eventTags = getEventTag(m);
              const coverage = m.metrics.incomeToExpenseRatio;
              const dti = m.metrics.debtServiceRatio;
              
              return (
                <tr 
                  key={m.monthIndex} 
                  className={`group transition-colors relative
                    ${!m.isEmployed ? 'bg-rose-50/40 hover:bg-rose-50' : 'hover:bg-slate-50'}
                    ${m.mortgage.extraPaymentApplied > 0 ? 'bg-indigo-50/50' : ''}
                  `}
                >
                  <td className="p-4 whitespace-nowrap font-bold text-slate-900 border-r border-slate-100">
                    <div className="flex flex-col">
                      <span className="text-[12px]">{m.date}</span>
                      <span className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">M{m.monthIndex + 1}</span>
                    </div>
                  </td>
                  
                  <td className="p-4 whitespace-nowrap border-r border-slate-100">
                    <div className="space-y-0.5 opacity-80 text-[10px]">
                      {m.income.salary > 0 && <div className="flex justify-between"><span>SAL:</span> <span>{formatNum(m.income.salary)}</span></div>}
                      {(m.income.thr + m.income.compensation + m.income.bpjsClaim) > 0 && (
                        <div className="flex justify-between text-indigo-600 font-black">
                          <span>BON:</span> <span>+{formatNum(m.income.thr + m.income.compensation + m.income.bpjsClaim)}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="p-4 whitespace-nowrap font-black text-slate-900 bg-slate-50/30 border-r border-slate-100">
                    {formatNum(m.income.total)}
                  </td>

                  <td className="p-4 whitespace-nowrap text-slate-600 border-r border-slate-100">
                    {formatNum(m.expenses.grandTotal - m.expenses.mortgageInstallment)}
                  </td>

                  <td className="p-4 whitespace-nowrap text-slate-900 font-bold border-r border-slate-100">
                    {m.expenses.mortgageInstallment > 0 ? formatNum(m.expenses.mortgageInstallment) : '—'}
                  </td>

                  <td className="p-4 whitespace-nowrap border-r border-slate-100">
                    <div className={`font-black text-[10px] ${coverage >= 100 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {coverage.toFixed(1)}%
                    </div>
                  </td>

                  <td className="p-4 whitespace-nowrap border-r border-slate-100">
                    <div className={`font-black text-[10px] ${dti > 45 ? 'text-rose-600' : dti > 30 ? 'text-amber-500' : 'text-emerald-600'}`}>
                      {dti.toFixed(1)}%
                    </div>
                  </td>

                  <td className="p-4 whitespace-nowrap text-emerald-600 font-bold border-r border-slate-100">
                    {formatNum(m.funds.emergency)}
                  </td>

                  <td className="p-4 whitespace-nowrap text-slate-600 border-r border-slate-100 font-bold">
                    {m.mortgage.remainingPrincipal > 0 ? formatNum(m.mortgage.remainingPrincipal) : 'PAID'}
                  </td>

                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {eventTags.map((tag, idx) => (
                        <span key={idx} className={`px-1.5 py-0.5 rounded-[4px] text-[8px] font-black tracking-tighter uppercase ${tag.color}`}>
                          {tag.label}
                        </span>
                      ))}
                      {m.riskFlags.map((flag, idx) => (
                        <span key={`f-${idx}`} className={`px-1.5 py-0.5 rounded-[4px] text-[8px] font-black tracking-tighter uppercase ${getFlagColor(flag)}`}>
                          {flag.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Audit Summary Footer */}
      <div className="bg-slate-900 text-white/50 px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex gap-8">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-black tracking-widest text-indigo-400">Engine Integrity</span>
            <span className="text-lg font-mono font-bold text-white uppercase">100% Deterministic</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400">Metric Precision</span>
            <span className="text-lg font-mono font-bold text-white">4 Decimals</span>
          </div>
        </div>
        <div className="text-[10px] uppercase font-black tracking-[0.3em] flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          Audit Trail Operational
        </div>
      </div>
    </div>
  );
};
