import React from 'react';
import { colors } from '../types';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  variant?: 'text' | 'circular' | 'rectangular';
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  width = '100%', 
  height = 20, 
  borderRadius = 8,
  variant = 'rectangular' 
}) => {
  return (
    <div style={{
      width,
      height: variant === 'circular' ? width : height,
      borderRadius: variant === 'circular' ? '50%' : borderRadius,
      background: `linear-gradient(90deg, ${colors.bgTertiary} 25%, ${colors.bgSecondary} 50%, ${colors.bgTertiary} 75%)`,
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
    }}>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

export const SkeletonCard: React.FC = () => (
  <div style={{
    background: colors.bgSecondary,
    borderRadius: 12,
    padding: 24,
    border: `1px solid ${colors.borderLight}`,
  }}>
    <Skeleton height={16} width="40%" />
    <div style={{ marginTop: 16 }}>
      <Skeleton height={32} width="60%" />
    </div>
    <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
      <Skeleton height={12} width="30%" />
      <Skeleton height={12} width="30%" />
      <Skeleton height={12} width="30%" />
    </div>
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div style={{
    background: colors.bgSecondary,
    borderRadius: 12,
    padding: 24,
    border: `1px solid ${colors.borderLight}`,
  }}>
    <Skeleton height={20} width="30%" />
    <div style={{ marginTop: 20 }}>
      {[...Array(rows)].map((_, i) => (
        <div key={i} style={{ 
          display: 'flex', 
          gap: 16, 
          padding: '16px 0',
          borderBottom: `1px solid ${colors.borderLight}`,
        }}>
          <Skeleton height={16} width="10%" />
          <Skeleton height={16} width="20%" />
          <Skeleton height={16} width="25%" />
          <Skeleton height={16} width="15%" />
          <Skeleton height={16} width="10%" />
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonKPIGrid: React.FC = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
    {[...Array(4)].map((_, i) => (
      <div key={i} style={{
        background: colors.bgSecondary,
        borderRadius: 12,
        padding: 24,
        border: `1px solid ${colors.borderLight}`,
      }}>
        <Skeleton height={12} width="40%" />
        <div style={{ marginTop: 16 }}>
          <Skeleton height={36} width="60%" />
        </div>
        <div style={{ marginTop: 12 }}>
          <Skeleton height={8} width="100%" />
        </div>
      </div>
    ))}
  </div>
);