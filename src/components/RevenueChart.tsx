import React from 'react';
import { ChartDataPoint, colors } from '../types';

interface RevenueChartProps {
  data: ChartDataPoint[];
}

const styles = {
  chartContainer: {
    background: colors.bgSecondary,
    borderRadius: 12,
    padding: 24,
    border: `1px solid ${colors.borderLight}`,
  },
  chartTitle: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 16,
    fontWeight: 600,
    color: colors.text,
    marginBottom: 20,
  },
};

export const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const maxRevenue = Math.max(...data.map((d) => d.revenue));

  return (
    <div style={styles.chartContainer}>
      <h3 style={styles.chartTitle}>Receita dos Últimos 12 Meses</h3>
      <div
        style={{
          height: 220,
          display: 'flex',
          alignItems: 'flex-end',
          gap: 6,
          padding: '0 4px',
        }}
      >
        {data.map((d, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column' as const,
              alignItems: 'center',
              gap: 8,
            }}
          >
            <div
              style={{
                height: (d.revenue / maxRevenue) * 180,
                width: '100%',
                background: `linear-gradient(to top, ${colors.accentHover}, ${colors.accent})`,
                borderRadius: '4px 4px 0 0',
                minHeight: 4,
              }}
            />
            <span style={{ fontSize: 10, color: colors.textMuted }}>{d.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
};