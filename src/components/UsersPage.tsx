import React, { useState, useEffect } from 'react';
import { useTheme } from './Theme';
import { PlacesLoading } from './PlacesLoading';
import { darkColors, lightColors } from '../types';
import { Search, ChevronLeft, ChevronRight, User, ArrowUp, ArrowDown } from 'lucide-react';
import { useBreakpoint } from '../hooks';
import KPICards from './KPICards';
import MultiSelectFilter from './MultiSelectFilter';

interface UsersPageProps {
  dateRange: 'today' | '7d' | '30d' | 'custom';
}

interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'VIP' | 'Cliente';
  orders: number;
  spent: number;
  status: 'active' | 'inactive' | 'pending';
  joined: string;
}

const mockUsers: User[] = [
  { id: 1, name: 'Ana Carolina Silva', email: 'ana@email.com', role: 'Cliente', orders: 12, spent: 15420, status: 'active', joined: '2025-08-15' },
  { id: 2, name: 'Roberto Ferreira', email: 'roberto@email.com', role: 'Cliente', orders: 8, spent: 8920, status: 'active', joined: '2025-09-22' },
  { id: 3, name: 'Carla Mendes', email: 'carla@email.com', role: 'VIP', orders: 24, spent: 32100, status: 'active', joined: '2025-03-10' },
  { id: 4, name: 'Paulo Henrique', email: 'paulo@email.com', role: 'Cliente', orders: 3, spent: 2450, status: 'inactive', joined: '2025-11-05' },
  { id: 5, name: 'Juliana Costa', email: 'juliana@email.com', role: 'VIP', orders: 18, spent: 24500, status: 'active', joined: '2025-05-20' },
  { id: 6, name: 'Marcos Vinícius', email: 'marcos@email.com', role: 'Admin', orders: 0, spent: 0, status: 'active', joined: '2025-01-01' },
  { id: 7, name: 'Beatriz Rodrigues', email: 'beatriz@email.com', role: 'Cliente', orders: 6, spent: 4890, status: 'active', joined: '2025-10-12' },
  { id: 8, name: 'Lucas Almeida', email: 'lucas@email.com', role: 'Cliente', orders: 2, spent: 1850, status: 'pending', joined: '2026-01-15' },
  { id: 9, name: 'Fernanda Silva', email: 'fernanda@email.com', role: 'Cliente', orders: 15, spent: 12800, status: 'active', joined: '2025-07-03' },
  { id: 10, name: 'Gabriel Santos', email: 'gabriel@email.com', role: 'VIP', orders: 31, spent: 45200, status: 'active', joined: '2024-12-10' },
  { id: 11, name: 'Carla Oliveira', email: 'carla.oliveira@email.com', role: 'Cliente', orders: 5, spent: 3200, status: 'inactive', joined: '2025-06-22' },
  { id: 12, name: 'Ricardo Souza', email: 'ricardo@email.com', role: 'Admin', orders: 0, spent: 0, status: 'active', joined: '2025-02-14' },
];

type SortField = 'name' | 'role' | 'orders' | 'spent' | 'status' | 'joined';
type SortDir = 'asc' | 'desc';

const fetchUsers = async (page: number, search: string, roleFilter: string[], statusFilter: string[], sortField: SortField, sortDir: SortDir): Promise<{ users: User[]; total: number }> => {
  await new Promise(r => setTimeout(r, 500));
  
  let filtered = mockUsers.filter(u => {
    const matchesSearch = search === '' || 
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter.includes('all') || roleFilter.includes(u.role);
    const matchesStatus = statusFilter.includes('all') || statusFilter.includes(u.status);
    return matchesSearch && matchesRole && matchesStatus;
  });

  filtered.sort((a, b) => {
    let cmp = 0;
    if (sortField === 'name') cmp = a.name.localeCompare(b.name);
    else if (sortField === 'role') cmp = a.role.localeCompare(b.role);
    else if (sortField === 'orders') cmp = a.orders - b.orders;
    else if (sortField === 'spent') cmp = a.spent - b.spent;
    else if (sortField === 'status') cmp = a.status.localeCompare(b.status);
    else if (sortField === 'joined') cmp = new Date(a.joined).getTime() - new Date(b.joined).getTime();
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const total = filtered.length;
  const pageSize = 5;
  const paginated = filtered.slice(page * pageSize, (page + 1) * pageSize);
  
  return { users: paginated, total };
};

export const UsersPage: React.FC<UsersPageProps> = ({ dateRange: _dateRange }) => {
  const { theme } = useTheme();
  const colors = theme === 'dark' ? darkColors : lightColors;
  const bp = useBreakpoint();
  const isMobile = bp === 'mobile';
  
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string[]>(['all']);
  const [statusFilter, setStatusFilter] = useState<string[]>(['all']);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  
  const roleOptions = [
    { value: 'Admin', label: 'Admin' },
    { value: 'VIP', label: 'VIP' },
    { value: 'Cliente', label: 'Cliente' },
  ];
  const statusOptions = [
    { value: 'active', label: 'Ativo' },
    { value: 'inactive', label: 'Inativo' },
    { value: 'pending', label: 'Pendente' },
  ];
  
  useEffect(() => {
    setLoading(true);
    fetchUsers(page, search, roleFilter, statusFilter, sortField, sortDir).then(result => {
      setUsers(result.users);
      setTotal(result.total);
      setLoading(false);
    });
  }, [page, search, roleFilter, statusFilter, sortField, sortDir]);

  const totalPages = Math.ceil(total / 5);
  const totalOrders = mockUsers.reduce((acc, u) => acc + u.orders, 0);
  const totalSpent = mockUsers.reduce((acc, u) => acc + u.spent, 0);

  const usersCards = [
    { id: 'users', label: 'TOTAL DE USUÁRIOS', value: mockUsers.length, unit: 'number' as const, variation: 8.1 },
    { id: 'active', label: 'USUÁRIOS ATIVOS', value: mockUsers.filter(u => u.status === 'active').length, unit: 'number' as const, variation: 5.2 },
    { id: 'orders', label: 'TOTAL DE PEDIDOS', value: totalOrders, unit: 'number' as const, variation: 12.4 },
    { id: 'revenue', label: 'REVENUE TOTAL', value: totalSpent, unit: 'currency' as const, variation: 8.7 },
  ];

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
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

  const roleConfig = {
    Admin: { label: 'Admin', color: colors.error, bg: `${colors.error}26` },
    VIP: { label: 'VIP', color: colors.warning, bg: `${colors.warning}26` },
    Cliente: { label: 'Cliente', color: colors.accent, bg: colors.accentMuted },
  };

  const statusConfig = {
    active: { label: 'Ativo', color: colors.success, bg: `${colors.success}26` },
    inactive: { label: 'Inativo', color: colors.textMuted, bg: `${colors.textMuted}26` },
    pending: { label: 'Pendente', color: colors.warning, bg: `${colors.warning}26` },
  };

  return (
    <div style={{ padding: isMobile ? 16 : 32, flex: 1 }}>
      <KPICards cards={usersCards} loading={loading} />

      <div style={{ display: 'flex', gap: 12, marginTop: 24, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <MultiSelectFilter
          label="Função"
          options={roleOptions}
          selected={roleFilter}
          onChange={(values) => { setRoleFilter(values); setPage(0); }}
          colors={colors}
        />
        <MultiSelectFilter
          label="Status"
          options={statusOptions}
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
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${colors.borderLight}` }}>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: colors.textMuted, cursor: 'pointer' }} onClick={() => handleSort('name')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Usuário <SortIcon field="name" /></div>
                </th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: colors.textMuted, cursor: 'pointer' }} onClick={() => handleSort('role')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Função <SortIcon field="role" /></div>
                </th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: colors.textMuted, cursor: 'pointer' }} onClick={() => handleSort('orders')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Pedidos <SortIcon field="orders" /></div>
                </th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: colors.textMuted, cursor: 'pointer' }} onClick={() => handleSort('spent')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Total Gasto <SortIcon field="spent" /></div>
                </th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: colors.textMuted, cursor: 'pointer' }} onClick={() => handleSort('status')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Status <SortIcon field="status" /></div>
                </th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: colors.textMuted, cursor: 'pointer' }} onClick={() => handleSort('joined')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Desde <SortIcon field="joined" /></div>
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} style={{ borderBottom: `1px solid ${colors.borderLight}`, transition: 'background 0.15s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = colors.bgTertiary}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: colors.bgTertiary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={16} color={colors.textMuted} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 500, color: colors.text }}>{user.name}</div>
                        <div style={{ fontSize: 11, color: colors.textMuted }}>{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ display: 'inline-block', padding: '4px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, background: roleConfig[user.role]?.bg, color: roleConfig[user.role]?.color }}>
                      {roleConfig[user.role]?.label}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: colors.textSecondary }}>{user.orders}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: colors.text }}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(user.spent)}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ display: 'inline-block', padding: '4px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, background: statusConfig[user.status]?.bg, color: statusConfig[user.status]?.color }}>
                      {statusConfig[user.status]?.label}
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