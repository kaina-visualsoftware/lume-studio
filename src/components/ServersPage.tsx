import React, { useState } from 'react';
import { useTheme } from './Theme';
import { darkColors, lightColors } from '../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useCountUp, useBreakpoint } from '../hooks';

type Tab = 'overview' | 'servers' | 'services' | 'ads' | 'devtools' | 'finance' | 'projects';
type ServerStatus = 'online' | 'offline' | 'maintenance' | 'degraded';
type ServerType = 'vps' | 'dedicated' | 'cloud' | 'shared';
type BillingCycle = 'monthly' | 'annually' | 'hourly';

interface ResourceUsage { used: number; total: number; }

interface Server {
  id: string;
  name: string;
  hostname: string;
  type: ServerType;
  status: ServerStatus;
  provider: string;
  region: string;
  ip: { public: string; private?: string };
  usage: { cpu: ResourceUsage; ram: ResourceUsage; storage: ResourceUsage; uptime: number };
  cost: { amount: number; cycle: BillingCycle; nextBilling: Date };
}

interface HostingService {
  id: string;
  name: string;
  type: 'domain' | 'cdn' | 'email' | 'ssl' | 'storage' | 'database' | 'monitoring';
  provider: string;
  status: 'active' | 'expiring' | 'expired';
  cost: { amount: number; cycle: BillingCycle; nextBilling: Date };
}

interface AdPlatform {
  id: string;
  name: string;
  platform: 'google' | 'meta' | 'tiktok' | 'linkedin' | 'programmatic';
  status: 'active' | 'paused';
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  cpc: number;
}

interface DevTool {
  id: string;
  name: string;
  category: 'repository' | 'design' | 'project' | 'cloud' | 'monitoring' | 'error' | 'cicd';
  provider: string;
  seats: number;
  cost: { amount: number; cycle: BillingCycle; nextBilling: Date };
}

interface Project {
  id: string;
  name: string;
  client: string;
  status: 'active' | 'onhold' | 'completed';
  type: 'internal' | 'client';
  startDate: Date;
  revenue: number;
  cost: number;
  margin: number;
}

const mockServers: Server[] = [
  { id: 'srv-001', name: 'prod-api-01', hostname: 'api-01.infra.empresa.com.br', type: 'vps', status: 'online', provider: 'Hetzner', region: 'Falkenstein', ip: { public: '65.21.142.88', private: '10.0.0.10' }, usage: { cpu: { used: 61, total: 100 }, ram: { used: 21, total: 32 }, storage: { used: 98, total: 240 }, uptime: 99.97 }, cost: { amount: 380, cycle: 'monthly', nextBilling: new Date('2025-02-01') } },
  { id: 'srv-002', name: 'prod-db-01', hostname: 'db-01.infra.empresa.com.br', type: 'dedicated', status: 'online', provider: 'Hetzner', region: 'Nuremberg', ip: { public: '78.46.209.14', private: '10.0.0.11' }, usage: { cpu: { used: 34, total: 100 }, ram: { used: 48, total: 64 }, storage: { used: 620, total: 960 }, uptime: 99.99 }, cost: { amount: 890, cycle: 'monthly', nextBilling: new Date('2025-02-01') } },
  { id: 'srv-003', name: 'stg-app-01', hostname: 'stg-01.infra.empresa.com.br', type: 'vps', status: 'degraded', provider: 'DigitalOcean', region: 'New York', ip: { public: '143.198.57.22', private: '10.114.0.5' }, usage: { cpu: { used: 89, total: 100 }, ram: { used: 7, total: 8 }, storage: { used: 74, total: 160 }, uptime: 97.3 }, cost: { amount: 210, cycle: 'monthly', nextBilling: new Date('2025-02-05') } },
  { id: 'srv-004', name: 'cdn-edge-sa', hostname: 'edge-sa.empresa.com.br', type: 'cloud', status: 'online', provider: 'AWS', region: 'São Paulo', ip: { public: '177.71.249.100' }, usage: { cpu: { used: 22, total: 100 }, ram: { used: 6, total: 16 }, storage: { used: 12, total: 80 }, uptime: 100 }, cost: { amount: 520, cycle: 'monthly', nextBilling: new Date('2025-02-01') } },
  { id: 'srv-005', name: 'bkp-storage-01', hostname: 'bkp-01.infra.empresa.com.br', type: 'vps', status: 'maintenance', provider: 'Contabo', region: 'Düsseldorf', ip: { public: '194.163.128.42', private: '192.168.1.50' }, usage: { cpu: { used: 8, total: 100 }, ram: { used: 4, total: 16 }, storage: { used: 1340, total: 2000 }, uptime: 98.1 }, cost: { amount: 140, cycle: 'monthly', nextBilling: new Date('2025-02-10') } },
];

const mockServices: HostingService[] = [
  { id: 'svc-001', name: 'empresa.com.br', type: 'domain', provider: 'Registro.br', status: 'active', cost: { amount: 40, cycle: 'annually', nextBilling: new Date('2025-11-01') } },
  { id: 'svc-002', name: 'Cloudflare Pro', type: 'cdn', provider: 'Cloudflare', status: 'active', cost: { amount: 200, cycle: 'monthly', nextBilling: new Date('2025-02-01') } },
  { id: 'svc-003', name: 'Google Workspace', type: 'email', provider: 'Google', status: 'active', cost: { amount: 480, cycle: 'monthly', nextBilling: new Date('2025-02-01') } },
  { id: 'svc-004', name: 'Wildcard SSL', type: 'ssl', provider: 'ZeroSSL', status: 'expiring', cost: { amount: 290, cycle: 'annually', nextBilling: new Date('2025-02-15') } },
  { id: 'svc-005', name: 'Backblaze B2', type: 'storage', provider: 'Backblaze', status: 'active', cost: { amount: 95, cycle: 'monthly', nextBilling: new Date('2025-02-01') } },
  { id: 'svc-006', name: 'PlanetScale', type: 'database', provider: 'PlanetScale', status: 'active', cost: { amount: 390, cycle: 'monthly', nextBilling: new Date('2025-02-01') } },
  { id: 'svc-007', name: 'Better Uptime', type: 'monitoring', provider: 'Better Stack', status: 'active', cost: { amount: 120, cycle: 'monthly', nextBilling: new Date('2025-02-01') } },
];

const mockAdPlatforms: AdPlatform[] = [
  { id: 'ad-001', name: 'Campanhas Marca', platform: 'google', status: 'active', budget: 12000, spent: 8420, impressions: 2450000, clicks: 48500, conversions: 1240, cpc: 0.17 },
  { id: 'ad-002', name: 'Retargeting', platform: 'meta', status: 'active', budget: 8000, spent: 7230, impressions: 1820000, clicks: 36400, conversions: 890, cpc: 0.20 },
  { id: 'ad-003', name: 'Growth SaaS', platform: 'google', status: 'active', budget: 15000, spent: 12840, impressions: 890000, clicks: 24500, conversions: 680, cpc: 0.52 },
  { id: 'ad-004', name: 'B2B Leads', platform: 'linkedin', status: 'active', budget: 6000, spent: 4180, impressions: 320000, clicks: 6400, conversions: 180, cpc: 0.65 },
  { id: 'ad-005', name: 'Viral App', platform: 'tiktok', status: 'paused', budget: 5000, spent: 2100, impressions: 520000, clicks: 12400, conversions: 420, cpc: 0.17 },
  { id: 'ad-006', name: 'Display Network', platform: 'programmatic', status: 'active', budget: 3000, spent: 2480, impressions: 1200000, clicks: 4800, conversions: 95, cpc: 0.52 },
];

const mockDevTools: DevTool[] = [
  { id: 'dev-001', name: 'GitHub Enterprise', category: 'repository', provider: 'GitHub', seats: 25, cost: { amount: 840, cycle: 'monthly', nextBilling: new Date('2025-02-01') } },
  { id: 'dev-002', name: 'GitLab Ultimate', category: 'repository', provider: 'GitLab', seats: 10, cost: { amount: 760, cycle: 'monthly', nextBilling: new Date('2025-02-01') } },
  { id: 'dev-003', name: 'Figma Enterprise', category: 'design', provider: 'Figma', seats: 15, cost: { amount: 540, cycle: 'monthly', nextBilling: new Date('2025-02-01') } },
  { id: 'dev-004', name: 'Jira Enterprise', category: 'project', provider: 'Atlassian', seats: 30, cost: { amount: 425, cycle: 'monthly', nextBilling: new Date('2025-02-01') } },
  { id: 'dev-005', name: 'AWS Services', category: 'cloud', provider: 'AWS', seats: 1, cost: { amount: 4200, cycle: 'monthly', nextBilling: new Date('2025-02-01') } },
  { id: 'dev-006', name: 'GCP Services', category: 'cloud', provider: 'Google Cloud', seats: 1, cost: { amount: 1800, cycle: 'monthly', nextBilling: new Date('2025-02-01') } },
  { id: 'dev-007', name: 'Azure DevOps', category: 'cloud', provider: 'Microsoft', seats: 1, cost: { amount: 620, cycle: 'monthly', nextBilling: new Date('2025-02-01') } },
  { id: 'dev-008', name: 'Sentry', category: 'error', provider: 'Sentry', seats: 20, cost: { amount: 280, cycle: 'monthly', nextBilling: new Date('2025-02-01') } },
  { id: 'dev-009', name: 'Datadog', category: 'monitoring', provider: 'Datadog', seats: 15, cost: { amount: 620, cycle: 'monthly', nextBilling: new Date('2025-02-01') } },
];

const mockProjects: Project[] = [
  { id: 'prj-001', name: 'Plataforma Ads', client: 'Interno', status: 'active', type: 'internal', startDate: new Date('2024-01-01'), revenue: 0, cost: 45000, margin: 0 },
  { id: 'prj-002', name: 'App Mobile', client: 'TechCorp', status: 'active', type: 'client', startDate: new Date('2024-06-15'), revenue: 85000, cost: 42000, margin: 51 },
  { id: 'prj-003', name: 'E-commerce VX', client: 'VendasNow', status: 'active', type: 'client', startDate: new Date('2024-08-01'), revenue: 62000, cost: 38000, margin: 39 },
  { id: 'prj-004', name: 'CRM Enterprise', client: 'SalesPro', status: 'active', type: 'client', startDate: new Date('2024-09-01'), revenue: 120000, cost: 55000, margin: 54 },
  { id: 'prj-005', name: 'Dashboard BI', client: 'DataCorp', status: 'onhold', type: 'client', startDate: new Date('2024-10-01'), revenue: 45000, cost: 28000, margin: 38 },
  { id: 'prj-006', name: 'Sistema Gestão', client: 'GestorTech', status: 'completed', type: 'client', startDate: new Date('2024-03-01'), revenue: 95000, cost: 48000, margin: 49 },
];

const costTrendData = [
  { month: 'Jan', servers: 1850, services: 1200, ads: 28000, devtools: 8400, total: 39450 },
  { month: 'Feb', servers: 1920, services: 1250, ads: 29500, devtools: 8600, total: 41270 },
  { month: 'Mar', servers: 2100, services: 1300, ads: 31200, devtools: 8900, total: 43500 },
  { month: 'Apr', servers: 2050, services: 1350, ads: 29800, devtools: 9200, total: 42400 },
  { month: 'May', servers: 2200, services: 1400, ads: 32500, devtools: 9500, total: 45600 },
  { month: 'Jun', servers: 2350, services: 1450, ads: 35200, devtools: 10200, total: 49200 },
  { month: 'Jul', servers: 2400, services: 1500, ads: 38000, devtools: 10500, total: 54400 },
  { month: 'Aug', servers: 2480, services: 1550, ads: 36800, devtools: 10800, total: 55630 },
  { month: 'Sep', servers: 2520, services: 1580, ads: 39500, devtools: 11200, total: 58800 },
  { month: 'Oct', servers: 2600, services: 1620, ads: 42200, devtools: 11800, total: 62220 },
  { month: 'Nov', servers: 2680, services: 1650, ads: 38500, devtools: 12100, total: 58930 },
  { month: 'Dec', servers: 2740, services: 1700, ads: 42000, devtools: 12500, total: 63940 },
];

const formatBRL = (n: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(n);
const formatDate = (d: Date) => new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(d);
const daysUntil = (d: Date): number => Math.ceil((d.getTime() - Date.now()) / 86_400_000);
const formatNum = (n: number) => n.toLocaleString('pt-BR');

const Card: React.FC<{ title: string; children: React.ReactNode; colors: typeof darkColors }> = ({ title, children, colors }) => (
  <div style={{ background: colors.bgSecondary, borderRadius: 12, padding: 24, border: `1px solid ${colors.borderLight}` }}>
    <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: 16 }}>{title}</div>
    {children}
  </div>
);

const CostTrendChart: React.FC<{ data: typeof costTrendData; colors: typeof darkColors }> = ({ data, colors }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: colors.bgSecondary, border: `1px solid ${colors.success}`, borderRadius: 8, padding: '10px 14px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: colors.textMuted, marginBottom: 4 }}>{label}</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: colors.success }}>{formatBRL(payload[0].value)}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ height: 200 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.success} stopOpacity={0.25}/>
              <stop offset="95%" stopColor={colors.success} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: colors.textMuted, fontSize: 9 }} dy={4} />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="total" stroke={colors.success} strokeWidth={2} fill="url(#costGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const ProgressBar: React.FC<{ value: number; max?: number; color: string; bg: string; height?: number }> = ({ value, max = 100, color, bg, height = 6 }) => (
  <div style={{ height, background: bg, borderRadius: height / 2 }}>
    <div style={{ height: '100%', width: `${Math.min((value / max) * 100, 100)}%`, background: color, borderRadius: height / 2, transition: 'width 0.3s' }} />
  </div>
);

export default function ServersPage() {
  const { theme } = useTheme();
  const colors = theme === 'dark' ? darkColors : lightColors;
  const bp = useBreakpoint();
  const isMobile = bp === 'mobile';
  const isTablet = bp === 'tablet';
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const serversTotalMonthly = mockServers.reduce((a, s) => a + s.cost.amount, 0);
  const servicesTotalMonthly = mockServices.reduce((a, s) => a + s.cost.amount, 0);
  const adsTotalMonthly = mockAdPlatforms.reduce((a, p) => a + p.spent, 0);
  const adsBudgetMonthly = mockAdPlatforms.reduce((a, p) => a + p.budget, 0);
  const devToolsTotal = mockDevTools.reduce((a, d) => a + d.cost.amount, 0);
  
  const totalMonthlyRaw = serversTotalMonthly + servicesTotalMonthly + adsTotalMonthly + devToolsTotal;
  const totalAnnualRaw = totalMonthlyRaw * 12;
  
  const animatedServers = useCountUp(serversTotalMonthly, 1200);
  const animatedServices = useCountUp(servicesTotalMonthly, 1400);
  const animatedAds = useCountUp(adsTotalMonthly, 1600);
  const animatedDevTools = useCountUp(devToolsTotal, 1800);
  const animatedTotalMonthly = useCountUp(totalMonthlyRaw, 2000);
  
  const projectsRevenue = mockProjects.filter(p => p.type === 'client').reduce((a, p) => a + p.revenue, 0);
  const projectsCost = mockProjects.reduce((a, p) => a + p.cost, 0);
  const projectsMargin = projectsRevenue - projectsCost;

  const allUpcomingBills = [
    ...mockServers.map(s => ({ ...s.cost, item: s.name, type: 'server' as const })),
    ...mockServices.map(s => ({ ...s.cost, item: s.name, type: 'service' as const })),
    ...mockDevTools.map(d => ({ ...d.cost, item: d.name, type: 'devtool' as const })),
    ...mockAdPlatforms.map(a => ({ amount: a.budget, cycle: 'monthly' as const, item: a.name, type: 'ad' as const, nextBilling: new Date() })),
  ].sort((a, b) => daysUntil(a.nextBilling) - daysUntil(b.nextBilling));

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Resumo' },
    { id: 'servers', label: 'Servidores' },
    { id: 'services', label: 'Serviços' },
    { id: 'ads', label: 'Publicidade' },
    { id: 'devtools', label: 'Dev Tools' },
    { id: 'finance', label: 'Financeiro' },
    { id: 'projects', label: 'Projetos' },
  ];

  return (
    <div style={{ padding: isMobile ? 16 : 32, flex: 1 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: colors.bgSecondary, borderRadius: 10, padding: 4, width: 'fit-content' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 16px',
              borderRadius: 6,
              border: 'none',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 500,
              background: activeTab === tab.id ? colors.accent : 'transparent',
              color: activeTab === tab.id ? '#fff' : colors.textSecondary,
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 12 }}>
            <Card title="Servidores" colors={colors}>
              <div style={{ fontSize: 24, fontWeight: 700, color: colors.text }}>{formatBRL(animatedServers)}</div>
              <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 4 }}>{mockServers.length} ativos</div>
            </Card>
            <Card title="Serviços" colors={colors}>
              <div style={{ fontSize: 24, fontWeight: 700, color: colors.text }}>{formatBRL(animatedServices)}</div>
              <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 4 }}>{mockServices.length} serviços</div>
            </Card>
            <Card title="Publicidade" colors={colors}>
              <div style={{ fontSize: 24, fontWeight: 700, color: colors.text }}>{formatBRL(animatedAds)}</div>
              <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 4 }}>{formatBRL(adsBudgetMonthly - adsTotalMonthly)} restante</div>
            </Card>
            <Card title="Dev Tools" colors={colors}>
              <div style={{ fontSize: 24, fontWeight: 700, color: colors.text }}>{formatBRL(animatedDevTools)}</div>
              <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 4 }}>{mockDevTools.length} ferramentas</div>
            </Card>
          </div>

          <Card title="Tendência de Custos" colors={colors}>
            <CostTrendChart data={costTrendData} colors={colors} />
          </Card>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
            <Card title="Próximas Faturas" colors={colors}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {allUpcomingBills.slice(0, 6).map((bill, i) => {
                  const days = daysUntil(bill.nextBilling);
                  const isUrgent = days <= 7;
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: colors.bgTertiary, borderRadius: 8 }}>
                      <div>
                        <div style={{ fontSize: 12, color: colors.text }}>{bill.item}</div>
                        <div style={{ fontSize: 10, color: colors.textMuted, textTransform: 'capitalize' }}>{bill.type} • {formatDate(bill.nextBilling)}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: isUrgent ? colors.error : colors.text }}>{formatBRL(bill.amount)}</div>
                        <div style={{ fontSize: 10, color: colors.textMuted }}>{days <= 0 ? 'hoje' : `${days}d`}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card title="Resumo Financeiro" colors={colors}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 10, color: colors.textMuted }}>DESPESA MENSAL</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: colors.error }}>{formatBRL(animatedTotalMonthly)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: colors.textMuted }}>DESPESA ANUAL</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: colors.text }}>{formatBRL(totalAnnualRaw)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: colors.textMuted }}>RECEITA PROJETOS</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: colors.success }}>{formatBRL(projectsRevenue)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: colors.textMuted }}>MARGEM PROJETOS</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: projectsMargin > 0 ? colors.success : colors.error }}>{formatBRL(projectsMargin)}</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'servers' && (
        <div style={{ display: 'grid', gap: 12 }}>
          <Card title="Servidores" colors={colors}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {mockServers.map(server => (
                <div key={server.id} style={{ padding: 16, background: colors.bgTertiary, borderRadius: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>{server.name}</div>
                      <div style={{ fontSize: 11, color: colors.textMuted }}>{server.hostname}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: server.status === 'online' ? colors.success : server.status === 'degraded' ? colors.warning : colors.error }}>
                        {server.status === 'online' ? 'Online' : server.status === 'degraded' ? 'Degradado' : server.status === 'maintenance' ? 'Manutenção' : 'Offline'}
                      </div>
                      <div style={{ fontSize: 11, color: colors.textMuted }}>{server.provider} • {server.region}</div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 12, marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 10, color: colors.textMuted, marginBottom: 4 }}>CPU</div>
                      <ProgressBar value={server.usage.cpu.used} color={server.usage.cpu.used > 80 ? colors.error : colors.accent} bg={colors.bgTertiary} />
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: colors.textMuted, marginBottom: 4 }}>RAM</div>
                      <ProgressBar value={(server.usage.ram.used / server.usage.ram.total) * 100} color={server.usage.ram.used / server.usage.ram.total > 0.8 ? colors.error : colors.accent} bg={colors.bgTertiary} />
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: colors.textMuted, marginBottom: 4 }}>Storage</div>
                      <ProgressBar value={(server.usage.storage.used / server.usage.storage.total) * 100} color={server.usage.storage.used / server.usage.storage.total > 0.8 ? colors.error : colors.accent} bg={colors.bgTertiary} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                    <span style={{ color: colors.textMuted }}>Uptime: {server.usage.uptime}%</span>
                    <span style={{ color: colors.success, fontWeight: 600 }}>{formatBRL(server.cost.amount)}/mês</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'services' && (
        <div style={{ display: 'grid', gap: 12 }}>
          <Card title="Serviços de Hospedagem" colors={colors}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 12 }}>
              {mockServices.map(service => (
                <div key={service.id} style={{ padding: 16, background: colors.bgTertiary, borderRadius: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{service.name}</div>
                      <div style={{ fontSize: 11, color: colors.textMuted }}>{service.provider}</div>
                    </div>
                    <div style={{ 
                      padding: '4px 8px', 
                      borderRadius: 4, 
                      fontSize: 10, 
                      background: service.status === 'active' ? `${colors.success}22` : `${colors.warning}22`,
                      color: service.status === 'active' ? colors.success : colors.warning,
                    }}>
                      {service.status === 'active' ? 'Ativo' : 'Expirando'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                    <span style={{ color: colors.textMuted }}>{service.type}</span>
                    <span style={{ color: colors.success, fontWeight: 600 }}>{formatBRL(service.cost.amount)}/{service.cost.cycle === 'monthly' ? 'm' : 'a'}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'ads' && (
        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: 12 }}>
            <Card title="Orçamento" colors={colors}>
              <div style={{ fontSize: 24, fontWeight: 700, color: colors.text }}>{formatBRL(adsBudgetMonthly)}</div>
              <div style={{ fontSize: 11, color: colors.textMuted }}>mensal</div>
            </Card>
            <Card title="Gasto" colors={colors}>
              <div style={{ fontSize: 24, fontWeight: 700, color: colors.warning }}>{formatBRL(adsTotalMonthly)}</div>
              <div style={{ fontSize: 11, color: colors.textMuted }}>mensal</div>
            </Card>
            <Card title="Restante" colors={colors}>
              <div style={{ fontSize: 24, fontWeight: 700, color: colors.success }}>{formatBRL(adsBudgetMonthly - adsTotalMonthly)}</div>
              <div style={{ fontSize: 11, color: colors.textMuted }}>até final do mês</div>
            </Card>
          </div>

          <Card title="Plataformas de Publicidade" colors={colors}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {mockAdPlatforms.map(ad => (
                <div key={ad.id} style={{ padding: 16, background: colors.bgTertiary, borderRadius: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>{ad.name}</div>
                      <div style={{ fontSize: 11, color: colors.textMuted, textTransform: 'capitalize' }}>{ad.platform}</div>
                    </div>
                    <div style={{ 
                      padding: '4px 8px', 
                      borderRadius: 4, 
                      fontSize: 10, 
                      background: ad.status === 'active' ? `${colors.success}22` : `${colors.error}22`,
                      color: ad.status === 'active' ? colors.success : colors.error,
                    }}>
                      {ad.status === 'active' ? 'Ativo' : 'Pausado'}
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 16, marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 10, color: colors.textMuted }}>Gasto</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{formatBRL(ad.spent)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: colors.textMuted }}>Impressões</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{formatNum(ad.impressions)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: colors.textMuted }}>Cliques</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{formatNum(ad.clicks)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: colors.textMuted }}>Conv.</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: colors.success }}>{formatNum(ad.conversions)}</div>
                    </div>
                  </div>
                  <ProgressBar value={ad.spent} max={ad.budget} color={ad.spent > ad.budget * 0.9 ? colors.error : colors.accent} bg={colors.bgSecondary} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'devtools' && (
        <div style={{ display: 'grid', gap: 12 }}>
          <Card title="Ferramentas de Desenvolvimento" colors={colors}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: 12 }}>
              {mockDevTools.map(tool => (
                <div key={tool.id} style={{ padding: 16, background: colors.bgTertiary, borderRadius: 10 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: 4 }}>{tool.name}</div>
                  <div style={{ fontSize: 11, color: colors.textMuted, marginBottom: 8 }}>{tool.provider}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                    <span style={{ color: colors.textMuted }}>{tool.seats} seats</span>
                    <span style={{ color: colors.success, fontWeight: 600 }}>{formatBRL(tool.cost.amount)}/{tool.cost.cycle === 'monthly' ? 'm' : 'a'}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'finance' && (
        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 12 }}>
            <Card title="Despesa Mensal" colors={colors}>
              <div style={{ fontSize: 24, fontWeight: 700, color: colors.error }}>{formatBRL(animatedTotalMonthly)}</div>
            </Card>
            <Card title="Receita Clientes" colors={colors}>
              <div style={{ fontSize: 24, fontWeight: 700, color: colors.success }}>{formatBRL(projectsRevenue)}</div>
            </Card>
            <Card title="Lucro Projetos" colors={colors}>
              <div style={{ fontSize: 24, fontWeight: 700, color: projectsMargin > 0 ? colors.success : colors.error }}>{formatBRL(projectsMargin)}</div>
            </Card>
            <Card title="Margem %" colors={colors}>
              <div style={{ fontSize: 24, fontWeight: 700, color: (projectsMargin / projectsRevenue) * 100 > 30 ? colors.success : colors.warning }}>
                {projectsRevenue > 0 ? Math.round((projectsMargin / projectsRevenue) * 100) : 0}%
              </div>
            </Card>
          </div>

          <Card title="Detalhamento de Custos" colors={colors}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: colors.bgTertiary, borderRadius: 8 }}>
                <span style={{ color: colors.text }}>Servidores</span>
                <span style={{ color: colors.success, fontWeight: 600 }}>{formatBRL(serversTotalMonthly)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: colors.bgTertiary, borderRadius: 8 }}>
                <span style={{ color: colors.text }}>Serviços de Hospedagem</span>
                <span style={{ color: colors.success, fontWeight: 600 }}>{formatBRL(servicesTotalMonthly)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: colors.bgTertiary, borderRadius: 8 }}>
                <span style={{ color: colors.text }}>Publicidade (Ads)</span>
                <span style={{ color: colors.warning, fontWeight: 600 }}>{formatBRL(adsTotalMonthly)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: colors.bgTertiary, borderRadius: 8 }}>
                <span style={{ color: colors.text }}>Dev Tools</span>
                <span style={{ color: colors.success, fontWeight: 600 }}>{formatBRL(animatedDevTools)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 8, border: `1px solid ${colors.borderLight}` }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>Total</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: colors.text }}>{formatBRL(animatedTotalMonthly)}</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'projects' && (
        <div style={{ display: 'grid', gap: 12 }}>
          <Card title="Projetos" colors={colors}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {mockProjects.map(project => (
                <div key={project.id} style={{ padding: 16, background: colors.bgTertiary, borderRadius: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>{project.name}</div>
                      <div style={{ fontSize: 11, color: colors.textMuted }}>{project.client}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ 
                        padding: '4px 8px', 
                        borderRadius: 4, 
                        fontSize: 10, 
                        background: project.status === 'active' ? `${colors.success}22` : project.status === 'onhold' ? `${colors.warning}22` : `${colors.textMuted}22`,
                        color: project.status === 'active' ? colors.success : project.status === 'onhold' ? colors.warning : colors.textMuted,
                        marginBottom: 4,
                      }}>
                        {project.status === 'active' ? 'Ativo' : project.status === 'onhold' ? 'Pausado' : 'Concluído'}
                      </div>
                      <div style={{ fontSize: 10, color: colors.textMuted, textTransform: 'capitalize' }}>{project.type === 'internal' ? 'Interno' : 'Cliente'}</div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: 16 }}>
                    <div>
                      <div style={{ fontSize: 10, color: colors.textMuted }}>Receita</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: colors.success }}>{formatBRL(project.revenue)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: colors.textMuted }}>Custo</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: colors.error }}>{formatBRL(project.cost)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: colors.textMuted }}>Margem</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: project.margin > 40 ? colors.success : project.margin > 20 ? colors.warning : colors.error }}>
                        {project.margin}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}