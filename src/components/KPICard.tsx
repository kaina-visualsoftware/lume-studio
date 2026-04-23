import React from 'react';
import { KPICard } from '../types';
import { useCountUp } from '../hooks';
import { IconArrowUp, IconArrowDown } from './Icons';
import { colors } from '../types';

interface KPICardProps {
  kpi: KPICard;
  index: number;
}

const styles = {
  kpiCard: {
    background: colors.bgSecondary,
    borderRadius: 12,
    padding: 20,
    border: `1px solid ${colors.borderLight}`,
  },
  kpiHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  kpiLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: colors.textMuted,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  kpiTrend: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    padding: '4px 8px',
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 600,
  },
  kpiTrendText: {
    fontSize: 11,
    fontWeight: 600,
  },
  kpiValue: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 28,
    fontWeight: 700,
    color: colors.text,
    marginBottom: 4,
  },
  kpiSubValue: {
    fontSize: 12,
    color: colors.textMuted,
  },
};

export const KPICardComponent: React.FC<KPICardProps> = ({ kpi, index }) => {
  const animatedValue = useCountUp(kpi.value, 1500 + index * 200);
  const percentageChange = ((kpi.value - kpi.previousValue) / kpi.previousValue * 100).toFixed(1);
  const isPositive = kpi.trend === 'up';

  const formatValue = (value: number): string => {
    if (kpi.unit === 'currency') {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    }
    if (kpi.unit === 'percentage') {
      return `${value.toFixed(2)}%`;
    }
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const trendColor = isPositive ? colors.success : colors.error;

  return (
    <div style={styles.kpiCard}>
      <div style={styles.kpiHeader}>
        <span style={styles.kpiLabel}>{kpi.label}</span>
        <div
          style={{
            ...styles.kpiTrend,
            color: trendColor,
            background: isPositive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          }}
        >
          {kpi.trend === 'up' ? (
            <IconArrowUp size={12} color={trendColor} />
          ) : (
            <IconArrowDown size={12} color={trendColor} />
          )}
          <span style={{ ...styles.kpiTrendText, color: trendColor }}>
            {Math.abs(parseFloat(percentageChange))}%
          </span>
        </div>
      </div>
      <div style={styles.kpiValue}>{formatValue(animatedValue)}</div>
      {kpi.unit === 'percentage' && (
        <div style={styles.kpiSubValue}>do total de usuários</div>
      )}
    </div>
  );
};