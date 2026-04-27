import { Expense, TeamMember, Budget, Revenue, AdPlatform, AdStatus, ExpenseCategory, TeamRole } from '../types';

export const mockExpenses: Expense[] = [
  { id: 'ad-1', name: 'Google Ads - Campanha Primavera', category: 'publicidade', amount: 3500, date: new Date('2026-04-01'), frequency: 'mensal', platform: 'google', campaignName: 'Coleção Primavera 2026', ctr: 3.2, roas: 4.5, status: 'ativa', budget: 4000, actualSpend: 3500 },
  { id: 'ad-2', name: 'Meta Ads - Remarketing', category: 'publicidade', amount: 2200, date: new Date('2026-04-01'), frequency: 'mensal', platform: 'meta', campaignName: 'Remarketing Instagram', ctr: 2.8, roas: 3.2, status: 'ativa', budget: 2500, actualSpend: 2200 },
  { id: 'ad-3', name: 'TikTok Ads - Viral', category: 'publicidade', amount: 1500, date: new Date('2026-04-15'), frequency: 'mensal', platform: 'tiktok', campaignName: 'Viral Shorts', ctr: 1.9, roas: 2.1, status: 'ativa', budget: 2000, actualSpend: 1500 },
  { id: 'ad-4', name: 'LinkedIn Ads - B2B', category: 'publicidade', amount: 1800, date: new Date('2026-04-10'), frequency: 'mensal', platform: 'linkedin', campaignName: 'Enterprise Leads', ctr: 0.8, roas: 2.8, status: 'ativa', budget: 2000, actualSpend: 1800 },
  { id: 'ad-5', name: 'Email Marketing', category: 'publicidade', amount: 450, date: new Date('2026-04-05'), frequency: 'mensal', platform: 'email', campaignName: 'Newsletter Semanal', ctr: 4.5, roas: 8.2, status: 'ativa', budget: 500, actualSpend: 450 },
  { id: 'dev-1', name: 'AWS - Servidores', category: 'infraestrutura', amount: 1200, date: new Date('2026-04-01'), frequency: 'mensal', nextDueDate: new Date('2026-05-01'), description: 'EC2 + RDS + CloudFront' },
  { id: 'dev-2', name: 'GitHub Teams', category: 'ferramentas', amount: 240, date: new Date('2026-04-01'), frequency: 'mensal', nextDueDate: new Date('2026-05-01'), description: 'GitHub Enterprise' },
  { id: 'dev-3', name: 'Figma - Licença Team', category: 'ferramentas', amount: 180, date: new Date('2026-04-01'), frequency: 'mensal', nextDueDate: new Date('2026-05-01'), description: '5 seats' },
  { id: 'dev-4', name: 'Vercel Pro', category: 'infraestrutura', amount: 200, date: new Date('2026-04-01'), frequency: 'mensal', nextDueDate: new Date('2026-05-01'), description: 'Frontend hosting' },
  { id: 'dev-5', name: 'Domínio .com', category: 'licencas', amount: 150, date: new Date('2026-01-01'), frequency: 'anual', nextDueDate: new Date('2027-01-01'), description: 'lumestudio.com' },
  { id: 'dev-6', name: 'SSL Certificate', category: 'licencas', amount: 80, date: new Date('2026-01-01'), frequency: 'anual', nextDueDate: new Date('2027-01-01'), description: 'Wildcard SSL' },
];

export const mockTeamMembers: TeamMember[] = [
  { id: 'tm-1', name: 'Marcos Vinícius', role: 'fullstack', email: 'marcos@lumestudio.com', salary: 8500, employmentType: 'clt', startDate: new Date('2025-01-01'), projects: ['E-commerce', 'Dashboard Admin'], status: 'ativo' },
  { id: 'tm-2', name: 'Ana Carolina', role: 'frontend', email: 'ana@lumestudio.com', salary: 7000, employmentType: 'clt', startDate: new Date('2025-03-15'), projects: ['Landing Pages', 'Componentes UI'], status: 'ativo' },
  { id: 'tm-3', name: 'Roberto Ferreira', role: 'backend', email: 'roberto@lumestudio.com', salary: 9000, employmentType: 'clt', startDate: new Date('2025-02-01'), projects: ['API REST', 'Integrações'], status: 'ativo' },
  { id: 'tm-4', name: 'Carla Mendes', role: 'design', email: 'carla@lumestudio.com', salary: 6500, employmentType: 'pj', startDate: new Date('2025-06-01'), projects: ['Identidade Visual', 'UI Design'], status: 'ativo' },
];

export const mockBudgets: Budget[] = [
  { id: 'bud-1', category: 'publicidade', amount: 11000, month: 'Abril', year: 2026 },
  { id: 'bud-2', category: 'desenvolvimento', amount: 5000, month: 'Abril', year: 2026 },
  { id: 'bud-3', category: 'infraestrutura', amount: 1500, month: 'Abril', year: 2026 },
];

export const mockRevenueEntries: Revenue[] = [
  { id: 'rev-1', name: 'Vendas Abril', amount: 28475, date: new Date('2026-04-25'), category: 'vendas' },
  { id: 'rev-2', name: 'Vendas Março', amount: 28200, date: new Date('2026-03-25'), category: 'vendas' },
  { id: 'rev-3', name: 'Vendas Fevereiro', amount: 27500, date: new Date('2026-02-25'), category: 'vendas' },
  { id: 'rev-4', name: 'Assinatura Premium', amount: 1500, date: new Date('2026-04-15'), category: 'assinatura' },
];

export const getAdPlatformLabel = (platform: AdPlatform): string => {
  const labels: Record<AdPlatform, string> = {
    google: 'Google Ads',
    meta: 'Meta (Instagram)',
    tiktok: 'TikTok',
    linkedin: 'LinkedIn',
    email: 'E-mail',
    outros: 'Outros',
  };
  return labels[platform];
};

export const getAdPlatformColor = (platform: AdPlatform): string => {
  const colors: Record<AdPlatform, string> = {
    google: '#EA4335',
    meta: '#0081FD',
    tiktok: '#000000',
    linkedin: '#0A66C2',
    email: '#FF6B35',
    outros: '#71717A',
  };
  return colors[platform];
};

export const getStatusColor = (status: AdStatus): string => {
  return status === 'ativa' ? '#10B981' : status === 'pausada' ? '#F59E0B' : '#71717A';
};

export const getCategoryColor = (category: ExpenseCategory): string => {
  const colors: Record<ExpenseCategory, string> = {
    publicidade: '#8B5CF6',
    desenvolvimento: '#3B82F6',
    infraestrutura: '#10B981',
    ferramentas: '#F59E0B',
    licencas: '#EC4899',
    salarios: '#06B6D4',
    outros: '#71717A',
  };
  return colors[category];
};

export const getRoleLabel = (role: TeamRole): string => {
  const labels: Record<TeamRole, string> = {
    frontend: 'Frontend',
    backend: 'Backend',
    fullstack: 'Fullstack',
    design: 'Design',
    product: 'Product',
    devops: 'DevOps',
    marketing: 'Marketing',
  };
  return labels[role];
};

export const getRoleColor = (role: TeamRole): string => {
  const colors: Record<TeamRole, string> = {
    frontend: '#8B5CF6',
    backend: '#3B82F6',
    fullstack: '#06B6D4',
    design: '#EC4899',
    product: '#F59E0B',
    devops: '#10B981',
    marketing: '#EF4444',
  };
  return colors[role];
};