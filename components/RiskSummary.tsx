
import React from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { RiskLevel } from '../types';

export const RiskSummary: React.FC = () => {
  const { results, inputs } = useFinanceStore();

  if (!results) return null;

  const { risk } = results;

  const colorMap = {
    [RiskLevel.LOW]: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    [RiskLevel.MEDIUM]: 'bg-amber-50 text-amber-700 border-amber-200',
    [RiskLevel.HIGH]: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  const iconMap = {
    [RiskLevel.LOW]: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    [RiskLevel.MEDIUM]: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    [RiskLevel.HIGH]: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <div className="space-y-6">
      <div className={`p-6 rounded-2xl border ${colorMap[risk.level]} flex items-start gap-4`}>
        <div className="mt-1">{iconMap[risk.level]}</div>
        <div>
          <h3 className="text-xl font-bold mb-1">Risk Level: {risk.level}</h3>
          <ul className="list-disc list-inside space-y-1 opacity-90">
            {risk.explanation.map((exp, i) => (
              <li key={i} className="text-sm">{exp}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-medium mb-1">Liquidity Runway</p>
          <h4 className="text-2xl font-bold text-slate-800">
            {inputs.unemploymentMonth === undefined ? 'N/A' : `${risk.liquidityRunwayMonths} Months`}
          </h4>
          <p className="text-xs text-slate-400 mt-2">Survival time under current unemployment scenario.</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-medium mb-1">Mortgage Stress Month</p>
          <h4 className="text-2xl font-bold text-slate-800">
            {risk.mortgageStressMonth === null ? 'No Risk' : `Month ${risk.mortgageStressMonth}`}
          </h4>
          <p className="text-xs text-slate-400 mt-2">First month where mortgage payment fails default scenario.</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-medium mb-1">Full Payoff Month</p>
          <h4 className="text-2xl font-bold text-slate-800">
            {results.fullPayoffMonth ? `Month ${results.fullPayoffMonth}` : 'Never'}
          </h4>
          <p className="text-xs text-slate-400 mt-2">The month mortgage principal hits zero.</p>
        </div>
      </div>
    </div>
  );
};
