import React from 'react';
import { navItems } from '../data';
import { colors } from '../types';
import { IconDashboard, IconAnalytics, IconUsers, IconProducts, IconOrders, IconSettings, IconServers, IconDollar } from './Icons';
import { useFinance } from '../context/FinanceContext';

interface SidebarProps {
  activeItem: string;
  onItemChange: (id: string) => void;
  userName?: string;
  userEmail?: string;
}

const iconMap: Record<string, React.FC<{ size?: number; color?: string }>> = {
  dashboard: IconDashboard,
  analytics: IconAnalytics,
  users: IconUsers,
  products: IconProducts,
  orders: IconOrders,
  settings: IconSettings,
  servers: IconServers,
  dollar: IconDollar,
};

const styles = {
  sidebar: {
    width: 240,
    background: colors.bgSecondary,
    borderRight: `1px solid ${colors.borderLight}`,
    display: 'flex',
    flexDirection: 'column' as const,
    padding: '24px 0',
    position: 'fixed' as const,
    height: '100vh',
  },
  logo: {
    padding: '0 24px 32px',
    borderBottom: `1px solid ${colors.borderLight}`,
    marginBottom: 24,
  },
  logoText: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 24,
    fontWeight: 700,
    color: colors.text,
    letterSpacing: '-0.5px',
  },
  logoSubtext: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 12,
    fontWeight: 500,
    color: colors.accent,
    marginLeft: 6,
    letterSpacing: '0.5px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 2,
    padding: '0 12px',
    flex: 1,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 16px',
    borderRadius: 8,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    textAlign: 'left' as const,
    width: '100%',
    color: colors.textMuted,
  },
  navItemActive: {
    background: 'rgba(139, 92, 246, 0.15)',
    color: colors.accentHover,
  },
  navItemLabel: {
    fontSize: 14,
    fontWeight: 500,
  },
  userCard: {
    margin: 'auto 16px 16px',
    padding: 16,
    background: colors.bgTertiary,
    borderRadius: 12,
    border: `1px solid ${colors.borderLight}`,
  },
  userTop: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: `linear-gradient(135deg, ${colors.accent}, ${colors.accentHover})`,
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    fontWeight: 600,
  },
  userInfo: {
    flex: 1,
    minWidth: 0,
  },
  userName: {
    fontSize: 13,
    fontWeight: 600,
    color: colors.text,
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  userEmail: {
    fontSize: 11,
    color: colors.textMuted,
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  userStats: {
    display: 'flex',
    gap: 16,
  },
  userStat: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  userStatValue: {
    fontSize: 16,
    fontWeight: 700,
    color: colors.text,
  },
  userStatLabel: {
    fontSize: 10,
    color: colors.textMuted,
    textTransform: 'uppercase' as const,
  },
};

export const Sidebar: React.FC<SidebarProps> = ({ activeItem, onItemChange, userName, userEmail }) => {
  const { alerts } = useFinance();
  const initials = userName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  const alertCount = alerts.length;

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>
        <span style={styles.logoText}>LUME</span>
        <span style={styles.logoSubtext}>STUDIO</span>
      </div>
      <nav style={styles.nav}>
        {navItems.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = activeItem === item.id;
          const showBadge = item.id === 'finance' && alertCount > 0;
          return (
            <button
              key={item.id}
              style={{
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : {}),
                color: isActive ? colors.accentHover : colors.textMuted,
              }}
              onClick={() => onItemChange(item.id)}
            >
              <Icon size={18} color="currentColor" />
              <span style={styles.navItemLabel}>{item.label}</span>
              {showBadge && (
                <span style={{
                  marginLeft: 'auto',
                  background: colors.error,
                  color: '#FFFFFF',
                  fontSize: 10,
                  fontWeight: 600,
                  padding: '2px 6px',
                  borderRadius: 10,
                  minWidth: 18,
                  textAlign: 'center',
                }}>{alertCount}</span>
              )}
            </button>
          );
        })}
      </nav>
      
      {userName && (
        <div style={styles.userCard}>
          <div style={styles.userTop}>
            <div style={styles.userAvatar}>{initials}</div>
            <div style={styles.userInfo}>
              <div style={styles.userName}>{userName}</div>
              <div style={styles.userEmail}>{userEmail || 'admin@lume.com'}</div>
            </div>
          </div>
          <div style={styles.userStats}>
            <div style={styles.userStat}>
              <span style={styles.userStatValue}>$284K</span>
              <span style={styles.userStatLabel}>Revenue</span>
            </div>
            <div style={styles.userStat}>
              <span style={styles.userStatValue}>3.8K</span>
              <span style={styles.userStatLabel}>Pedidos</span>
            </div>
            <div style={styles.userStat}>
              <span style={styles.userStatValue}>18K</span>
              <span style={styles.userStatLabel}>Clientes</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};