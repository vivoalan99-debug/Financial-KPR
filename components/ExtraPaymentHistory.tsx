
import React from 'react';
import { useFinanceStore } from '../store/useFinanceStore';

export const ExtraPaymentHistory: React.FC = () => {
  const { results } = useFinanceStore();

  if (!results || results.extraPaymentLogs.length === 0) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-center space-y-4">
        <div className="bg-slate-50 p-5 rounded-full text-slate-300">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-xl tracking-tight">No Extra Payments Recorded</h3>
          <p className="text-slate-500 max-w-sm mx-auto mt-2 text-sm leading-relaxed">
            Automatic principal injections are triggered every January when your liquidity surplus exceeds 6x the monthly installment.
          </p>
        </div>
      </div>
    );
  }

  // Thresholds for professional visual tagging
  const HIGH_SAVINGS_TIER = 75000000; // 75M IDR
  const MID_SAVINGS_TIER = 25000000; // 25M IDR

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR', 
      maximumFractionDigits: 0 
    }).format(val);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-lg">
      <div className="p-8 border-b border-slate-100 bg-slate-50/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-100">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Debt Mitigation Audit</h3>
              <p className="text-sm text-slate-500 font-medium">Annual principal injections and their deterministic impact.</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex flex-col items-end border-r border-slate-200 pr-4 mr-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Total Events</span>
            <span className="text-lg font-black text-slate-800 font-mono">{results.extraPaymentLogs.length}</span>
          </div>
          <div className="bg-indigo-600 px-6 py-3 rounded-2xl shadow-xl shadow-indigo-100 flex flex-col items-end border border-indigo-500/20">
            <span className="text-[10px] uppercase font-black tracking-[0.2em] text-indigo-100 opacity-90">Net Interest Saved</span>
            <span className="text-2xl font-mono font-black text-white">
              {formatCurrency(results.totalInterestSaved)}
            </span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black tracking-[0.2em] border-b border-slate-100">
              <th className="px-8 py-4">Injection Date</th>
              <th className="px-6 py-4">Gross Payment</th>
              <th className="px-6 py-4">Admin Fee</th>
              <th className="px-6 py-4">Net Principal Δ</th>
              <th className="px-6 py-4">Old Installment</th>
              <th className="px-6 py-4">New Installment</th>
              <th className="px-8 py-4 text-right">Interest Offset</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono text-sm">
            {results.extraPaymentLogs.map((log, i) => {
              const savingsTier = log.totalInterestSaved >= HIGH_SAVINGS_TIER ? 'high' : log.totalInterestSaved >= MID_SAVINGS_TIER ? 'mid' : 'low';
              
              return (
                <tr 
                  key={i} 
                  className="group relative transition-all duration-150 hover:bg-slate-50 cursor-default"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3 font-sans relative">
                      {/* Interactive hover bar */}
                      <div className="absolute -left-8 w-1 h-0 group-hover:h-full bg-indigo-600 transition-all duration-300" />
                      <div className={`w-2 h-2 rounded-full ${savingsTier === 'high' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : savingsTier === 'mid' ? 'bg-amber-400' : 'bg-slate-300'}`} />
                      <span className="font-bold text-slate-900">{log.date}</span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-5 text-slate-600 font-medium whitespace-nowrap">
                    {formatCurrency(log.amountPaid)}
                  </td>
                  
                  <td className="px-6 py-5">
                    <span className="text-rose-400 font-bold">
                      {log.penaltyAmount > 0 ? `-${formatCurrency(log.penaltyAmount)}` : '—'}
                    </span>
                  </td>
                  
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-emerald-600">
                        {formatCurrency(log.principalReduced)}
                      </span>
                      {log.principalReduced > 100000000 && (
                        <span className="text-[8px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">Impact</span>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-5 text-slate-400 font-light">
                    {formatCurrency(log.installmentBefore)}
                  </td>

                  <td className="px-6 py-5">
                    <span className="text-indigo-600 font-black">
                      {formatCurrency(log.installmentAfter)}
                    </span>
                  </td>
                  
                  <td className="px-8 py-5 text-right">
                    <div className="flex flex-col items-end gap-1">
                      <div className={`px-4 py-1.5 rounded-xl font-black transition-all group-hover:translate-x-[-4px] flex items-center gap-2 
                        ${savingsTier === 'high' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 
                          savingsTier === 'mid' ? 'bg-amber-100 text-amber-700' : 
                          'bg-slate-100 text-slate-500'}`}
                      >
                        {savingsTier === 'high' && (
                          <svg className="w-3.5 h-3.5 text-amber-300 fill-current animate-pulse" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        )}
                        <span className="text-xs">+{formatCurrency(log.totalInterestSaved)}</span>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="p-6 bg-slate-50/50 text-[10px] text-slate-400 flex flex-col sm:flex-row items-center gap-4 sm:gap-8 border-t border-slate-100">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-bold uppercase tracking-wider">Tier I Offset (75M+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="font-bold uppercase tracking-wider">Tier II Offset (25M+)</span>
          </div>
        </div>
        <div className="hidden sm:block w-px h-3 bg-slate-200" />
        <p className="italic leading-relaxed">
          Deterministically projected using dual-pass amortization. Installment recalculation preserves original 20-year maturity timeline.
        </p>
      </div>
    </div>
  );
};
