import React from 'react';
import { DateRange, colors } from '../types';
import { IconSearch, IconBell } from './Icons';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  notificationCount: number;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  currentTime: Date;
}

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 32px',
    background: colors.bgSecondary,
    borderBottom: `1px solid ${colors.borderLight}`,
    position: 'sticky' as const,
    top: 0,
    zIndex: 100,
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 14px',
    background: colors.bgTertiary,
    borderRadius: 8,
    border: `1px solid ${colors.borderLight}`,
    width: 260,
  },
  searchInput: {
    border: 'none',
    background: 'transparent',
    outline: 'none',
    fontSize: 13,
    color: '#FAFAFA',
    width: '100%',
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  dateRangeSelector: {
    display: 'flex',
    background: colors.bgTertiary,
    borderRadius: 8,
    padding: 3,
    gap: 2,
  },
  dateRangeButton: {
    padding: '6px 12px',
    borderRadius: 6,
    border: 'none',
    background: 'transparent',
    fontSize: 12,
    fontWeight: 500,
    color: colors.textMuted,
    cursor: 'pointer',
  },
  dateRangeButtonActive: {
    background: colors.accentHover,
    color: '#FFFFFF',
  },
  notificationButton: {
    position: 'relative' as const,
    background: 'transparent',
    border: 'none',
    padding: 8,
    cursor: 'pointer',
  },
  notificationBadge: {
    position: 'absolute' as const,
    top: 4,
    right: 4,
    background: colors.accentHover,
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 600,
    width: 16,
    height: 16,
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentTime: {
    fontSize: 13,
    fontWeight: 600,
    color: colors.text,
    fontFamily: "'Space Grotesk', sans-serif",
  },
};

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  notificationCount,
  dateRange,
  onDateRangeChange,
  currentTime,
}) => {
  const dateRangeOptions: DateRange[] = ['today', '7d', '30d', 'custom'];

  return (
    <header style={styles.header}>
      <div style={styles.searchContainer}>
        <IconSearch size={16} color={colors.textMuted} />
        <input
          type="text"
          placeholder="Buscar..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          style={styles.searchInput}
        />
      </div>
      <div style={styles.headerActions}>
        <div style={styles.dateRangeSelector}>
          {dateRangeOptions.map((option) => (
            <button
              key={option}
              style={{
                ...styles.dateRangeButton,
                ...(dateRange === option ? styles.dateRangeButtonActive : {}),
              }}
              onClick={() => onDateRangeChange(option)}
            >
              {option === 'today' ? 'Hoje' : option === '7d' ? '7D' : option === '30d' ? '30D' : 'Custom'}
            </button>
          ))}
        </div>
        <button style={styles.notificationButton}>
          <IconBell size={18} color={colors.textSecondary} />
          {notificationCount > 0 && (
            <span style={styles.notificationBadge}>{notificationCount}</span>
          )}
        </button>
        <div style={styles.currentTime}>
          {new Intl.DateTimeFormat('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          }).format(currentTime)}
        </div>
      </div>
    </header>
  );
};