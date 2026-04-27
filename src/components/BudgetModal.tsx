import React, { useState, useEffect } from 'react';
import { ExpenseCategory, darkColors } from '../types';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (budget: BudgetData) => void;
  editingBudget?: BudgetData | null;
  colors?: typeof darkColors;
}

export interface BudgetData {
  id?: string;
  category: ExpenseCategory;
  amount: number;
  month: string;
  year: number;
}

const categories = [
  { value: 'publicidade', label: 'Publicidade' },
  { value: 'desenvolvimento', label: 'Desenvolvimento' },
  { value: 'infraestrutura', label: 'Infraestrutura' },
  { value: 'ferramentas', label: 'Ferramentas' },
  { value: 'licencas', label: 'Licenças' },
  { value: 'salarios', label: 'Salários' },
];

const months = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const currentYear = new Date().getFullYear();

export const BudgetModal: React.FC<BudgetModalProps> = ({ isOpen, onClose, onSave, editingBudget, colors: customColors }) => {
  const colors = customColors || darkColors;
  
  const [form, setForm] = useState<BudgetData>({
    category: 'publicidade',
    amount: 0,
    month: 'Janeiro',
    year: currentYear,
  });

  useEffect(() => {
    if (editingBudget) {
      setForm(editingBudget);
    } else {
      setForm({
        category: 'publicidade',
        amount: 0,
        month: 'Janeiro',
        year: currentYear,
      });
    }
  }, [editingBudget, isOpen]);

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
    },
    modal: {
      width: '100%',
      maxWidth: 450,
      background: colors.bgSecondary,
      borderRadius: 16,
      border: `1px solid ${colors.borderLight}`,
      padding: 24,
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
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>{editingBudget ? 'Editar Orçamento' : 'Novo Orçamento'}</h2>
          <button style={styles.closeBtn} onClick={onClose}>
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Categoria</label>
          <select
            style={styles.select}
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as ExpenseCategory })}
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
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
          <label style={styles.label}>Mês</label>
          <select
            style={styles.select}
            value={form.month}
            onChange={(e) => setForm({ ...form, month: e.target.value })}
          >
            {months.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Ano</label>
          <input
            style={styles.input}
            type="number"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
          />
        </div>

        <div style={styles.actions}>
          <button style={styles.btnCancel} onClick={onClose}>Cancelar</button>
          <button style={styles.btnSave} onClick={handleSubmit}>
            {editingBudget ? 'Salvar Alterações' : 'Criar Orçamento'}
          </button>
        </div>
      </div>
    </div>
  );
};