import React, { useState, useEffect } from 'react';
import { useTheme } from './Theme';
import { Tooltip } from './Tooltip';
import { CardLoading } from './PlacesLoading';
import { darkColors, lightColors } from '../types';

interface AnalyticsPageProps {
  dateRange: 'today' | '7d' | '30d' | 'custom';
}

const mockStats = [
  { label: 'Visualizações', value: '124.5K', change: '+12.4%', positive: true },
  { label: 'Tempo Médio', value: '4m 32s', change: '+8.2%', positive: true },
  { label: 'Taxa de Rejeição', value: '32.1%', change: '-4.3%', positive: true },
];

const mockSources = [
  { name: 'Orgânico', value: 45, color: '#A78BFA' },
  { name: 'Direto', value: 28, color: '#8B5CF6' },
  { name: 'Social', value: 15, color: '#3B82F6' },
  { name: 'Referral', value: 8, color: '#F59E0B' },
  { name: 'Email', value: 4, color: '#10B981' },
];

const mockDevices = [
  { name: 'Desktop', value: 58 },
  { name: 'Mobile', value: 35 },
  { name: 'Tablet', value: 7 },
];

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ dateRange: _dateRange }) => {
  const { theme } = useTheme();
  const colors = theme === 'dark' ? darkColors : lightColors;
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
          {[...Array(3)].map((_, i) => <CardLoading key={i} />)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <CardLoading />
          <CardLoading />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {mockStats.map((stat, i) => (
          <Tooltip key={i} content={`${stat.label} - ${stat.positive ? 'Aumento' : 'Redução'} em relação ao período anterior`} position="top">
            <div style={{ background: colors.bgSecondary, borderRadius: 12, padding: 24, border: `1px solid ${colors.borderLight}`, cursor: 'help', animation: `fadeIn 0.4s ease-out ${i * 0.1}s both` }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>{stat.label}</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 32, fontWeight: 700, color: colors.text }}>{stat.value}</div>
              <div style={{ fontSize: 12, marginTop: 4, color: stat.positive ? colors.success : colors.error }}>{stat.change}</div>
            </div>
          </Tooltip>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ background: colors.bgSecondary, borderRadius: 12, padding: 24, border: `1px solid ${colors.borderLight}`, animation: 'fadeIn 0.4s ease-out 0.3s both' }}>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600, color: colors.text, marginBottom: 20 }}>Fontes de Tráfego</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {mockSources.map((source, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: colors.textSecondary }}>{source.name}</span>
                <div style={{ flex: 1, height: 8, background: colors.bgTertiary, borderRadius: 4, marginLeft: 16, marginRight: 16, position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${source.value}%`, background: source.color, borderRadius: 4, transition: 'width 0.8s ease-out' }} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: colors.text, minWidth: 40, textAlign: 'right' }}>{source.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: colors.bgSecondary, borderRadius: 12, padding: 24, border: `1px solid ${colors.borderLight}`, animation: 'fadeIn 0.4s ease-out 0.4s both' }}>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600, color: colors.text, marginBottom: 20 }}>Dispositivos</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {mockDevices.map((device, i) => (
              <Tooltip key={i} content={`${device.value}% dos acessos via ${device.name}`} position="right">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'help' }}>
                  <span style={{ fontSize: 13, color: colors.textSecondary }}>{device.name}</span>
                  <div style={{ flex: 1, height: 8, background: colors.bgTertiary, borderRadius: 4, marginLeft: 16, marginRight: 16, position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${device.value}%`, background: colors.accent, borderRadius: 4, transition: 'width 0.8s ease-out' }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: colors.text, minWidth: 40, textAlign: 'right' }}>{device.value}%</span>
                </div>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};