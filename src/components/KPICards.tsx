import React, { useMemo } from 'react';
import { useCountUp, DURATION_SECONDARY, useBreakpoint } from '../hooks';
import { darkColors } from '../types';

const colors = darkColors;

const KPICARD_COLORS = {
  positive: colors.success,
  positiveBg: 'rgba(16, 185, 129, 0.15)',
  negative: colors.error,
  negativeBg: 'rgba(239, 68, 68, 0.15)',
  cardBg: colors.bgSecondary,
  labelColor: colors.textMuted,
  valueColor: colors.text,
  subtextColor: colors.textMuted,
};

interface KPICardData {
  id: string;
  label: string;
  value: number;
  unit: 'currency' | 'number' | 'percentage';
  variation: number;
  subtitle?: string;
  sparkline?: number[];
}

interface KPICardsProps {
  cards: KPICardData[];
  loading?: boolean;
  currency?: string;
  locale?: string;
}

const mockCards: KPICardData[] = [
  {
    id: 'revenue',
    label: 'RECEITA TOTAL',
    value: 284750,
    unit: 'currency',
    variation: 12.4,
  },
  {
    id: 'users',
    label: 'USUÁRIOS ATIVOS',
    value: 18392,
    unit: 'number',
    variation: 8.1,
  },
  {
    id: 'orders',
    label: 'PEDIDOS',
    value: 3847,
    unit: 'number',
    variation: 23.7,
  },
  {
    id: 'conversion',
    label: 'TAXA DE CONVERSÃO',
    value: 4.82,
    unit: 'percentage',
    variation: -0.4,
    subtitle: 'do total de usuários',
  },
];

function formatValue(value: number, unit: KPICardData['unit'], locale = 'pt-BR', currency = 'BRL'): string {
  if (unit === 'currency') {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }
  if (unit === 'percentage') {
    return `${value.toFixed(2)}%`;
  }
  return new Intl.NumberFormat(locale).format(value);
}

const VariationBadge: React.FC<{ variation: number }> = ({ variation }) => {
  const isPositive = variation >= 0;
  const color = isPositive ? KPICARD_COLORS.positive : KPICARD_COLORS.negative;
  const bg = isPositive ? KPICARD_COLORS.positiveBg : KPICARD_COLORS.negativeBg;
  const icon = isPositive ? '↑' : '↓';
  const text = `${isPositive ? '+' : ''}${variation.toFixed(1)}%`;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '4px 10px',
        borderRadius: 6,
        background: bg,
        fontSize: 12,
        fontWeight: 600,
        color,
        whiteSpace: 'nowrap',
      }}
    >
      <span>{icon}</span>
      <span>{text}</span>
    </div>
  );
};

const SkeletonCard: React.FC = () => (
  <div
    style={{
      background: KPICARD_COLORS.cardBg,
      borderRadius: 12,
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}
  >
    <div
      style={{
        width: 80,
        height: 12,
        borderRadius: 4,
        background: 'linear-gradient(90deg, #252525 25%, #353535 50%, #252525 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
      }}
    />
    <div
      style={{
        width: 120,
        height: 32,
        borderRadius: 4,
        background: 'linear-gradient(90deg, #252525 25%, #353535 50%, #252525 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
      }}
    />
    <div
      style={{
        alignSelf: 'flex-end',
        width: 60,
        height: 20,
        borderRadius: 4,
        background: 'linear-gradient(90deg, #252525 25%, #353535 50%, #252525 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
      }}
    />
  </div>
);

const KPICard: React.FC<{
  data: KPICardData;
  locale: string;
  currency: string;
}> = ({ data, locale, currency }) => {
  const animatedValue = useCountUp(data.value, DURATION_SECONDARY);
  const formattedValue = formatValue(animatedValue, data.unit, locale, currency);

  return (
    <div
      style={{
        background: KPICARD_COLORS.cardBg,
        borderRadius: 12,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 400,
            color: KPICARD_COLORS.labelColor,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {data.label}
        </span>
        <VariationBadge variation={data.variation} />
      </div>
      <div
        style={{
          fontFamily: "'Space Grotesk', 'Roboto Mono', monospace",
          fontSize: 32,
          fontWeight: 700,
          color: KPICARD_COLORS.valueColor,
          lineHeight: 1.2,
        }}
      >
        {formattedValue}
      </div>
      {data.subtitle && (
        <div
          style={{
            fontSize: 12,
            color: KPICARD_COLORS.subtextColor,
          }}
        >
          {data.subtitle}
        </div>
      )}
    </div>
  );
};

const KPICards: React.FC<KPICardsProps> = ({
  cards = mockCards,
  loading = false,
  currency = 'BRL',
  locale = 'pt-BR',
}) => {
  const breakpoint = useBreakpoint();

  const columns = useMemo(() => {
    switch (breakpoint) {
      case 'mobile':
        return '1fr';
      case 'tablet':
        return '1fr 1fr';
      default:
        return 'repeat(4, 1fr)';
    }
  }, [breakpoint]);

  return (
    <>
      <style>
        {`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}
      </style>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: columns,
          gap: 16,
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          : cards.map((card) => (
              <KPICard
                key={card.id}
                data={card}
                locale={locale}
                currency={currency}
              />
            ))}
      </div>
    </>
  );
};

export default KPICards;
export type { KPICardData, KPICardsProps };
export { mockCards };