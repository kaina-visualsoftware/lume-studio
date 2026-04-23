import React, { useState, useEffect } from 'react';
import { useTheme } from './Theme';
import { Tooltip } from './Tooltip';
import { PlacesLoading } from './PlacesLoading';
import { darkColors, lightColors, statusConfig } from '../types';
import { IconSearch, IconChevronLeft, IconChevronRight, IconTrash } from './Icons';
import { Modal } from './Modal';
import { useToast } from './Toast';

interface OrdersPageProps {
  dateRange: 'today' | '7d' | '30d' | 'custom';
}

const initialOrders = [
  { id: '#ORD-7841', customer: 'Ana Carolina Silva', product: 'Coleção Primavera', amount: 1850, status: 'delivered' as const, date: new Date('2026-04-22'), payment: 'Cartão' },
  { id: '#ORD-7840', customer: 'Roberto Ferreira', product: 'Edição Limitada', amount: 2340, status: 'processing' as const, date: new Date('2026-04-22'), payment: 'PIX' },
  { id: '#ORD-7839', customer: 'Carla Mendes', product: 'Série Classic', amount: 980, status: 'delivered' as const, date: new Date('2026-04-21'), payment: 'Cartão' },
  { id: '#ORD-7838', customer: 'Paulo Henrique', product: 'Coleção Inverno', amount: 3150, status: 'pending' as const, date: new Date('2026-04-21'), payment: 'Boleto' },
  { id: '#ORD-7837', customer: 'Juliana Costa', product: 'Edição Especial', amount: 4200, status: 'processing' as const, date: new Date('2026-04-20'), payment: 'PIX' },
  { id: '#ORD-7836', customer: 'Marcos Vinícius', product: 'Série Premium', amount: 1890, status: 'delivered' as const, date: new Date('2026-04-20'), payment: 'Cartão' },
  { id: '#ORD-7835', customer: 'Beatriz Rodrigues', product: 'Coleção Verão', amount: 1250, status: 'cancelled' as const, date: new Date('2026-04-19'), payment: 'Cartão' },
  { id: '#ORD-7834', customer: 'Lucas Almeida', product: 'Edição Limitada', amount: 2800, status: 'delivered' as const, date: new Date('2026-04-19'), payment: 'PIX' },
  { id: '#ORD-7833', customer: 'Fernanda Silva', product: 'Coleção Primavera', amount: 1560, status: 'delivered' as const, date: new Date('2026-04-18'), payment: 'Cartão' },
  { id: '#ORD-7832', customer: 'Gabriel Santos', product: 'Série Premium', amount: 2100, status: 'delivered' as const, date: new Date('2026-04-18'), payment: 'PIX' },
];

export const OrdersPage: React.FC<OrdersPageProps> = ({ dateRange: _dateRange }) => {
  const { showToast } = useToast();
  const { theme } = useTheme();
  const colors = theme === 'dark' ? darkColors : lightColors;
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; orderId: string | null }>({ isOpen: false, orderId: null });
  
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const itemsPerPage = 5;
  const totalOrders = orders.length;
  const totalPages = Math.ceil(totalOrders / itemsPerPage);
  const deliveredCount = orders.filter(o => o.status === 'delivered').length;
  const deliveryRate = Math.round((deliveredCount / totalOrders) * 100);
  const pendingCount = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((acc, o) => acc + o.amount, 0);
  
  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  const paginatedOrders = filteredOrders.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  const statusFilters: string[] = ['all', 'pending', 'processing', 'delivered', 'cancelled'];
  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = { all: 'Todos', pending: 'Pendente', processing: 'Processando', delivered: 'Entregue', cancelled: 'Cancelado' };
    return map[status] || status;
  };

  const handleDelete = (orderId: string) => {
    setDeleteModal({ isOpen: true, orderId });
  };

  const confirmDelete = () => {
    if (deleteModal.orderId) {
      setOrders(prev => prev.filter(o => o.id !== deleteModal.orderId));
      showToast('success', `Pedido ${deleteModal.orderId} excluído com sucesso!`);
    }
    setDeleteModal({ isOpen: false, orderId: null });
  };

  if (loading) {
    return (
      <div>
        <Modal isOpen={false} onClose={() => {}} onConfirm={() => {}} title="Excluir Pedido" message="" confirmText="Excluir" cancelText="Cancelar" type="danger" />
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ background: colors.bgSecondary, borderRadius: 12, padding: 24, border: `1px solid ${colors.borderLight}`, animation: 'pulse 2s ease-in-out infinite', animationDelay: `${i * 0.1}s` }}>
              <div style={{ height: 32, width: '60%', background: colors.bgTertiary, borderRadius: 6, marginBottom: 12 }} />
              <div style={{ height: 28, width: '80%', background: colors.bgTertiary, borderRadius: 4 }} />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{ height: 32, width: 80, background: colors.bgTertiary, borderRadius: 8, animation: 'pulse 2s ease-in-out infinite', animationDelay: `${i * 0.05}s` }} />
          ))}
        </div>
        <PlacesLoading rows={5} />
      </div>
    );
  }

  return (
    <div>
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        <Tooltip content="Total de pedidos" position="top">
          <div style={{ background: colors.bgSecondary, borderRadius: 12, padding: 24, border: `1px solid ${colors.borderLight}`, cursor: 'help' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Total de Pedidos</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 32, fontWeight: 700, color: colors.text }}>{totalOrders}</div>
          </div>
        </Tooltip>
        <Tooltip content="Revenue dos pedidos entregues" position="top">
          <div style={{ background: colors.bgSecondary, borderRadius: 12, padding: 24, border: `1px solid ${colors.borderLight}`, cursor: 'help' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Revenue Total</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 32, fontWeight: 700, color: colors.text }}>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(totalRevenue)}
            </div>
          </div>
        </Tooltip>
        <Tooltip content="Pedidos pendentes ou processando" position="top">
          <div style={{ background: colors.bgSecondary, borderRadius: 12, padding: 24, border: `1px solid ${colors.borderLight}`, cursor: 'help' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Pendentes</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 32, fontWeight: 700, color: colors.text }}>{pendingCount}</div>
          </div>
        </Tooltip>
        <Tooltip content="Taxa de entrega bem-sucedida" position="top">
          <div style={{ background: colors.bgSecondary, borderRadius: 12, padding: 24, border: `1px solid ${colors.borderLight}`, cursor: 'help' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Taxa de Entrega</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 32, fontWeight: 700, color: colors.success }}>{deliveryRate}%</div>
          </div>
        </Tooltip>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {statusFilters.map((status) => (
          <button key={status} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: statusFilter === status ? colors.accent : colors.bgTertiary, fontSize: 12, fontWeight: 500, color: statusFilter === status ? '#FFFFFF' : colors.textMuted, cursor: 'pointer', transition: 'all 0.15s' }} onClick={() => setStatusFilter(status)}>
            {getStatusLabel(status)}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', background: colors.bgTertiary, borderRadius: 8, border: `1px solid ${colors.borderLight}`, width: 280 }}>
          <IconSearch size={16} color={colors.textMuted} />
          <input type="text" placeholder="Buscar pedidos..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, color: colors.text, width: '100%' }} />
        </div>
      </div>

      <div style={{ background: colors.bgSecondary, borderRadius: 12, padding: 24, border: `1px solid ${colors.borderLight}` }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${colors.borderLight}` }}>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase' }}>ID</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase' }}>Cliente</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase' }}>Produto</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase' }}>Pagamento</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase' }}>Valor</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase' }}>Status</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase' }}>Data</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase' }}></th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((order) => (
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
                <td style={{ padding: '14px 16px', fontSize: 13, color: colors.textSecondary }}>
                  <span style={{ display: 'inline-block', padding: '4px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, background: statusConfig[order.status]?.bg, color: statusConfig[order.status]?.color }}>
                    {statusConfig[order.status]?.label}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: colors.textMuted }}>
                  {new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' }).format(order.date)}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Tooltip content="Excluir pedido" position="left">
                      <button style={{ background: 'transparent', border: 'none', padding: 6, cursor: 'pointer', borderRadius: 6, color: colors.error, transition: 'background 0.15s' }}
                        onClick={() => handleDelete(order.id)}
                        onMouseEnter={(e) => e.currentTarget.style.background = `${colors.error}20`}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <IconTrash size={16} />
                      </button>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, marginTop: 16 }}>
          <button style={{ background: colors.bgTertiary, border: 'none', borderRadius: 6, padding: 6, cursor: 'pointer', opacity: page === 0 ? 0.3 : 1 }} onClick={() => setPage(page - 1)} disabled={page === 0}>
            <IconChevronLeft size={14} />
          </button>
          <span style={{ fontSize: 12, color: colors.textMuted }}>{page + 1} / {totalPages}</span>
          <button style={{ background: colors.bgTertiary, border: 'none', borderRadius: 6, padding: 6, cursor: 'pointer', opacity: page === totalPages - 1 ? 0.3 : 1 }} onClick={() => setPage(page + 1)} disabled={page === totalPages - 1}>
            <IconChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};