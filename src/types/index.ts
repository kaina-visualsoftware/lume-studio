export interface KPICard {
  id: string;
  label: string;
  value: number;
  previousValue: number;
  unit: 'currency' | 'number' | 'percentage';
  trend: 'up' | 'down' | 'neutral';
  sparklineData: number[];
}

export interface Order {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: 'delivered' | 'pending' | 'processing' | 'cancelled';
  date: Date;
}

export interface ChartDataPoint {
  month: string;
  revenue: number;
  average: number;
}

export interface TopProduct {
  name: string;
  sales: number;
  percentage: number;
}

export interface ActivityEvent {
  id: string;
  type: 'order' | 'user' | 'payment' | 'alert';
  message: string;
  timestamp: Date;
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  active?: boolean;
}

export type DateRange = 'today' | '7d' | '30d' | 'custom';

export interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

export type LoadingState<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; message: string };

export const statusConfig: Record<Order['status'], { label: string; color: string; bg: string }> = {
  delivered: { label: 'Entregue', color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)' },
  pending: { label: 'Pendente', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)' },
  processing: { label: 'Processando', color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.15)' },
  cancelled: { label: 'Cancelado', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.15)' },
};

export type Theme = 'light' | 'dark';

export const darkColors = {
  bg: '#09090B',
  bgSecondary: '#18181B',
  bgTertiary: '#27272A',
  border: '#3F3F46',
  borderLight: '#27272A',
  text: '#FAFAFA',
  textSecondary: '#A1A1AA',
  textMuted: '#71717A',
  accent: '#A78BFA',
  accentHover: '#8B5CF6',
  accentMuted: 'rgba(139, 92, 246, 0.15)',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
};

export const lightColors = {
  bg: '#FAFAFA',
  bgSecondary: '#FFFFFF',
  bgTertiary: '#F4F4F5',
  border: '#E4E4E7',
  borderLight: '#F4F4F5',
  text: '#18181B',
  textSecondary: '#52525B',
  textMuted: '#A1A1AA',
  accent: '#8B5CF6',
  accentHover: '#7C3AED',
  accentMuted: 'rgba(139, 92, 246, 0.1)',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
};

export const colors = darkColors;