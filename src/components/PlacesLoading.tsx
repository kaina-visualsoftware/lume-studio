import React from 'react';
import { colors } from '../types';

export const PlacesLoading: React.FC<{ rows?: number }> = ({ rows = 3 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    {[...Array(rows)].map((_, i) => (
      <div key={i} style={{
        display: 'flex',
        gap: 16,
        padding: 20,
        background: colors.bgSecondary,
        borderRadius: 12,
        border: `1px solid ${colors.borderLight}`,
        animation: 'pulse 2s ease-in-out infinite',
        animationDelay: `${i * 0.2}s`,
      }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 8,
          background: `linear-gradient(90deg, ${colors.bgTertiary} 25%, ${colors.bgSecondary} 50%, ${colors.bgTertiary} 75%)`,
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
        }} />
        <div style={{ flex: 1 }}>
          <div style={{
            width: '60%',
            height: 14,
            borderRadius: 4,
            background: `linear-gradient(90deg, ${colors.bgTertiary} 25%, ${colors.bgSecondary} 50%, ${colors.bgTertiary} 75%)`,
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            marginBottom: 8,
          }} />
          <div style={{
            width: '40%',
            height: 10,
            borderRadius: 4,
            background: `linear-gradient(90deg, ${colors.bgTertiary} 25%, ${colors.bgSecondary} 50%, ${colors.bgTertiary} 75%)`,
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
          }} />
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          alignItems: 'flex-end',
        }}>
          <div style={{
            width: 60,
            height: 10,
            borderRadius: 4,
            background: `linear-gradient(90deg, ${colors.bgTertiary} 25%, ${colors.bgSecondary} 50%, ${colors.bgTertiary} 75%)`,
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
          }} />
          <div style={{
            width: 40,
            height: 8,
            borderRadius: 4,
            background: `linear-gradient(90deg, ${colors.bgTertiary} 25%, ${colors.bgSecondary} 50%, ${colors.bgTertiary} 75%)`,
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
          }} />
        </div>
      </div>
    ))}
    <style>{`
      @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }
    `}</style>
  </div>
);

export const CardLoading: React.FC = () => (
  <div style={{
    background: colors.bgSecondary,
    borderRadius: 12,
    padding: 24,
    border: `1px solid ${colors.borderLight}`,
    animation: 'pulse 2s ease-in-out infinite',
  }}>
    <div style={{
      width: '50%',
      height: 16,
      borderRadius: 4,
      background: `linear-gradient(90deg, ${colors.bgTertiary} 25%, ${colors.bgSecondary} 50%, ${colors.bgTertiary} 75%)`,
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
      marginBottom: 16,
    }} />
    <div style={{
      width: '70%',
      height: 32,
      borderRadius: 4,
      background: `linear-gradient(90deg, ${colors.bgTertiary} 25%, ${colors.bgSecondary} 50%, ${colors.bgTertiary} 75%)`,
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
      marginBottom: 12,
    }} />
    <div style={{
      width: '100%',
      height: 6,
      borderRadius: 3,
      background: `linear-gradient(90deg, ${colors.bgTertiary} 25%, ${colors.bgSecondary} 50%, ${colors.bgTertiary} 75%)`,
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
    }} />
    <style>{`
      @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }
    `}</style>
  </div>
);