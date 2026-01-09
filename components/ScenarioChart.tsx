
import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useFinanceStore } from '../store/useFinanceStore';

export const ScenarioChart: React.FC = () => {
  const { results } = useFinanceStore();

  if (!results) return null;

  // Filter ledger to show every 6 months to avoid overcrowding the UI chart
  const data = results.ledger.filter((_, i) => i % 6 === 0).map(m => ({
    name: m.date,
    buffer: m.funds.buffer,
    emergency: m.funds.emergency,
    mortgage: m.mortgage.remainingPrincipal,
  }));

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 mb-6">Financial Assets vs Mortgage Liabilities</h3>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorBuffer" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorEmergency" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorMortgage" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 10 }} 
              stroke="#94a3b8" 
              axisLine={false} 
              tickLine={false}
            />
            <YAxis 
              tickFormatter={(val) => `${(val / 1000000).toFixed(0)}M`}
              tick={{ fontSize: 10 }}
              stroke="#94a3b8"
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              formatter={(val: number) => [`${val.toLocaleString()} IDR`, '']}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Legend verticalAlign="top" align="right" height={36} iconType="circle" />
            <Area 
              type="monotone" 
              dataKey="buffer" 
              stackId="1" 
              stroke="#6366f1" 
              fillOpacity={1} 
              fill="url(#colorBuffer)" 
              name="Buffer Fund"
            />
            <Area 
              type="monotone" 
              dataKey="emergency" 
              stackId="1" 
              stroke="#10b981" 
              fillOpacity={1} 
              fill="url(#colorEmergency)" 
              name="Emergency Fund"
            />
            <Area 
              type="monotone" 
              dataKey="mortgage" 
              stroke="#f43f5e" 
              fillOpacity={1} 
              fill="url(#colorMortgage)" 
              name="Mortgage Balance"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
