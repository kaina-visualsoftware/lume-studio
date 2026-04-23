import { KPICard, Order, ChartDataPoint, TopProduct, ActivityEvent, NavItem } from '../types';

export const mockKPIs: KPICard[] = [
  { id: 'revenue', label: 'Receita Total', value: 284750, previousValue: 253400, unit: 'currency', trend: 'up', sparklineData: [45, 52, 48, 61, 55, 67, 72, 68, 75, 82, 78, 89] },
  { id: 'users', label: 'Usuários Ativos', value: 18392, previousValue: 17015, unit: 'number', trend: 'up', sparklineData: [120, 135, 128, 142, 156, 148, 162, 175, 168, 182, 190, 195] },
  { id: 'orders', label: 'Pedidos', value: 3847, previousValue: 3109, unit: 'number', trend: 'up', sparklineData: [28, 32, 35, 31, 38, 42, 45, 41, 48, 52, 49, 55] },
  { id: 'conversion', label: 'Taxa de Conversão', value: 4.82, previousValue: 4.84, unit: 'percentage', trend: 'down', sparklineData: [4.2, 4.3, 4.5, 4.4, 4.6, 4.5, 4.7, 4.6, 4.8, 4.7, 4.9, 4.82] },
];

export const mockChartData: ChartDataPoint[] = [
  { month: 'Mai', revenue: 185000, average: 170000 },
  { month: 'Jun', revenue: 198000, average: 175000 },
  { month: 'Jul', revenue: 212000, average: 180000 },
  { month: 'Ago', revenue: 205000, average: 185000 },
  { month: 'Set', revenue: 228000, average: 190000 },
  { month: 'Out', revenue: 242000, average: 195000 },
  { month: 'Nov', revenue: 235000, average: 200000 },
  { month: 'Dez', revenue: 268000, average: 205000 },
  { month: 'Jan', revenue: 252000, average: 210000 },
  { month: 'Fev', revenue: 275000, average: 215000 },
  { month: 'Mar', revenue: 282000, average: 220000 },
  { month: 'Abr', revenue: 284750, average: 225000 },
];

export const mockOrders: Order[] = [
  { id: '#ORD-7841', customer: 'Ana Carolina Silva', product: 'Coleção Primavera', amount: 1850, status: 'delivered', date: new Date('2026-04-22') },
  { id: '#ORD-7840', customer: 'Roberto Ferreira', product: 'Edição Limitada', amount: 2340, status: 'processing', date: new Date('2026-04-22') },
  { id: '#ORD-7839', customer: 'Carla Mendes', product: 'Série Classic', amount: 980, status: 'delivered', date: new Date('2026-04-21') },
  { id: '#ORD-7838', customer: 'Paulo Henrique', product: 'Coleção Inverno', amount: 3150, status: 'pending', date: new Date('2026-04-21') },
  { id: '#ORD-7837', customer: 'Juliana Costa', product: 'Edição Especial', amount: 4200, status: 'processing', date: new Date('2026-04-20') },
  { id: '#ORD-7836', customer: 'Marcos Vinícius', product: 'Série Premium', amount: 1890, status: 'delivered', date: new Date('2026-04-20') },
  { id: '#ORD-7835', customer: 'Beatriz Rodrigues', product: 'Coleção Verão', amount: 1250, status: 'cancelled', date: new Date('2026-04-19') },
  { id: '#ORD-7834', customer: 'Lucas Almeida', product: 'Edição Limitada', amount: 2800, status: 'delivered', date: new Date('2026-04-19') },
  { id: '#ORD-7833', customer: 'Fernanda Silva', product: 'Coleção Primavera', amount: 1560, status: 'delivered', date: new Date('2026-04-18') },
  { id: '#ORD-7832', customer: 'Gabriel Santos', product: 'Série Premium', amount: 2100, status: 'delivered', date: new Date('2026-04-18') },
];

export const mockTopProducts: TopProduct[] = [
  { name: 'Edição Limitada', sales: 1247, percentage: 32.4 },
  { name: 'Coleção Primavera', sales: 892, percentage: 23.2 },
  { name: 'Série Premium', sales: 654, percentage: 17.0 },
  { name: 'Coleção Inverno', sales: 543, percentage: 14.1 },
  { name: 'Edição Especial', sales: 511, percentage: 13.3 },
];

export const mockActivity: ActivityEvent[] = [
  { id: '1', type: 'order', message: 'Novo pedido #ORD-7841', timestamp: new Date('2026-04-23T10:32:00') },
  { id: '2', type: 'payment', message: 'Pagamento recebido - R$ 2.340', timestamp: new Date('2026-04-23T10:28:00') },
  { id: '3', type: 'user', message: 'Novo usuário cadastrado', timestamp: new Date('2026-04-23T10:15:00') },
  { id: '4', type: 'order', message: 'Pedido #ORD-7839 entregue', timestamp: new Date('2026-04-23T09:45:00') },
  { id: '5', type: 'alert', message: 'Estoque baixo: Edição Limitada', timestamp: new Date('2026-04-23T09:30:00') },
];

export const mockHeatmap: number[][] = Array.from({ length: 7 }, () =>
  Array.from({ length: 24 }, () => Math.floor(Math.random() * 100))
);

export const mockUsers = [
  { id: 1, name: 'Ana Carolina Silva', email: 'ana@email.com', role: 'Cliente', orders: 12, spent: 15420, status: 'active', joined: '2025-08-15' },
  { id: 2, name: 'Roberto Ferreira', email: 'roberto@email.com', role: 'Cliente', orders: 8, spent: 8920, status: 'active', joined: '2025-09-22' },
  { id: 3, name: 'Carla Mendes', email: 'carla@email.com', role: 'VIP', orders: 24, spent: 32100, status: 'active', joined: '2025-03-10' },
  { id: 4, name: 'Paulo Henrique', email: 'paulo@email.com', role: 'Cliente', orders: 3, spent: 2450, status: 'inactive', joined: '2025-11-05' },
  { id: 5, name: 'Juliana Costa', email: 'juliana@email.com', role: 'VIP', orders: 18, spent: 24500, status: 'active', joined: '2025-05-20' },
  { id: 6, name: 'Marcos Vinícius', email: 'marcos@email.com', role: 'Admin', orders: 0, spent: 0, status: 'active', joined: '2025-01-01' },
  { id: 7, name: 'Beatriz Rodrigues', email: 'beatriz@email.com', role: 'Cliente', orders: 6, spent: 4890, status: 'active', joined: '2025-10-12' },
  { id: 8, name: 'Lucas Almeida', email: 'lucas@email.com', role: 'Cliente', orders: 2, spent: 1850, status: 'pending', joined: '2026-01-15' },
];

export const mockProducts: (TopProduct & { id: number; sku: string; price: number; stock: number; category: string })[] = [
  { id: 1, name: 'Edição Limitada', sales: 1247, percentage: 32.4, sku: 'EL-001', price: 450, stock: 23, category: 'Especial' },
  { id: 2, name: 'Coleção Primavera', sales: 892, percentage: 23.2, sku: 'CP-002', price: 280, stock: 156, category: 'Sazonal' },
  { id: 3, name: 'Série Premium', sales: 654, percentage: 17.0, sku: 'SP-003', price: 520, stock: 45, category: 'Premium' },
  { id: 4, name: 'Coleção Inverno', sales: 543, percentage: 14.1, sku: 'CI-004', price: 320, stock: 89, category: 'Sazonal' },
  { id: 5, name: 'Edição Especial', sales: 511, percentage: 13.3, sku: 'EE-005', price: 680, stock: 12, category: 'Especial' },
  { id: 6, name: 'Série Classic', sales: 234, percentage: 6.1, sku: 'SC-006', price: 180, stock: 234, category: 'Classic' },
  { id: 7, name: 'Coleção Verão', sales: 189, percentage: 4.9, sku: 'CV-007', price: 250, stock: 167, category: 'Sazonal' },
  { id: 8, name: 'Acessórios', sales: 156, percentage: 4.1, sku: 'AC-008', price: 89, stock: 456, category: 'Acessórios' },
];

export const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', active: true },
  { id: 'analytics', label: 'Analytics', icon: 'analytics' },
  { id: 'users', label: 'Usuários', icon: 'users' },
  { id: 'products', label: 'Produtos', icon: 'products' },
  { id: 'orders', label: 'Pedidos', icon: 'orders' },
  { id: 'settings', label: 'Configurações', icon: 'settings' },
];