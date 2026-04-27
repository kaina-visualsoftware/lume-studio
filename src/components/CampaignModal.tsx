import React, { useState, useEffect } from 'react';
import { AdPlatform, AdStatus, darkColors } from '../types';

interface CampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (campaign: CampaignData) => void;
  editingCampaign?: CampaignData | null;
  colors?: typeof darkColors;
}

export interface CampaignData {
  id?: string;
  name: string;
  platform: AdPlatform;
  campaignName: string;
  amount: number;
  budget: number;
  ctr?: number;
  roas?: number;
  status: AdStatus;
  date: Date;
  frequency: 'mensal';
  category: 'publicidade';
}

const platforms: { value: AdPlatform; label: string; color: string }[] = [
  { value: 'google', label: 'Google Ads', color: '#EA4335' },
  { value: 'meta', label: 'Meta (Instagram)', color: '#0081FD' },
  { value: 'tiktok', label: 'TikTok', color: '#FF4890' },
  { value: 'linkedin', label: 'LinkedIn', color: '#0A66C2' },
  { value: 'email', label: 'E-mail', color: '#FF6B35' },
];

export const CampaignModal: React.FC<CampaignModalProps> = ({ isOpen, onClose, onSave, editingCampaign, colors: customColors }) => {
  const colors = customColors || darkColors;
  
  const [form, setForm] = useState<CampaignData>({
    name: '',
    platform: 'google',
    campaignName: '',
    amount: 0,
    budget: 0,
    ctr: 0,
    roas: 0,
    status: 'ativa',
    date: new Date(),
    frequency: 'mensal',
    category: 'publicidade',
  });

  useEffect(() => {
    if (editingCampaign) {
      setForm(editingCampaign);
    } else {
      setForm({
        name: '',
        platform: 'google',
        campaignName: '',
        amount: 0,
        budget: 0,
        ctr: 0,
        roas: 0,
        status: 'ativa',
        date: new Date(),
        frequency: 'mensal',
        category: 'publicidade',
      });
    }
  }, [editingCampaign, isOpen]);

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
      maxWidth: 500,
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
    row: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16,
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
      background: colors.accent,
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
          <h2 style={styles.title}>{editingCampaign ? 'Editar Campanha' : 'Nova Campanha'}</h2>
          <button style={styles.closeBtn} onClick={onClose}>
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Plataforma</label>
          <select
            style={styles.select}
            value={form.platform}
            onChange={(e) => setForm({ ...form, platform: e.target.value as AdPlatform })}
          >
            {platforms.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Nome da Campanha</label>
          <input
            style={styles.input}
            placeholder="ex: Campanha Primavera 2026"
            value={form.campaignName}
            onChange={(e) => setForm({ ...form, campaignName: e.target.value, name: e.target.value })}
          />
        </div>

        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>Budget (R$)</label>
            <input
              style={styles.input}
              type="number"
              placeholder="0,00"
              value={form.budget || ''}
              onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Gasto Real (R$)</label>
            <input
              style={styles.input}
              type="number"
              placeholder="0,00"
              value={form.amount || ''}
              onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
            />
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>CTR (%)</label>
            <input
              style={styles.input}
              type="number"
              step="0.1"
              placeholder="0.0"
              value={form.ctr || ''}
              onChange={(e) => setForm({ ...form, ctr: Number(e.target.value) })}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>ROAS</label>
            <input
              style={styles.input}
              type="number"
              step="0.1"
              placeholder="0.0"
              value={form.roas || ''}
              onChange={(e) => setForm({ ...form, roas: Number(e.target.value) })}
            />
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Status</label>
          <select
            style={styles.select}
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as AdStatus })}
          >
            <option value="ativa">Ativa</option>
            <option value="pausada">Pausada</option>
            <option value="finalizada">Finalizada</option>
          </select>
        </div>

        <div style={styles.actions}>
          <button style={styles.btnCancel} onClick={onClose}>Cancelar</button>
          <button style={styles.btnSave} onClick={handleSubmit}>
            {editingCampaign ? 'Salvar Alterações' : 'Criar Campanha'}
          </button>
        </div>
      </div>
    </div>
  );
};