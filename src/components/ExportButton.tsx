import React from 'react';
import { colors } from '../types';

interface ExportButtonProps {
  data: Record<string, unknown>[];
  filename: string;
  label?: string;
  icon?: React.ReactNode;
}

const styles = {
  button: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 16px',
    background: colors.bgTertiary,
    border: `1px solid ${colors.borderLight}`,
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    color: colors.textSecondary,
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  buttonHover: {
    background: colors.bgSecondary,
    borderColor: colors.accentHover,
    color: colors.text,
  },
  icon: {
    display: 'flex',
  },
};

const DownloadIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export const ExportButton: React.FC<ExportButtonProps> = ({ data, filename, label = 'Exportar', icon }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const exportToCSV = () => {
    if (!data.length) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          if (value === null || value === undefined) return '';
          const stringValue = String(value);
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      type="button"
      onClick={exportToCSV}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...styles.button,
        ...(isHovered ? styles.buttonHover : {}),
      }}
    >
      <span style={styles.icon}>
        {icon || <DownloadIcon />}
      </span>
      <span>{label}</span>
    </button>
  );
};

export const ExportButtonSmall: React.FC<Omit<ExportButtonProps, 'label'>> = (props) => (
  <ExportButton 
    {...props} 
    label=""
    icon={
      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    }
  />
);