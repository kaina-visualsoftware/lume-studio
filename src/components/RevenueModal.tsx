import React, { useState, useEffect } from 'react';
import { darkColors } from '../types';

interface RevenueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (revenue: RevenueData) => void;
  editingRevenue?: RevenueData | null;
  colors?: typeof darkColors;
}

export interface RevenueData {
  id?: string;
  name: string;
  amount: number;
  date: Date;
  category: 'vendas' | 'servico' | 'assinatura' | 'outros';
}

const categories = [
  { value: 'vendas', label: 'Vendas' },
  { value: 'servico', label: 'Serviço' },
  { value: 'assinatura', label: 'Assinatura' },
  { value: 'outros', label: 'Outros' },
];

export const RevenueModal: React.FC<RevenueModalProps> = ({ isOpen, onClose, onSave, editingRevenue, colors: customColors }) => {
  const colors = customColors || darkColors;
  
  const [form, setForm] = useState<RevenueData>({
    name: '',
    amount: 0,
    date: new Date(),
    category: 'vendas',
  });

  useEffect(() => {
    if (editingRevenue) {
      setForm(editingRevenue);
    } else {
      setForm({
        name: '',
        amount: 0,
        date: new Date(),
        category: 'vendas',
      });
    }
  }, [editingRevenue, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSave(form);
    onClose();
  };

  const styles = {
    overlay: {
      position: 'fixed' as const,
      inset: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.2s ease-out',
    },
    modal: {
      width: '100%',
      maxWidth: 450,
      background: colors.bgSecondary,
      borderRadius: 16,
      border: `1px solid ${colors.borderLight}`,
      padding: 24,
      animation: 'scaleIn 0.2s ease-out',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
    },
    title: {
      fontSize: 18,
      fontWeight: 600,
      color: colors.text,
    },
    closeBtn: {
      background: 'transparent',
      border: 'none',
      color: colors.textMuted,
      cursor: 'pointer',
      padding: 4,
    },
    field: {
      marginBottom: 16,
    },
    label: {
      display: 'block',
      fontSize: 13,
      fontWeight: 500,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    input: {
      width: '100%',
      padding: '12px 14px',
      background: colors.bgTertiary,
      border: `1px solid ${colors.border}`,
      borderRadius: 8,
      fontSize: 14,
      color: colors.text,
      outline: 'none',
    },
    select: {
      width: '100%',
      padding: '12px 14px',
      background: colors.bgTertiary,
      border: `1px solid ${colors.border}`,
      borderRadius: 8,
      fontSize: 14,
      color: colors.text,
      outline: 'none',
      cursor: 'pointer',
    },
    actions: {
      display: 'flex',
      gap: 12,
      justifyContent: 'flex-end',
      marginTop: 24,
    },
    btnCancel: {
      padding: '12px 20px',
      borderRadius: 8,
      fontSize: 14,
      fontWeight: 600,
      cursor: 'pointer',
      border: 'none',
      background: colors.bgTertiary,
      color: colors.textSecondary,
    },
    btnSave: {
      padding: '12px 20px',
      borderRadius: 8,
      fontSize: 14,
      fontWeight: 600,
      cursor: 'pointer',
      border: 'none',
      background: colors.success,
      color: '#FFFFFF',
    },
  };

  return (
    <div style={styles.overlay}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>{editingRevenue ? 'Editar Receita' : 'Nova Receita'}</h2>
          <button style={styles.closeBtn} onClick={onClose}>
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Nome / Descrição</label>
          <input
            style={styles.input}
            placeholder="ex: Vendas Abril 2026"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Valor (R$)</label>
          <input
            style={styles.input}
            type="number"
            placeholder="0,00"
            value={form.amount || ''}
            onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Data</label>
          <input
            style={styles.input}
            type="date"
            value={form.date.toISOString().split('T')[0]}
            onChange={(e) => setForm({ ...form, date: new Date(e.target.value) })}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Categoria</label>
          <select
            style={styles.select}
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as RevenueData['category'] })}
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        <div style={styles.actions}>
          <button style={styles.btnCancel} onClick={onClose}>Cancelar</button>
          <button style={styles.btnSave} onClick={handleSubmit}>
            {editingRevenue ? 'Salvar Alterações' : 'Cadastrar Receita'}
          </button>
        </div>
      </div>
    </div>
  );
};