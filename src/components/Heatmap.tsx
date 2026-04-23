import React from 'react';
import { colors } from '../types';

interface HeatmapProps {
  data: number[][];
}

const styles = {
  heatmapContainer: {
    background: colors.bgSecondary,
    borderRadius: 12,
    padding: 24,
    border: `1px solid ${colors.borderLight}`,
  },
  sectionTitle: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 16,
    fontWeight: 600,
    color: colors.text,
    marginBottom: 20,
  },
};

export const Heatmap: React.FC<HeatmapProps> = ({ data }) => {
  const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  const getColor = (value: number): string => {
    if (value < 20) return colors.bgTertiary;
    if (value < 40) return `${colors.accent}40`;
    if (value < 60) return `${colors.accent}80`;
    if (value < 80) return `${colors.accent}CC`;
    return colors.accent;
  };

  return (
    <div style={styles.heatmapContainer}>
      <h3 style={styles.sectionTitle}>Atividade da Semana</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {data.map((row, dayIndex) => (
          <div key={dayIndex} style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <span style={{ fontSize: 9, color: colors.textMuted, width: 20 }}>
              {days[dayIndex]}
            </span>
            {row.map((value, hourIndex) => (
              <div
                key={hourIndex}
                style={{
                  width: 8,
                  height: 8,
                  flex: 1,
                  borderRadius: 1,
                  background: getColor(value),
                  minWidth: '8px',
                  maxWidth: '8px',
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};