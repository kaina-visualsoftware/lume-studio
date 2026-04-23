import React from 'react';
import { Order, statusConfig, colors } from '../types';
import { IconChevronLeft, IconChevronRight } from './Icons';

interface OrdersTableProps {
  orders: Order[];
  page: number;
  onPageChange: (page: number) => void;
}

const styles = {
  tableContainer: {
    background: colors.bgSecondary,
    borderRadius: 12,
    padding: 24,
    border: `1px solid ${colors.borderLight}`,
  },
  tableTitle: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 16,
    fontWeight: 600,
    color: colors.text,
    marginBottom: 20,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  },
  tableHeader: {
    borderBottom: `1px solid ${colors.borderLight}`,
  },
  tableTh: {
    textAlign: 'left' as const,
    padding: '12px 16px',
    fontSize: 11,
    fontWeight: 600,
    color: colors.textMuted,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  tableRow: {
    transition: 'background 0.15s ease',
  },
  tableTd: {
    padding: '14px 16px',
    fontSize: 13,
    color: colors.textSecondary,
    borderBottom: `1px solid ${colors.borderLight}`,
  },
  statusBadge: {
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: 4,
    fontSize: 11,
    fontWeight: 600,
  },
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
  paginationButton: {
    background: colors.bgTertiary,
    border: 'none',
    borderRadius: 6,
    padding: 6,
    cursor: 'pointer',
  },
  paginationText: {
    fontSize: 12,
    color: colors.textMuted,
  },
};

export const OrdersTable: React.FC<OrdersTableProps> = ({ orders, page, onPageChange }) => {
  const itemsPerPage = 4;
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const paginatedOrders = orders.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  return (
    <div style={styles.tableContainer}>
      <h3 style={styles.tableTitle}>Pedidos Recentes</h3>
      <table style={styles.table}>
        <thead>
          <tr style={styles.tableHeader}>
            <th style={styles.tableTh}>ID</th>
            <th style={styles.tableTh}>Cliente</th>
            <th style={styles.tableTh}>Produto</th>
            <th style={styles.tableTh}>Valor</th>
            <th style={styles.tableTh}>Status</th>
            <th style={styles.tableTh}>Data</th>
          </tr>
        </thead>
        <tbody>
          {paginatedOrders.map((order, index) => (
            <tr
              key={order.id}
              style={{
                ...styles.tableRow,
                background: index % 2 === 0 ? 'transparent' : `${colors.bgTertiary}40`,
              }}
            >
              <td style={styles.tableTd}>{order.id}</td>
              <td style={{ ...styles.tableTd, fontWeight: 500, color: colors.text }}>
                {order.customer}
              </td>
              <td style={styles.tableTd}>{order.product}</td>
              <td
                style={{
                  ...styles.tableTd,
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 600,
                }}
              >
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(order.amount)}
              </td>
              <td style={styles.tableTd}>
                <span
                  style={{
                    ...styles.statusBadge,
                    background: statusConfig[order.status].bg,
                    color: statusConfig[order.status].color,
                  }}
                >
                  {statusConfig[order.status].label}
                </span>
              </td>
              <td style={{ ...styles.tableTd, color: colors.textMuted }}>
                {new Intl.DateTimeFormat('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                }).format(order.date)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={styles.pagination}>
        <button
          style={{
            ...styles.paginationButton,
            opacity: page === 0 ? 0.3 : 1,
          }}
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
        >
          <IconChevronLeft size={14} />
        </button>
        <span style={styles.paginationText}>
          {page + 1} / {totalPages}
        </span>
        <button
          style={{
            ...styles.paginationButton,
            opacity: page === totalPages - 1 ? 0.3 : 1,
          }}
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages - 1}
        >
          <IconChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};