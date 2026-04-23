import React, { useState, useEffect } from 'react';
import { useTheme } from './Theme';
import { Tooltip } from './Tooltip';
import { PlacesLoading } from './PlacesLoading';
import { darkColors, lightColors } from '../types';
import { IconSearch, IconChevronLeft, IconChevronRight, IconUsers } from './Icons';

interface UsersPageProps {
  dateRange: 'today' | '7d' | '30d' | 'custom';
}

const mockUsers = [
  { id: 1, name: 'Ana Carolina Silva', email: 'ana@email.com', role: 'Cliente', orders: 12, spent: 15420, status: 'active', joined: '2025-08-15' },
  { id: 2, name: 'Roberto Ferreira', email: 'roberto@email.com', role: 'Cliente', orders: 8, spent: 8920, status: 'active', joined: '2025-09-22' },
  { id: 3, name: 'Carla Mendes', email: 'carla@email.com', role: 'VIP', orders: 24, spent: 32100, status: 'active', joined: '2025-03-10' },
  { id: 4, name: 'Paulo Henrique', email: 'paulo@email.com', role: 'Cliente', orders: 3, spent: 2450, status: 'inactive', joined: '2025-11-05' },
  { id: 5, name: 'Juliana Costa', email: 'juliana@email.com', role: 'VIP', orders: 18, spent: 24500, status: 'active', joined: '2025-05-20' },
  { id: 6, name: 'Marcos Vinícius', email: 'marcos@email.com', role: 'Admin', orders: 0, spent: 0, status: 'active', joined: '2025-01-01' },
  { id: 7, name: 'Beatriz Rodrigues', email: 'beatriz@email.com', role: 'Cliente', orders: 6, spent: 4890, status: 'active', joined: '2025-10-12' },
  { id: 8, name: 'Lucas Almeida', email: 'lucas@email.com', role: 'Cliente', orders: 2, spent: 1850, status: 'pending', joined: '2026-01-15' },
];

export const UsersPage: React.FC<UsersPageProps> = ({ dateRange: _dateRange }) => {
  const { theme } = useTheme();
  const colors = theme === 'dark' ? darkColors : lightColors;
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const itemsPerPage = 5;
  
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const totalPages = Math.ceil(mockUsers.length / itemsPerPage);
  
  const filteredUsers = mockUsers.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );
  
  const paginatedUsers = filteredUsers.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
  const totalOrders = mockUsers.reduce((acc, u) => acc + u.orders, 0);
  const totalSpent = mockUsers.reduce((acc, u) => acc + u.spent, 0);

  const roleConfig = {
    Admin: { label: 'Admin', color: colors.error, bg: `${colors.error}26` },
    VIP: { label: 'VIP', color: colors.warning, bg: `${colors.warning}26` },
    Cliente: { label: 'Cliente', color: colors.accent, bg: colors.accentMuted },
  };

  const statusUserConfig = {
    active: { label: 'Ativo', color: colors.success, bg: `${colors.success}26` },
    inactive: { label: 'Inativo', color: colors.textMuted, bg: `${colors.textMuted}26` },
    pending: { label: 'Pendente', color: colors.warning, bg: `${colors.warning}26` },
  };

  if (loading) {
    return (
      <div>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ background: colors.bgSecondary, borderRadius: 12, padding: 24, border: `1px solid ${colors.borderLight}`, animation: 'pulse 2s ease-in-out infinite', animationDelay: `${i * 0.1}s` }}>
              <div style={{ height: 32, width: '60%', background: colors.bgTertiary, borderRadius: 6, marginBottom: 12 }} />
              <div style={{ height: 28, width: '80%', background: colors.bgTertiary, borderRadius: 4 }} />
            </div>
          ))}
        </div>
        <PlacesLoading rows={5} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        <Tooltip content="Total de usuários cadastrados" position="top">
          <div style={{ background: colors.bgSecondary, borderRadius: 12, padding: 24, border: `1px solid ${colors.borderLight}`, cursor: 'help' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Total de Usuários</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 32, fontWeight: 700, color: colors.text }}>{mockUsers.length}</div>
          </div>
        </Tooltip>
        <Tooltip content="Usuários com status ativo" position="top">
          <div style={{ background: colors.bgSecondary, borderRadius: 12, padding: 24, border: `1px solid ${colors.borderLight}`, cursor: 'help' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Usuários Ativos</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 32, fontWeight: 700, color: colors.text }}>{mockUsers.filter(u => u.status === 'active').length}</div>
          </div>
        </Tooltip>
        <Tooltip content="Soma de todos os pedidos" position="top">
          <div style={{ background: colors.bgSecondary, borderRadius: 12, padding: 24, border: `1px solid ${colors.borderLight}`, cursor: 'help' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Total de Pedidos</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 32, fontWeight: 700, color: colors.text }}>{totalOrders}</div>
          </div>
        </Tooltip>
        <Tooltip content="Revenue total gerado" position="top">
          <div style={{ background: colors.bgSecondary, borderRadius: 12, padding: 24, border: `1px solid ${colors.borderLight}`, cursor: 'help' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Revenue Total</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 32, fontWeight: 700, color: colors.text }}>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(totalSpent)}
            </div>
          </div>
        </Tooltip>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: colors.bgTertiary, borderRadius: 8, border: `1px solid ${colors.borderLight}`, width: 280 }}>
          <IconSearch size={16} color={colors.textMuted} />
          <input
            type="text"
            placeholder="Buscar usuários..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, color: colors.text, width: '100%' }}
          />
        </div>
      </div>

      <div style={{ background: colors.bgSecondary, borderRadius: 12, padding: 24, border: `1px solid ${colors.borderLight}` }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${colors.borderLight}` }}>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase' }}>Usuário</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase' }}>Função</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase' }}>Pedidos</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase' }}>Total Gasto</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase' }}>Status</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase' }}>Desde</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user.id} style={{ borderBottom: `1px solid ${colors.borderLight}`, transition: 'background 0.15s' }}
                onMouseEnter={(e) => e.currentTarget.style.background = colors.bgTertiary}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: colors.bgTertiary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IconUsers size={16} color={colors.textMuted} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 500, color: colors.text }}>{user.name}</div>
                      <div style={{ fontSize: 11, color: colors.textMuted }}>{user.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: colors.textSecondary }}>
                  <span style={{ display: 'inline-block', padding: '4px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, background: roleConfig[user.role as keyof typeof roleConfig]?.bg, color: roleConfig[user.role as keyof typeof roleConfig]?.color }}>
                    {roleConfig[user.role as keyof typeof roleConfig]?.label}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: colors.textSecondary }}>{user.orders}</td>
                <td style={{ padding: '14px 16px', fontSize: 13, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: colors.text }}>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(user.spent)}
                </td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: colors.textSecondary }}>
                  <span style={{ display: 'inline-block', padding: '4px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, background: statusUserConfig[user.status as keyof typeof statusUserConfig]?.bg, color: statusUserConfig[user.status as keyof typeof statusUserConfig]?.color }}>
                    {statusUserConfig[user.status as keyof typeof statusUserConfig]?.label}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: colors.textMuted }}>
                  {new Intl.DateTimeFormat('pt-BR', { month: 'short', year: 'numeric' }).format(new Date(user.joined))}
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