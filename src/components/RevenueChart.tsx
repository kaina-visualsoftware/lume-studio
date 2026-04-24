import React from 'react';
import { ChartDataPoint, colors } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface RevenueChartProps {
  data: ChartDataPoint[];
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const maxRevenue = Math.max(...data.map((d) => d.revenue));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          background: colors.bgSecondary, 
          border: `1px solid ${colors.accent}`, 
          borderRadius: 10, 
          padding: '12px 16px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: colors.textMuted, marginBottom: 4 }}>{payload[0].payload.month}</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: colors.accent }}>{payload[0].value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{
      background: colors.bgSecondary,
      borderRadius: 12,
      padding: 24,
      border: `1px solid ${colors.borderLight}`,
    }}>
      <h3 style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 16,
        fontWeight: 600,
        color: colors.text,
        marginBottom: 20,
      }}>Receita dos Últimos 12 Meses</h3>
      
      <div style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: colors.textMuted, fontSize: 10 }}
              dy={5}
            />
            <YAxis 
              hide 
              domain={[0, maxRevenue * 1.1]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: colors.bgTertiary }} />
            <Bar 
              dataKey="revenue" 
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors.accent} fillOpacity={0.8 + (0.2 * (1 - index / data.length))} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};