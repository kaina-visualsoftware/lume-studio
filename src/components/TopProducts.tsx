import React from 'react';
import { TopProduct, colors } from '../types';

interface TopProductsChartProps {
  products: TopProduct[];
}

const styles = {
  topProductsContainer: {
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
  productRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  productRank: {
    fontSize: 12,
    fontWeight: 700,
    color: colors.accentHover,
    width: 16,
  },
  productInfo: {
    flex: 1,
  },
  productHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  productName: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  productSales: {
    fontSize: 11,
    color: colors.textMuted,
  },
  productBarBg: {
    height: 4,
    background: colors.bgTertiary,
    borderRadius: 2,
    overflow: 'hidden',
  },
  productBar: {
    height: '100%',
    background: `linear-gradient(90deg, ${colors.accent}, ${colors.accentHover})`,
    borderRadius: 2,
  },
  productPercentage: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
    display: 'block',
  },
};

export const TopProductsChart: React.FC<TopProductsChartProps> = ({ products }) => {
  const maxSales = Math.max(...products.map((p) => p.sales));

  return (
    <div style={styles.topProductsContainer}>
      <h3 style={styles.sectionTitle}>Produtos Mais Vendidos</h3>
      {products.map((product, index) => (
        <div key={product.name} style={styles.productRow}>
          <span style={styles.productRank}>{index + 1}</span>
          <div style={styles.productInfo}>
            <div style={styles.productHeader}>
              <span style={styles.productName}>{product.name}</span>
              <span style={styles.productSales}>{product.sales}</span>
            </div>
            <div style={styles.productBarBg}>
              <div
                style={{
                  ...styles.productBar,
                  width: `${(product.sales / maxSales) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};