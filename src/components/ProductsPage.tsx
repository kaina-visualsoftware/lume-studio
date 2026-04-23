import React, { useState, useEffect } from 'react';
import { useTheme } from './Theme';
import { Tooltip } from './Tooltip';
import { PlacesLoading } from './PlacesLoading';
import { darkColors, lightColors, TopProduct } from '../types';
import { IconSearch, IconChevronLeft, IconChevronRight, IconProducts } from './Icons';

interface ProductsPageProps {
  dateRange: 'today' | '7d' | '30d' | 'custom';
}

const mockProducts: (TopProduct & { id: number; sku: string; price: number; stock: number; category: string })[] = [
  { id: 1, name: 'Edição Limitada', sales: 1247, percentage: 32.4, sku: 'EL-001', price: 450, stock: 23, category: 'Especial' },
  { id: 2, name: 'Coleção Primavera', sales: 892, percentage: 23.2, sku: 'CP-002', price: 280, stock: 156, category: 'Sazonal' },
  { id: 3, name: 'Série Premium', sales: 654, percentage: 17.0, sku: 'SP-003', price: 520, stock: 45, category: 'Premium' },
  { id: 4, name: 'Coleção Inverno', sales: 543, percentage: 14.1, sku: 'CI-004', price: 320, stock: 89, category: 'Sazonal' },
  { id: 5, name: 'Edição Especial', sales: 511, percentage: 13.3, sku: 'EE-005', price: 680, stock: 12, category: 'Especial' },
  { id: 6, name: 'Série Classic', sales: 234, percentage: 6.1, sku: 'SC-006', price: 180, stock: 234, category: 'Classic' },
  { id: 7, name: 'Coleção Verão', sales: 189, percentage: 4.9, sku: 'CV-007', price: 250, stock: 167, category: 'Sazonal' },
  { id: 8, name: 'Acessórios', sales: 156, percentage: 4.1, sku: 'AC-008', price: 89, stock: 456, category: 'Acessórios' },
];

export const ProductsPage: React.FC<ProductsPageProps> = ({ dateRange: _dateRange }) => {
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

  const totalPages = Math.ceil(mockProducts.length / itemsPerPage);
  
  const filteredProducts = mockProducts.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );
  
  const paginatedProducts = filteredProducts.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
  const totalRevenue = mockProducts.reduce((acc, p) => acc + (p.sales * p.price), 0);
  const totalStock = mockProducts.reduce((acc, p) => acc + p.stock, 0);

  const categoryConfig: Record<string, { label: string; color: string; bg: string }> = {
    Especial: { label: 'Especial', color: colors.warning, bg: `${colors.warning}26` },
    Sazonal: { label: 'Sazonal', color: colors.accent, bg: colors.accentMuted },
    Premium: { label: 'Premium', color: colors.info, bg: `${colors.info}26` },
    Classic: { label: 'Classic', color: colors.textSecondary, bg: `${colors.textSecondary}26` },
    Acessórios: { label: 'Acessórios', color: colors.success, bg: `${colors.success}26` },
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
        <Tooltip content="Quantidade total de produtos" position="top">
          <div style={{ background: colors.bgSecondary, borderRadius: 12, padding: 24, border: `1px solid ${colors.borderLight}`, cursor: 'help' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Total de Produtos</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 32, fontWeight: 700, color: colors.text }}>{mockProducts.length}</div>
          </div>
        </Tooltip>
        <Tooltip content="Revenue total dos produtos" position="top">
          <div style={{ background: colors.bgSecondary, borderRadius: 12, padding: 24, border: `1px solid ${colors.borderLight}`, cursor: 'help' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Revenue Total</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 32, fontWeight: 700, color: colors.text }}>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(totalRevenue)}
            </div>
          </div>
        </Tooltip>
        <Tooltip content="Unidades em estoque" position="top">
          <div style={{ background: colors.bgSecondary, borderRadius: 12, padding: 24, border: `1px solid ${colors.borderLight}`, cursor: 'help' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Em Estoque</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 32, fontWeight: 700, color: colors.text }}>{totalStock}</div>
          </div>
        </Tooltip>
        <Tooltip content="Total de vendas realizadas" position="top">
          <div style={{ background: colors.bgSecondary, borderRadius: 12, padding: 24, border: `1px solid ${colors.borderLight}`, cursor: 'help' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Total de Vendas</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 32, fontWeight: 700, color: colors.text }}>5.326</div>
          </div>
        </Tooltip>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: colors.bgTertiary, borderRadius: 8, border: `1px solid ${colors.borderLight}`, width: 280 }}>
          <IconSearch size={16} color={colors.textMuted} />
          <input
            type="text"
            placeholder="Buscar produtos..."
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
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase' }}>Produto</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase' }}>Categoria</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase' }}>Preço</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase' }}>Vendas</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase' }}>Estoque</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase' }}>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product) => (
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
                <td style={{ padding: '14px 16px', fontSize: 13, color: colors.textSecondary }}>
                  <span style={{ display: 'inline-block', padding: '4px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, background: categoryConfig[product.category]?.bg, color: categoryConfig[product.category]?.color }}>
                    {categoryConfig[product.category]?.label}
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