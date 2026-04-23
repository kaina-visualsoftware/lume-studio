import React from 'react';
import { ActivityEvent, colors } from '../types';
import { IconOrders, IconUsers } from './Icons';

interface ActivityFeedProps {
  events: ActivityEvent[];
}

const styles = {
  activityContainer: {
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
  activityTimeline: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  } as React.CSSProperties,
  activityItem: {
    display: 'flex',
    gap: 10,
  },
  activityIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    background: colors.bgTertiary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  activityContent: {
    flex: 1,
  },
  activityMessage: {
    fontSize: 12,
    color: colors.textSecondary,
    margin: 0,
    lineHeight: 1.4,
  },
  activityTime: {
    fontSize: 10,
    color: colors.textMuted,
  },
};

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ events }) => {
  const getIcon = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'order':
        return <IconOrders size={12} color={colors.accentHover} />;
      case 'user':
        return <IconUsers size={12} color={colors.info} />;
      case 'payment':
        return <span style={{ fontSize: 12, color: colors.success }}>$</span>;
      case 'alert':
        return <span style={{ fontSize: 12, color: colors.warning }}>!</span>;
    }
  };

  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 60000);
    if (diff < 60) return `${diff}m`;
    return `${Math.floor(diff / 60)}h`;
  };

  return (
    <div style={styles.activityContainer}>
      <h3 style={styles.sectionTitle}>Atividade Recente</h3>
      <div style={styles.activityTimeline}>
        {events.map((event) => (
          <div key={event.id} style={styles.activityItem}>
            <div style={styles.activityIcon}>{getIcon(event.type)}</div>
            <div style={styles.activityContent}>
              <p style={styles.activityMessage}>{event.message}</p>
              <span style={styles.activityTime}>{getTimeAgo(event.timestamp)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};