import React, { useState } from 'react';
import { darkColors, Expense, AdPlatform, AdStatus } from '../types';
import { useFinance } from '../context/FinanceContext';
import { useCountUp, useBreakpoint } from '../hooks';
import { getCategoryColor, getAdPlatformLabel, getAdPlatformColor, getStatusColor, getRoleLabel, getRoleColor } from '../data/finance';
import { Search, Plus, Edit, Trash2, Pause, Play, AlertTriangle } from 'lucide-react';
import { useToast } from './Toast';
import { CampaignModal, CampaignData } from './CampaignModal';
import { RevenueModal, RevenueData as RevenueCampaignData } from './RevenueModal';
import { BudgetModal, BudgetData } from './BudgetModal';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

type TabType = 'overview' | 'ads' | 'dev' | 'team' | 'revenue' | 'budgets';

const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const FinancePage: React.FC = () => {
  const { expenses, teamMembers, summary, addExpense, updateExpense, deleteExpense, updateExpenseStatus, revenues, addRevenue, deleteRevenue, updateRevenue: updateRevenueEntry, budgets, addBudget, updateBudget, deleteBudget, alerts } = useFinance();
  const { showToast } = useToast();
  const bp = useBreakpoint();
  const isMobile = bp === 'mobile';
  const isTablet = bp === 'tablet';
  
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<CampaignData | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [revenueModalOpen, setRevenueModalOpen] = useState(false);
  const [editingRevenue, setEditingRevenue] = useState<RevenueCampaignData | null>(null);
  const [confirmDeleteRevenue, setConfirmDeleteRevenue] = useState<string | null>(null);
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetData | null>(null);
  const [confirmDeleteBudget, setConfirmDeleteBudget] = useState<string | null>(null);
  const colors = darkColors;

  const adExpenses = expenses.filter(e => e.category === 'publicidade');
  const devExpenses = expenses.filter(e => ['infraestrutura', 'ferramentas', 'licencas'].includes(e.category));
  const teamCost = teamMembers.reduce((sum, m) => sum + m.salary, 0);
  const avgRoas = adExpenses.length > 0 ? adExpenses.reduce((sum, e) => sum + (e.roas || 0), 0) / adExpenses.length : 0;
  const totalAdsSpent = adExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalAdsBudget = adExpenses.reduce((sum, e) => sum + (e.budget || 0), 0);

  const animatedExpenses = useCountUp(summary.totalExpenses, 1500);
  const animatedRevenue = useCountUp(summary.totalRevenue, 1800);
  const animatedTeamCost = useCountUp(teamCost, 2000);
  const animatedAdsSpent = useCountUp(totalAdsSpent, 1200);
  const animatedAdsBudget = useCountUp(totalAdsBudget, 1400);
  const bestPlatform = adExpenses.length > 0 
    ? adExpenses.reduce((best, e) => (e.roas || 0) > (best.roas || 0) ? e : best)
    : null;

  const totalRevenue = revenues.reduce((sum, r) => sum + r.amount, 0);
  const currentMonthRevenue = revenues
    .filter(r => {
      const now = new Date();
      return r.date.getMonth() === now.getMonth() && r.date.getFullYear() === now.getFullYear();
    })
    .reduce((sum, r) => sum + r.amount, 0);
  const avgRevenue = revenues.length > 0 ? totalRevenue / revenues.length : 0;
  const revenueCount = revenues.length;

  const categoryData = [
    { name: 'Google Ads', value: adExpenses.filter(e => e.platform === 'google').reduce((s, e) => s + e.amount, 0), color: '#EA4335' },
    { name: 'Meta Ads', value: adExpenses.filter(e => e.platform === 'meta').reduce((s, e) => s + e.amount, 0), color: '#0081FD' },
    { name: 'TikTok', value: adExpenses.filter(e => e.platform === 'tiktok').reduce((s, e) => s + e.amount, 0), color: '#FF4890' },
    { name: 'LinkedIn', value: adExpenses.filter(e => e.platform === 'linkedin').reduce((s, e) => s + e.amount, 0), color: '#0A66C2' },
    { name: 'Email', value: adExpenses.filter(e => e.platform === 'email').reduce((s, e) => s + e.amount, 0), color: '#FF6B35' },
    { name: 'Infraestrutura', value: devExpenses.filter(e => e.category === 'infraestrutura').reduce((s, e) => s + e.amount, 0), color: '#10B981' },
    { name: 'Ferramentas', value: devExpenses.filter(e => e.category === 'ferramentas').reduce((s, e) => s + e.amount, 0), color: '#F59E0B' },
    { name: 'Licenças', value: devExpenses.filter(e => e.category === 'licencas').reduce((s, e) => s + e.amount, 0), color: '#EC4899' },
  ].filter(d => d.value > 0);

  const monthlyExpensesData = [
    { month: 'Jan', publicidade: 8200, desenvolvimento: 1800 },
    { month: 'Fev', publicidade: 9100, desenvolvimento: 1850 },
    { month: 'Mar', publicidade: 8800, desenvolvimento: 1900 },
    { month: 'Abr', publicidade: totalAdsSpent, desenvolvimento: devExpenses.reduce((s, e) => s + e.amount, 0) },
  ];

  const styles = {
    container: { padding: 32, flex: 1, background: colors.bg } as React.CSSProperties,
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 } as React.CSSProperties,
    title: { fontSize: 24, fontWeight: 700, color: colors.text } as React.CSSProperties,
    subtitle: { fontSize: 14, color: colors.textMuted, marginTop: 4 } as React.CSSProperties,
    tabs: { display: 'flex', gap: 1, marginBottom: 24, background: colors.bgTertiary, padding: 4, borderRadius: 10, width: 'fit-content' } as React.CSSProperties,
    tab: { padding: '10px 20px', borderRadius: 8, border: 'none', background: 'transparent', color: colors.textMuted, fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s' } as React.CSSProperties,
    tabActive: { background: colors.accent, color: '#FFFFFF' } as React.CSSProperties,
    grid4: { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 20, marginBottom: 32 } as React.CSSProperties,
    kpiCard: { background: colors.bgSecondary, borderRadius: 12, padding: 20, border: `1px solid ${colors.border}` } as React.CSSProperties,
    kpiLabel: { fontSize: 13, color: colors.textMuted, marginBottom: 8 } as React.CSSProperties,
    kpiValue: { fontSize: 28, fontWeight: 700, color: colors.text } as React.CSSProperties,
    kpiSub: { fontSize: 12, color: colors.success, marginTop: 8 } as React.CSSProperties,
    section: { background: colors.bgSecondary, borderRadius: 12, padding: 24, marginBottom: 24, border: `1px solid ${colors.border}` } as React.CSSProperties,
    sectionTitle: { fontSize: 16, fontWeight: 600, color: colors.text, marginBottom: 20 } as React.CSSProperties,
    table: { width: '100%', borderCollapse: 'collapse' as const },
    th: { textAlign: 'left' as const, padding: '12px 16px', fontSize: 12, fontWeight: 600, color: colors.textMuted, borderBottom: `1px solid ${colors.border}`, textTransform: 'uppercase' as const },
    td: { padding: '14px 16px', fontSize: 14, color: colors.text, borderBottom: `1px solid ${colors.borderLight}` } as React.CSSProperties,
    badge: { padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500 } as React.CSSProperties,
    searchBox: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: colors.bgTertiary, borderRadius: 8, border: `1px solid ${colors.border}`, width: 260 } as React.CSSProperties,
    searchInput: { border: 'none', background: 'transparent', outline: 'none', fontSize: 13, color: colors.text, width: '100%' } as React.CSSProperties,
    actionBtn: { padding: '8px 12px', borderRadius: 6, border: 'none', background: 'transparent', color: colors.textMuted, cursor: 'pointer', transition: 'all 0.15s' } as React.CSSProperties,
    teamGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 } as React.CSSProperties,
    teamCard: { background: colors.bgTertiary, borderRadius: 12, padding: 20, border: `1px solid ${colors.border}` } as React.CSSProperties,
    avatar: { width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 600, color: '#FFFFFF' } as React.CSSProperties,
    empty: { textAlign: 'center' as const, padding: 60, color: colors.textMuted } as React.CSSProperties,
    kpiGrid: { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 16, marginBottom: 24 } as React.CSSProperties,
    kpiSmall: { background: colors.bgSecondary, borderRadius: 10, padding: 16, border: `1px solid ${colors.border}` } as React.CSSProperties,
    confirmOverlay: { position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001 } as React.CSSProperties,
    confirmBox: { background: colors.bgSecondary, borderRadius: 12, padding: 24, maxWidth: 400, border: `1px solid ${colors.border}` } as React.CSSProperties,
  };

  const handleSaveCampaign = (campaign: CampaignData) => {
    if (editingCampaign?.id) {
      updateExpense(editingCampaign.id, campaign);
      showToast('success', 'Campanha atualizada com sucesso!');
    } else {
      addExpense({
        name: campaign.name,
        category: 'publicidade',
        amount: campaign.amount,
        date: campaign.date,
        frequency: campaign.frequency,
        platform: campaign.platform,
        campaignName: campaign.campaignName,
        ctr: campaign.ctr,
        roas: campaign.roas,
        status: campaign.status,
        budget: campaign.budget,
        actualSpend: campaign.amount,
      });
      showToast('success', 'Campanha criada com sucesso!');
    }
    setEditingCampaign(null);
  };

  const handleEditCampaign = (expense: Expense) => {
    setEditingCampaign({
      id: expense.id,
      name: expense.name,
      platform: expense.platform as AdPlatform,
      campaignName: expense.campaignName || '',
      amount: expense.amount,
      budget: expense.budget || 0,
      ctr: expense.ctr,
      roas: expense.roas,
      status: expense.status as AdStatus,
      date: expense.date,
      frequency: 'mensal',
      category: 'publicidade',
    });
    setModalOpen(true);
  };

  const handleDuplicateCampaign = (expense: Expense) => {
    addExpense({
      name: expense.name + ' (cópia)',
      category: 'publicidade',
      amount: expense.amount,
      date: new Date(),
      frequency: expense.frequency,
      platform: expense.platform,
      campaignName: expense.campaignName + ' (cópia)',
      ctr: expense.ctr,
      roas: expense.roas,
      status: 'pausada',
      budget: expense.budget,
      actualSpend: expense.actualSpend,
    });
    showToast('success', 'Campanha duplicada!');
  };

  const handleDeleteCampaign = (id: string) => {
    deleteExpense(id);
    setConfirmDelete(null);
    showToast('success', 'Campanha excluída!');
  };

  const handleToggleStatus = (expense: Expense) => {
    const newStatus: AdStatus = expense.status === 'ativa' ? 'pausada' : 'ativa';
    updateExpenseStatus(expense.id, newStatus);
    showToast('info', `Campanha ${newStatus === 'ativa' ? 'ativada' : 'pausada'}!`);
  };

  const handleSaveRevenue = (revenue: RevenueCampaignData) => {
    if (editingRevenue?.id) {
      updateRevenueEntry(editingRevenue.id, revenue);
      showToast('success', 'Receita atualizada com sucesso!');
    } else {
      addRevenue({
        name: revenue.name,
        amount: revenue.amount,
        date: revenue.date,
        category: revenue.category,
      });
      showToast('success', 'Receita cadastrada com sucesso!');
    }
    setEditingRevenue(null);
  };

  const handleEditRevenue = (revenue: { id: string; name: string; amount: number; date: Date; category: 'vendas' | 'servico' | 'assinatura' | 'outros' }) => {
    setEditingRevenue({
      id: revenue.id,
      name: revenue.name,
      amount: revenue.amount,
      date: revenue.date,
      category: revenue.category,
    });
    setRevenueModalOpen(true);
  };

  const handleDeleteRevenue = (id: string) => {
    deleteRevenue(id);
    setConfirmDeleteRevenue(null);
    showToast('success', 'Receita excluída!');
  };

  const handleSaveBudget = (budget: BudgetData) => {
    if (editingBudget?.id) {
      updateBudget(editingBudget.id, budget.amount);
      showToast('success', 'Budget atualizado com sucesso!');
    } else {
      addBudget({
        category: budget.category,
        amount: budget.amount,
        month: budget.month,
        year: budget.year,
      });
      showToast('success', 'Budget criado com sucesso!');
    }
    setEditingBudget(null);
  };

  const handleEditBudget = (budget: { id: string; category: string; amount: number; month: string; year: number }) => {
    setEditingBudget({
      id: budget.id,
      category: budget.category as any,
      amount: budget.amount,
      month: budget.month,
      year: budget.year,
    });
    setBudgetModalOpen(true);
  };

  const handleDeleteBudget = (id: string) => {
    deleteBudget(id);
    setConfirmDeleteBudget(null);
    showToast('success', 'Budget excluído!');
  };

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      vendas: 'Vendas',
      servico: 'Serviço',
      assinatura: 'Assinatura',
      outros: 'Outros',
    };
    return labels[cat] || cat;
  };

  const getCategoryBadgeColor = (cat: string) => {
    const colorsCat: Record<string, string> = {
      vendas: '#10B981',
      servico: '#3B82F6',
      assinatura: '#8B5CF6',
      outros: '#71717A',
    };
    return colorsCat[cat] || '#71717A';
  };

  const renderKPIs = () => (
    <div style={styles.grid4}>
      <div style={styles.kpiCard}>
        <div style={styles.kpiLabel}>Despesa Total</div>
        <div style={styles.kpiValue}>{formatCurrency(animatedExpenses)}</div>
        <div style={styles.kpiSub}>Publicidade + Desenvolvimento</div>
      </div>
      <div style={styles.kpiCard}>
        <div style={styles.kpiLabel}>Receita</div>
        <div style={styles.kpiValue}>{formatCurrency(animatedRevenue)}</div>
        <div style={{ ...styles.kpiSub, color: summary.margin > 30 ? colors.success : colors.warning }}>{summary.margin.toFixed(1)}% margem</div>
      </div>
      <div style={styles.kpiCard}>
        <div style={styles.kpiLabel}>ROI Publicidade</div>
        <div style={styles.kpiValue}>{avgRoas.toFixed(1)}x</div>
        <div style={styles.kpiSub}>ROAS médio</div>
      </div>
      <div style={styles.kpiCard}>
        <div style={styles.kpiLabel}>Custo Equipe</div>
        <div style={styles.kpiValue}>{formatCurrency(animatedTeamCost)}</div>
        <div style={styles.kpiSub}>{teamMembers.length} membros</div>
      </div>
    </div>
  );

  const renderOverview = () => (
    <>
      {renderKPIs()}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 } as React.CSSProperties}>
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Despesa Mensal</div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyExpensesData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: colors.textMuted, fontSize: 10 }} dy={5} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: colors.bgSecondary, border: `1px solid ${colors.border}`, borderRadius: 8, padding: '10px 14px' }} formatter={(value: number) => formatCurrency(value)} />
                <Area type="monotone" dataKey="publicidade" stackId="1" stroke={colors.accent} fill={colors.accent} fillOpacity={0.3} name="Publicidade" />
                <Area type="monotone" dataKey="desenvolvimento" stackId="2" stroke={colors.success} fill={colors.success} fillOpacity={0.3} name="Desenvolvimento" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: 2, background: colors.accent }} />
              <span style={{ fontSize: 11, color: colors.textMuted }}>Publicidade</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: 2, background: colors.success }} />
              <span style={{ fontSize: 11, color: colors.textMuted }}>Desenvolvimento</span>
            </div>
          </div>
        </div>
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Por Categoria</div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value" nameKey="name">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: colors.bgSecondary, border: `1px solid ${colors.border}`, borderRadius: 8, padding: '10px 14px' }} formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 12, justifyContent: 'center' }}>
            {categoryData.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: item.color }} />
                <span style={{ fontSize: 12, color: colors.textMuted }}>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Lista de Despesas</div>
        {categoryData.slice(0, 6).map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 5 ? `1px solid ${colors.borderLight}` : 'none' } as React.CSSProperties}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 } as React.CSSProperties}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: item.color } as React.CSSProperties} />
              <span style={{ color: colors.text, fontSize: 14 }}>{item.name}</span>
            </div>
            <span style={{ color: colors.textSecondary, fontSize: 14, fontWeight: 500 }}>{formatCurrency(item.value)}</span>
          </div>
        ))}
      </div>
    </>
  );

  const renderAds = () => {
    const filteredAds = adExpenses.filter(e => !searchQuery || e.campaignName?.toLowerCase().includes(searchQuery.toLowerCase()));
    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 } as React.CSSProperties}>
          <div style={styles.searchBox}>
            <Search size={16} color={colors.textMuted} />
            <input
              style={styles.searchInput}
              placeholder="Buscar campanha..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            style={{ ...styles.tab, ...styles.tabActive, display: 'flex', alignItems: 'center', gap: 8 }}
            onClick={() => { setEditingCampaign(null); setModalOpen(true); }}
          >
            <Plus size={16} /> Nova Campanha
          </button>
        </div>

        <div style={styles.kpiGrid}>
          <div style={styles.kpiSmall}>
            <div style={styles.kpiLabel}>Total Investido</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: colors.text }}>{formatCurrency(animatedAdsSpent)}</div>
          </div>
          <div style={styles.kpiSmall}>
            <div style={styles.kpiLabel}>Budget Total</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: colors.text }}>{formatCurrency(animatedAdsBudget)}</div>
          </div>
          <div style={styles.kpiSmall}>
            <div style={styles.kpiLabel}>ROAS Médio</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: avgRoas >= 3 ? colors.success : colors.warning }}>{avgRoas.toFixed(1)}x</div>
          </div>
          <div style={styles.kpiSmall}>
            <div style={styles.kpiLabel}>Melhor Plataforma</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: colors.text }}>{bestPlatform ? getAdPlatformLabel(bestPlatform.platform as AdPlatform) : '-'}</div>
          </div>
        </div>

        <div style={styles.section}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Plataforma</th>
                <th style={styles.th}>Campanha</th>
                <th style={styles.th}>Budget</th>
                <th style={styles.th}>Gasto</th>
                <th style={styles.th}>ROAS</th>
                <th style={styles.th}>CTR</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredAds.map((expense) => (
                <tr key={expense.id}>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, background: `${getAdPlatformColor(expense.platform as AdPlatform)}20`, color: getAdPlatformColor(expense.platform as AdPlatform) }}>
                      {getAdPlatformLabel(expense.platform as AdPlatform)}
                    </span>
                  </td>
                  <td style={{ ...styles.td, fontWeight: 500 }}>{expense.campaignName}</td>
                  <td style={styles.td}>{formatCurrency(expense.budget || 0)}</td>
                  <td style={{ ...styles.td, fontWeight: 600 }}>{formatCurrency(expense.amount)}</td>
                  <td style={{ ...styles.td, color: (expense.roas || 0) >= 3 ? colors.success : colors.warning, fontWeight: 500 }}>{expense.roas?.toFixed(1)}x</td>
                  <td style={styles.td}>{expense.ctr?.toFixed(1)}%</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, background: `${getStatusColor(expense.status as AdStatus)}20`, color: getStatusColor(expense.status as AdStatus) }}>
                      {expense.status === 'ativa' ? 'Ativa' : expense.status === 'pausada' ? 'Pausada' : 'Finalizada'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button style={styles.actionBtn} onClick={() => handleToggleStatus(expense)} title={expense.status === 'ativa' ? 'Pausar' : 'Ativar'}>
                      {expense.status === 'ativa' ? <Pause size={14} /> : <Play size={14} />}
                    </button>
                    <button style={styles.actionBtn} onClick={() => handleEditCampaign(expense)} title="Editar">
                      <Edit size={14} />
                    </button>
                    <button style={styles.actionBtn} onClick={() => handleDuplicateCampaign(expense)} title="Duplicar">
                      <Plus size={14} />
                    </button>
                    <button style={styles.actionBtn} onClick={() => setConfirmDelete(expense.id)} title="Excluir">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <CampaignModal
          isOpen={modalOpen}
          onClose={() => { setModalOpen(false); setEditingCampaign(null); }}
          onSave={handleSaveCampaign}
          editingCampaign={editingCampaign}
        />

        {confirmDelete && (
          <div style={styles.confirmOverlay}>
            <div style={styles.confirmBox}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: colors.text, marginBottom: 12 }}>Confirmar Exclusão</h3>
              <p style={{ color: colors.textMuted, marginBottom: 24 }}>Tem certeza que deseja excluir esta campanha? Esta ação não pode ser desfeita.</p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button style={styles.actionBtn} onClick={() => setConfirmDelete(null)}>Cancelar</button>
                <button style={{ padding: '12px 20px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', border: 'none', background: colors.error, color: '#FFFFFF' }} onClick={() => handleDeleteCampaign(confirmDelete)}>Excluir</button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  const renderDev = () => (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 } as React.CSSProperties}>
        <div style={styles.searchBox}>
          <Search size={16} color={colors.textMuted} />
          <input
            style={styles.searchInput}
            placeholder="Buscar despesa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          style={{ ...styles.tab, ...styles.tabActive, display: 'flex', alignItems: 'center', gap: 8 }}
          onClick={() => showToast('info', 'Funcionalidade em breve')}
        >
          <Plus size={16} /> Nova Despesa
        </button>
      </div>
      <div style={styles.section}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Categoria</th>
              <th style={styles.th}>Descrição</th>
              <th style={styles.th}>Valor</th>
              <th style={styles.th}>Frequência</th>
              <th style={styles.th}>Próximo Vcto</th>
              <th style={styles.th}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {devExpenses.filter(e => !searchQuery || e.name.toLowerCase().includes(searchQuery.toLowerCase())).map((expense) => (
              <tr key={expense.id}>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, background: `${getCategoryColor(expense.category)}20`, color: getCategoryColor(expense.category) }}>
                    {expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}
                  </span>
                </td>
                <td style={{ ...styles.td, fontWeight: 500 }}>{expense.name}</td>
                <td style={{ ...styles.td, fontWeight: 600 }}>{formatCurrency(expense.amount)}</td>
                <td style={styles.td}>{expense.frequency === 'mensal' ? 'Mensal' : expense.frequency === 'anual' ? 'Anual' : 'Único'}</td>
                <td style={styles.td}>{expense.nextDueDate ? new Intl.DateTimeFormat('pt-BR').format(expense.nextDueDate) : '-'}</td>
                <td style={styles.td}>
                  <button style={styles.actionBtn}><Edit size={14} /></button>
                  <button style={styles.actionBtn}><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderTeam = () => (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 } as React.CSSProperties}>
        <div style={{ fontSize: 14, color: colors.textMuted }}>
          {teamMembers.length} membros • Total: <span style={{ fontWeight: 600, color: colors.text }}>{formatCurrency(teamCost)}/mês</span>
        </div>
        <button
          style={{ ...styles.tab, ...styles.tabActive, display: 'flex', alignItems: 'center', gap: 8 }}
          onClick={() => showToast('info', 'Funcionalidade em breve')}
        >
          <Plus size={16} /> Novo Membro
        </button>
      </div>
      <div style={styles.teamGrid}>
        {teamMembers.map((member) => (
          <div key={member.id} style={styles.teamCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 } as React.CSSProperties}>
              <div style={{ ...styles.avatar, background: getRoleColor(member.role) }}>
                {member.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </div>
              <div>
                <div style={{ fontWeight: 600, color: colors.text, fontSize: 15 }}>{member.name}</div>
                <div style={{ fontSize: 13, color: colors.textMuted }}>{member.email}</div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' } as React.CSSProperties}>
              <span style={{ ...styles.badge, background: `${getRoleColor(member.role)}20`, color: getRoleColor(member.role) }}>
                {getRoleLabel(member.role)}
              </span>
              <span style={{ fontWeight: 600, color: colors.text }}>{formatCurrency(member.salary)}<span style={{ fontSize: 12, color: colors.textMuted }}>/mês</span></span>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const renderRevenue = () => {
    const filteredRevenues = revenues.filter(r => !searchQuery || r.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 } as React.CSSProperties}>
          <div style={styles.searchBox}>
            <Search size={16} color={colors.textMuted} />
            <input
              style={styles.searchInput}
              placeholder="Buscar receita..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            style={{ ...styles.tab, ...styles.tabActive, display: 'flex', alignItems: 'center', gap: 8 }}
            onClick={() => { setEditingRevenue(null); setRevenueModalOpen(true); }}
          >
            <Plus size={16} /> Nova Receita
          </button>
        </div>

        <div style={styles.kpiGrid}>
          <div style={styles.kpiSmall}>
            <div style={styles.kpiLabel}>Total Geral</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: colors.text }}>{formatCurrency(totalRevenue)}</div>
          </div>
          <div style={styles.kpiSmall}>
            <div style={styles.kpiLabel}>Receitas do Mês</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: colors.success }}>{formatCurrency(currentMonthRevenue)}</div>
          </div>
          <div style={styles.kpiSmall}>
            <div style={styles.kpiLabel}>Média por Receita</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: colors.text }}>{formatCurrency(avgRevenue)}</div>
          </div>
          <div style={styles.kpiSmall}>
            <div style={styles.kpiLabel}>Total Registros</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: colors.text }}>{revenueCount}</div>
          </div>
        </div>

        <div style={styles.section}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Nome</th>
                <th style={styles.th}>Categoria</th>
                <th style={styles.th}>Valor</th>
                <th style={styles.th}>Data</th>
                <th style={styles.th}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredRevenues.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ ...styles.td, textAlign: 'center', color: colors.textMuted, padding: 40 }}>
                    Nenhuma receita cadastrada. Clique em "Nova Receita" para começar.
                  </td>
                </tr>
              ) : (
                filteredRevenues.map((revenue) => (
                  <tr key={revenue.id}>
                    <td style={{ ...styles.td, fontWeight: 500 }}>{revenue.name}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, background: `${getCategoryBadgeColor(revenue.category)}20`, color: getCategoryBadgeColor(revenue.category) }}>
                        {getCategoryLabel(revenue.category)}
                      </span>
                    </td>
                    <td style={{ ...styles.td, fontWeight: 600, color: colors.success }}>{formatCurrency(revenue.amount)}</td>
                    <td style={styles.td}>{new Intl.DateTimeFormat('pt-BR').format(revenue.date)}</td>
                    <td style={styles.td}>
                      <button style={styles.actionBtn} onClick={() => handleEditRevenue(revenue)} title="Editar">
                        <Edit size={14} />
                      </button>
                      <button style={styles.actionBtn} onClick={() => setConfirmDeleteRevenue(revenue.id)} title="Excluir">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <RevenueModal
          isOpen={revenueModalOpen}
          onClose={() => { setRevenueModalOpen(false); setEditingRevenue(null); }}
          onSave={handleSaveRevenue}
          editingRevenue={editingRevenue}
        />

        {confirmDeleteRevenue && (
          <div style={styles.confirmOverlay}>
            <div style={styles.confirmBox}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: colors.text, marginBottom: 12 }}>Confirmar Exclusão</h3>
              <p style={{ color: colors.textMuted, marginBottom: 24 }}>Tem certeza que deseja excluir esta receita? Esta ação não pode ser desfeita.</p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button style={styles.actionBtn} onClick={() => setConfirmDeleteRevenue(null)}>Cancelar</button>
                <button style={{ padding: '12px 20px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', border: 'none', background: colors.error, color: '#FFFFFF' }} onClick={() => handleDeleteRevenue(confirmDeleteRevenue)}>Excluir</button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  const renderBudgets = () => {
    const activeAlerts = alerts.filter(a => a.status !== 'ok');
    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 } as React.CSSProperties}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {activeAlerts.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: `${colors.error}20`, borderRadius: 8 }}>
                <AlertTriangle size={16} color={colors.error} />
                <span style={{ color: colors.error, fontSize: 13, fontWeight: 500 }}>{activeAlerts.length} alerta(s) de orçamento</span>
              </div>
            )}
          </div>
          <button
            style={{ ...styles.tab, ...styles.tabActive, display: 'flex', alignItems: 'center', gap: 8 }}
            onClick={() => { setEditingBudget(null); setBudgetModalOpen(true); }}
          >
            <Plus size={16} /> Novo Budget
          </button>
        </div>

        <div style={styles.section}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Categoria</th>
                <th style={styles.th}>Orçamento</th>
                <th style={styles.th}>Gasto</th>
                <th style={styles.th}>Utilizado</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {budgets.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ ...styles.td, textAlign: 'center', color: colors.textMuted, padding: 40 }}>
                    Nenhum budget cadastrado. Clique em "Novo Budget" para começar.
                  </td>
                </tr>
              ) : (
                budgets.map((budget) => {
                  const spent = expenses.filter(e => e.category === budget.category).reduce((sum, e) => sum + e.amount, 0);
                  const percent = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
                  const alert = alerts.find(a => a.category === budget.category);
                  const statusColor = alert?.status === 'exceeded' ? colors.error : alert?.status === 'warning' ? colors.warning : colors.success;
                  
                  return (
                    <tr key={budget.id}>
                      <td style={styles.td}>
                        <span style={{ ...styles.badge, background: `${getCategoryColor(budget.category)}20`, color: getCategoryColor(budget.category) }}>
                          {budget.category.charAt(0).toUpperCase() + budget.category.slice(1)}
                        </span>
                      </td>
                      <td style={{ ...styles.td, fontWeight: 600 }}>{formatCurrency(budget.amount)}</td>
                      <td style={styles.td}>{formatCurrency(spent)}</td>
                      <td style={styles.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ flex: 1, height: 6, background: colors.bgTertiary, borderRadius: 3, overflow: 'hidden', maxWidth: 100 }}>
                            <div style={{ width: `${Math.min(percent, 100)}%`, height: '100%', background: statusColor, borderRadius: 3 }} />
                          </div>
                          <span style={{ fontSize: 12, color: statusColor, fontWeight: 500, minWidth: 45 }}>{percent.toFixed(0)}%</span>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badge, background: `${statusColor}20`, color: statusColor }}>
                          {alert?.status === 'exceeded' ? 'Excedido' : alert?.status === 'warning' ? 'Atenção' : 'OK'}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <button style={styles.actionBtn} onClick={() => handleEditBudget(budget)} title="Editar">
                          <Edit size={14} />
                        </button>
                        <button style={styles.actionBtn} onClick={() => setConfirmDeleteBudget(budget.id)} title="Excluir">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <BudgetModal
          isOpen={budgetModalOpen}
          onClose={() => { setBudgetModalOpen(false); setEditingBudget(null); }}
          onSave={handleSaveBudget}
          editingBudget={editingBudget}
        />

        {confirmDeleteBudget && (
          <div style={styles.confirmOverlay}>
            <div style={styles.confirmBox}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: colors.text, marginBottom: 12 }}>Confirmar Exclusão</h3>
              <p style={{ color: colors.textMuted, marginBottom: 24 }}>Tem certeza que deseja excluir este budget?</p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button style={styles.actionBtn} onClick={() => setConfirmDeleteBudget(null)}>Cancelar</button>
                <button style={{ padding: '12px 20px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', border: 'none', background: colors.error, color: '#FFFFFF' }} onClick={() => handleDeleteBudget(confirmDeleteBudget)}>Excluir</button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.tabs}>
        <button style={{ ...styles.tab, ...(activeTab === 'overview' ? styles.tabActive : {}) }} onClick={() => setActiveTab('overview')}>Visão Geral</button>
        <button style={{ ...styles.tab, ...(activeTab === 'ads' ? styles.tabActive : {}) }} onClick={() => setActiveTab('ads')}>Publicidade</button>
        <button style={{ ...styles.tab, ...(activeTab === 'dev' ? styles.tabActive : {}) }} onClick={() => setActiveTab('dev')}>Desenvolvimento</button>
        <button style={{ ...styles.tab, ...(activeTab === 'team' ? styles.tabActive : {}) }} onClick={() => setActiveTab('team')}>Equipe</button>
        <button style={{ ...styles.tab, ...(activeTab === 'revenue' ? styles.tabActive : {}) }} onClick={() => setActiveTab('revenue')}>Receita</button>
        <button style={{ ...styles.tab, ...(activeTab === 'budgets' ? styles.tabActive : {}) }} onClick={() => setActiveTab('budgets')}>
          Budgets
          {alerts.filter(a => a.status !== 'ok').length > 0 && (
            <span style={{ marginLeft: 6, background: colors.error, color: '#FFF', fontSize: 10, padding: '2px 6px', borderRadius: 10 }}>{alerts.filter(a => a.status !== 'ok').length}</span>
          )}
        </button>
      </div>

      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'ads' && renderAds()}
      {activeTab === 'dev' && renderDev()}
      {activeTab === 'team' && renderTeam()}
      {activeTab === 'revenue' && renderRevenue()}
      {activeTab === 'budgets' && renderBudgets()}
    </div>
  );
};

export default FinancePage;