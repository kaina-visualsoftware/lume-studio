import React, { useState, useEffect } from 'react';
import { useTheme } from './Theme';
import { Tooltip } from './Tooltip';
import { PlacesLoading } from './PlacesLoading';
import { darkColors, lightColors, statusConfig } from '../types';
import { Search, ChevronLeft, ChevronRight, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { Modal } from './Modal';
import { useToast } from './Toast';
import { useBreakpoint } from '../hooks';
import KPICards from './KPICards';
import MultiSelectFilter from './MultiSelectFilter';

interface OrdersPageProps {
  dateRange: 'today' | '7d' | '30d' | 'custom';
}

interface Order {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: 'delivered' | 'pending' | 'processing' | 'cancelled';
  date: Date;
  payment: string;
}

const mockOrders: Order[] = [
  { id: '#ORD-7841', customer: 'Ana Carolina Silva', product: 'Coleção Primavera', amount: 1850, status: 'delivered', date: new Date('2026-04-22'), payment: 'Cartão' },
  { id: '#ORD-7840', customer: 'Roberto Ferreira', product: 'Edição Limitada', amount: 2340, status: 'processing', date: new Date('2026-04-22'), payment: 'PIX' },
  { id: '#ORD-7839', customer: 'Carla Mendes', product: 'Série Classic', amount: 980, status: 'delivered', date: new Date('2026-04-21'), payment: 'Cartão' },
  { id: '#ORD-7838', customer: 'Paulo Henrique', product: 'Coleção Inverno', amount: 3150, status: 'pending', date: new Date('2026-04-21'), payment: 'Boleto' },
  { id: '#ORD-7837', customer: 'Juliana Costa', product: 'Edição Especial', amount: 4200, status: 'processing', date: new Date('2026-04-20'), payment: 'PIX' },
  { id: '#ORD-7836', customer: 'Marcos Vinícius', product: 'Série Premium', amount: 1890, status: 'delivered', date: new Date('2026-04-20'), payment: 'Cartão' },
  { id: '#ORD-7835', customer: 'Beatriz Rodrigues', product: 'Coleção Verão', amount: 1250, status: 'cancelled', date: new Date('2026-04-19'), payment: 'Cartão' },
  { id: '#ORD-7834', customer: 'Lucas Almeida', product: 'Edição Limitada', amount: 2800, status: 'delivered', date: new Date('2026-04-19'), payment: 'PIX' },
  { id: '#ORD-7833', customer: 'Fernanda Silva', product: 'Coleção Primavera', amount: 1560, status: 'delivered', date: new Date('2026-04-18'), payment: 'Cartão' },
  { id: '#ORD-7832', customer: 'Gabriel Santos', product: 'Série Premium', amount: 2100, status: 'delivered', date: new Date('2026-04-18'), payment: 'PIX' },
  { id: '#ORD-7831', customer: 'Carla Oliveira', product: 'Edição Gold', amount: 4500, status: 'delivered', date: new Date('2026-04-17'), payment: 'PIX' },
  { id: '#ORD-7830', customer: 'Ricardo Souza', product: 'Kit Básico', amount: 890, status: 'pending', date: new Date('2026-04-17'), payment: 'Boleto' },
];

const fetchOrders = async (page: number, search: string, statusFilter: string[], sortField: string, sortDir: 'asc' | 'desc'): Promise<{ orders: Order[]; total: number }> => {
  await new Promise(r => setTimeout(r, 500));
  
  let filtered = mockOrders.filter(o => {
    const matchesSearch = search === '' || 
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter.includes('all') || statusFilter.includes(o.status);
    return matchesSearch && matchesStatus;
  });

  filtered.sort((a, b) => {
    let cmp = 0;
    if (sortField === 'id') cmp = a.id.localeCompare(b.id);
    else if (sortField === 'customer') cmp = a.customer.localeCompare(b.customer);
    else if (sortField === 'product') cmp = a.product.localeCompare(b.product);
    else if (sortField === 'amount') cmp = a.amount - b.amount;
    else if (sortField === 'date') cmp = a.date.getTime() - b.date.getTime();
    else if (sortField === 'status') cmp = a.status.localeCompare(b.status);
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const total = filtered.length;
  const pageSize = 5;
  const paginated = filtered.slice(page * pageSize, (page + 1) * pageSize);
  
  return { orders: paginated, total };
};

type SortField = 'id' | 'customer' | 'product' | 'amount' | 'date' | 'status';

export const OrdersPage: React.FC<OrdersPageProps> = ({ dateRange: _dateRange }) => {
  const { showToast } = useToast();
  const { theme } = useTheme();
  const colors = theme === 'dark' ? darkColors : lightColors;
  const bp = useBreakpoint();
  const isMobile = bp === 'mobile';
  
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>(['all']);
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; orderId: string | null }>({ isOpen: false, orderId: null });
  
  const statusFilters = [
    { value: 'pending', label: 'Pendente' },
    { value: 'processing', label: 'Processando' },
    { value: 'delivered', label: 'Entregue' },
    { value: 'cancelled', label: 'Cancelado' },
  ];
  
  useEffect(() => {
    setLoading(true);
    fetchOrders(page, search, statusFilter, sortField, sortDir).then(result => {
      setOrders(result.orders);
      setTotal(result.total);
      setLoading(false);
    });
  }, [page, search, statusFilter, sortField, sortDir]);

  const totalPages = Math.ceil(total / 5);
  const deliveredCount = mockOrders.filter(o => o.status === 'delivered').length;
  const deliveryRate = Math.round((deliveredCount / mockOrders.length) * 100);
  const pendingCount = mockOrders.filter(o => o.status === 'pending' || o.status === 'processing').length;
  const totalRevenue = mockOrders.filter(o => o.status !== 'cancelled').reduce((acc, o) => acc + o.amount, 0);

  const ordersCards = [
    { id: 'orders', label: 'TOTAL DE PEDIDOS', value: mockOrders.length, unit: 'number' as const, variation: 23.7 },
    { id: 'revenue', label: 'REVENUE TOTAL', value: totalRevenue, unit: 'currency' as const, variation: 12.4 },
    { id: 'pending', label: 'PENDENTES', value: pendingCount, unit: 'number' as const, variation: -8.2 },
    { id: 'delivery', label: 'TAXA DE ENTREGA', value: deliveryRate, unit: 'percentage' as const, variation: 2.1, subtitle: 'dos pedidos' },
  ];

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
    setPage(0);
  };

  const SortIcon: React.FC<{ field: SortField }> = ({ field }) => {
    if (sortField !== field) return null;
    return sortDir === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />;
  };

  const handleDelete = (orderId: string) => {
    setDeleteModal({ isOpen: true, orderId });
  };

  const confirmDelete = () => {
    if (deleteModal.orderId) {
      setOrders(prev => prev.filter(o => o.id !== deleteModal.orderId));
      setTotal(t => t - 1);
      showToast('success', `Pedido ${deleteModal.orderId} excluído com sucesso!`);
    }
    setDeleteModal({ isOpen: false, orderId: null });
  };

  return (
    <div style={{ padding: isMobile ? 16 : 32, flex: 1 }}>
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, orderId: null })}
        onConfirm={confirmDelete}
        title="Excluir Pedido"
        message={`Tem certeza que deseja excluir o pedido ${deleteModal.orderId}? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
      />

      <KPICards cards={ordersCards} loading={loading} />

      <div style={{ display: 'flex', gap: 12, marginTop: 24, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <MultiSelectFilter
          label="Status"
          options={statusFilters}
          selected={statusFilter}
          onChange={(values) => { setStatusFilter(values); setPage(0); }}
          colors={colors}
        />
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', background: colors.bgTertiary, borderRadius: 8, border: `1px solid ${colors.borderLight}`, width: 260 }}>
          <Search size={16} color={colors.textMuted} />
          <input type="text" placeholder="Buscar..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, color: colors.text, width: '100%' }} />
        </div>
      </div>

      {loading ? (
        <PlacesLoading rows={5} />
      ) : (
        <div style={{ background: colors.bgSecondary, borderRadius: 12, padding: isMobile ? 12 : 24, border: `1px solid ${colors.borderLight}`, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${colors.borderLight}` }}>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: colors.textMuted, cursor: 'pointer' }} onClick={() => handleSort('id')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>ID <SortIcon field="id" /></div>
                </th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: colors.textMuted, cursor: 'pointer' }} onClick={() => handleSort('customer')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Cliente <SortIcon field="customer" /></div>
                </th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: colors.textMuted, cursor: 'pointer' }} onClick={() => handleSort('product')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Produto <SortIcon field="product" /></div>
                </th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: colors.textMuted }}>Pagamento</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: colors.textMuted, cursor: 'pointer' }} onClick={() => handleSort('amount')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Valor <SortIcon field="amount" /></div>
                </th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: colors.textMuted, cursor: 'pointer' }} onClick={() => handleSort('status')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Status <SortIcon field="status" /></div>
                </th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: colors.textMuted, cursor: 'pointer' }} onClick={() => handleSort('date')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Data <SortIcon field="date" /></div>
                </th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: colors.textMuted }}></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} style={{ borderBottom: `1px solid ${colors.borderLight}`, transition: 'background 0.15s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = colors.bgTertiary}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '14px 16px', fontSize: 13, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: colors.text }}>{order.id}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 500, color: colors.text }}>{order.customer}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: colors.textSecondary }}>{order.product}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: colors.textSecondary }}>{order.payment}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: colors.text }}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.amount)}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13 }}>
                    <span style={{ display: 'inline-block', padding: '4px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, background: statusConfig[order.status]?.bg, color: statusConfig[order.status]?.color }}>
                      {statusConfig[order.status]?.label}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: colors.textMuted }}>
                    {new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' }).format(order.date)}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <Tooltip content="Excluir pedido" position="left">
                      <button style={{ background: 'transparent', border: 'none', padding: 6, cursor: 'pointer', borderRadius: 6, color: colors.error }}
                        onClick={() => handleDelete(order.id)}
                        onMouseEnter={(e) => e.currentTarget.style.background = `${colors.error}20`}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <Trash2 size={16} />
                      </button>
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, marginTop: 16 }}>
            <span style={{ fontSize: 12, color: colors.textMuted }}>{total} registros</span>
            <button style={{ background: colors.bgTertiary, border: 'none', borderRadius: 6, padding: 6, cursor: 'pointer', opacity: page === 0 ? 0.3 : 1 }} onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
              <ChevronLeft size={14} />
            </button>
            <span style={{ fontSize: 12, color: colors.textMuted }}>{page + 1} / {totalPages || 1}</span>
            <button style={{ background: colors.bgTertiary, border: 'none', borderRadius: 6, padding: 6, cursor: 'pointer', opacity: page >= totalPages - 1 ? 0.3 : 1 }} onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};