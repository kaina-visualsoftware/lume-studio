import React, { useState, useEffect } from 'react';
import { useTheme } from './Theme';
import { Tooltip } from './Tooltip';
import { PlacesLoading } from './PlacesLoading';
import { darkColors, lightColors, TopProduct } from '../types';
import { IconSearch, IconChevronLeft, IconChevronRight, IconProducts, IconArrowUp, IconArrowDown } from './Icons';
import { useBreakpoint } from '../hooks';
import KPICards from './KPICards';
import MultiSelectFilter from './MultiSelectFilter';

interface ProductsPageProps {
  dateRange: 'today' | '7d' | '30d' | 'custom';
}

interface Product extends TopProduct {
  id: number;
  sku: string;
  price: number;
  stock: number;
  category: string;
}

const mockProducts: Product[] = [
  { id: 1, name: 'Edição Limitada', sales: 1247, percentage: 32.4, sku: 'EL-001', price: 450, stock: 23, category: 'Especial' },
  { id: 2, name: 'Coleção Primavera', sales: 892, percentage: 23.2, sku: 'CP-002', price: 280, stock: 156, category: 'Sazonal' },
  { id: 3, name: 'Série Premium', sales: 654, percentage: 17.0, sku: 'SP-003', price: 520, stock: 45, category: 'Premium' },
  { id: 4, name: 'Coleção Inverno', sales: 543, percentage: 14.1, sku: 'CI-004', price: 320, stock: 89, category: 'Sazonal' },
  { id: 5, name: 'Edição Especial', sales: 511, percentage: 13.3, sku: 'EE-005', price: 680, stock: 12, category: 'Especial' },
  { id: 6, name: 'Série Classic', sales: 234, percentage: 6.1, sku: 'SC-006', price: 180, stock: 234, category: 'Classic' },
  { id: 7, name: 'Coleção Verão', sales: 189, percentage: 4.9, sku: 'CV-007', price: 250, stock: 167, category: 'Sazonal' },
  { id: 8, name: 'Acessórios', sales: 156, percentage: 4.1, sku: 'AC-008', price: 89, stock: 456, category: 'Acessórios' },
  { id: 9, name: 'Kit Básico', sales: 98, percentage: 2.5, sku: 'KB-009', price: 120, stock: 320, category: 'Basic' },
  { id: 10, name: 'Edição Gold', sales: 45, percentage: 1.2, sku: 'EG-010', price: 890, stock: 8, category: 'Especial' },
];

const fetchProducts = async (page: number, search: string, categoryFilter: string[], sortField: string, sortDir: 'asc' | 'desc'): Promise<{ products: Product[]; total: number }> => {
  await new Promise(r => setTimeout(r, 500));
  
  let filtered = mockProducts.filter(p => {
    const matchesSearch = search === '' || 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter.includes('all') || categoryFilter.includes(p.category);
    return matchesSearch && matchesCategory;
  });

  filtered.sort((a, b) => {
    let cmp = 0;
    if (sortField === 'name') cmp = a.name.localeCompare(b.name);
    else if (sortField === 'price') cmp = a.price - b.price;
    else if (sortField === 'sales') cmp = a.sales - b.sales;
    else if (sortField === 'stock') cmp = a.stock - b.stock;
    else if (sortField === 'revenue') cmp = (a.sales * a.price) - (b.sales * b.price);
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const total = filtered.length;
  const pageSize = 5;
  const paginated = filtered.slice(page * pageSize, (page + 1) * pageSize);
  
  return { products: paginated, total };
};

type SortField = 'name' | 'price' | 'sales' | 'stock' | 'revenue';

export const ProductsPage: React.FC<ProductsPageProps> = ({ dateRange: _dateRange }) => {
  const { theme } = useTheme();
  const colors = theme === 'dark' ? darkColors : lightColors;
  const bp = useBreakpoint();
  const isMobile = bp === 'mobile';
  
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string[]>(['all']);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  
  const categories = [
    { value: 'Especial', label: 'Especial' },
    { value: 'Sazonal', label: 'Sazonal' },
    { value: 'Premium', label: 'Premium' },
    { value: 'Classic', label: 'Classic' },
    { value: 'Acessórios', label: 'Acessórios' },
    { value: 'Basic', label: 'Básico' },
  ];
  
  useEffect(() => {
    setLoading(true);
    fetchProducts(page, search, categoryFilter, sortField, sortDir).then(result => {
      setProducts(result.products);
      setTotal(result.total);
      setLoading(false);
    });
  }, [page, search, categoryFilter, sortField, sortDir]);

  const totalPages = Math.ceil(total / 5);
  const totalRevenue = mockProducts.reduce((acc, p) => acc + (p.sales * p.price), 0);
  const totalStock = mockProducts.reduce((acc, p) => acc + p.stock, 0);

  const productsCards = [
    { id: 'products', label: 'TOTAL DE PRODUTOS', value: mockProducts.length, unit: 'number' as const, variation: 5.3 },
    { id: 'revenue', label: 'REVENUE TOTAL', value: totalRevenue, unit: 'currency' as const, variation: 12.4 },
    { id: 'stock', label: 'EM ESTOQUE', value: totalStock, unit: 'number' as const, variation: -2.1 },
    { id: 'sales', label: 'TOTAL DE VENDAS', value: 4879, unit: 'number' as const, variation: 23.7 },
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
    return sortDir === 'asc' ? <IconArrowUp size={12} /> : <IconArrowDown size={12} />;
  };

  const categoryConfig: Record<string, { label: string; color: string; bg: string }> = {
    Especial: { label: 'Especial', color: colors.warning, bg: `${colors.warning}26` },
    Sazonal: { label: 'Sazonal', color: colors.accent, bg: colors.accentMuted },
    Premium: { label: 'Premium', color: colors.info, bg: `${colors.info}26` },
    Classic: { label: 'Classic', color: colors.textSecondary, bg: `${colors.textSecondary}26` },
    Acessórios: { label: 'Acessórios', color: colors.success, bg: `${colors.success}26` },
    Basic: { label: 'Básico', color: colors.textMuted, bg: `${colors.textMuted}26` },
  };

  return (
    <div style={{ padding: isMobile ? 16 : 32, flex: 1 }}>
      <KPICards cards={productsCards} loading={loading} />

      <div style={{ display: 'flex', gap: 12, marginTop: 24, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <MultiSelectFilter
          label="Categoria"
          options={categories}
          selected={categoryFilter}
          onChange={(values) => { setCategoryFilter(values); setPage(0); }}
          colors={colors}
        />
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', background: colors.bgTertiary, borderRadius: 8, border: `1px solid ${colors.borderLight}`, width: 260 }}>
          <IconSearch size={16} color={colors.textMuted} />
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
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: colors.textMuted, cursor: 'pointer' }} onClick={() => handleSort('name')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Produto <SortIcon field="name" /></div>
                </th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: colors.textMuted }}>Categoria</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: colors.textMuted, cursor: 'pointer' }} onClick={() => handleSort('price')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Preço <SortIcon field="price" /></div>
                </th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: colors.textMuted, cursor: 'pointer' }} onClick={() => handleSort('sales')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Vendas <SortIcon field="sales" /></div>
                </th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: colors.textMuted, cursor: 'pointer' }} onClick={() => handleSort('stock')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Estoque <SortIcon field="stock" /></div>
                </th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: colors.textMuted, cursor: 'pointer' }} onClick={() => handleSort('revenue')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Revenue <SortIcon field="revenue" /></div>
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} style={{ borderBottom: `1px solid ${colors.borderLight}`, transition: 'background 0.15s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = colors.bgTertiary}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 8, background: colors.bgTertiary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconProducts size={20} color={colors.textMuted} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 500, color: colors.text }}>{product.name}</div>
                        <div style={{ fontSize: 11, color: colors.textMuted }}>{product.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ display: 'inline-block', padding: '4px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, background: categoryConfig[product.category]?.bg || colors.accentMuted, color: categoryConfig[product.category]?.color || colors.accent }}>
                      {categoryConfig[product.category]?.label || product.category}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: colors.text }}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: colors.textSecondary }}>{product.sales}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: product.stock < 20 ? colors.error : product.stock < 50 ? colors.warning : colors.success }}>
                    <Tooltip content={product.stock < 20 ? 'Estoque baixo!' : product.stock < 50 ? 'Estoque médio' : 'Em estoque'} position="left">
                      <span>{product.stock}</span>
                    </Tooltip>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: colors.success }}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.sales * product.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, marginTop: 16 }}>
            <span style={{ fontSize: 12, color: colors.textMuted }}>{total} registros</span>
            <button style={{ background: colors.bgTertiary, border: 'none', borderRadius: 6, padding: 6, cursor: 'pointer', opacity: page === 0 ? 0.3 : 1 }} onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
              <IconChevronLeft size={14} />
            </button>
            <span style={{ fontSize: 12, color: colors.textMuted }}>{page + 1} / {totalPages || 1}</span>
            <button style={{ background: colors.bgTertiary, border: 'none', borderRadius: 6, padding: 6, cursor: 'pointer', opacity: page >= totalPages - 1 ? 0.3 : 1 }} onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>
              <IconChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};