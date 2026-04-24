import React from 'react';
import { useTheme } from './Theme';
import { darkColors, lightColors } from '../types';
import KPICards from './KPICards';
import { 
  AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, 
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

interface AnalyticsPageProps {
  dateRange: 'today' | '7d' | '30d' | 'custom';
}

const mockKPIs = [
  { id: 'visitors', label: 'VISITANTES', value: 124500, unit: 'number' as const, variation: 12.4 },
  { id: 'pageviews', label: 'PAGEVIEWS', value: 482300, unit: 'number' as const, variation: 8.7 },
  { id: 'time', label: 'TEMPO MÉDIO', value: 4.53, unit: 'number' as const, variation: 5.2, subtitle: '4m 32s' },
  { id: 'bounce', label: 'TAXA REJEIÇÃO', value: 32.1, unit: 'percentage' as const, variation: -4.3 },
  { id: 'conversion', label: 'CONVERSÃO', value: 3.2, unit: 'percentage' as const, variation: 0.8 },
  { id: 'revenue', label: 'RECEITA', value: 284500, unit: 'currency' as const, variation: 15.2 },
];

const mockTrafficSources = [
  { name: 'Orgânico', value: 45, color: '#A78BFA' },
  { name: 'Direto', value: 28, color: '#8B5CF6' },
  { name: 'Social', value: 15, color: '#3B82F6' },
  { name: 'Referral', value: 8, color: '#F59E0B' },
  { name: 'Email', value: 4, color: '#10B981' },
];

const mockDevices = [
  { name: 'Desktop', value: 58, color: '#8B5CF6' },
  { name: 'Mobile', value: 35, color: '#3B82F6' },
  { name: 'Tablet', value: 7, color: '#F59E0B' },
];

const mockOrderStatus = [
  { name: 'Entregue', value: 65, color: '#10B981' },
  { name: 'Processando', value: 20, color: '#8B5CF6' },
  { name: 'Pendente', value: 10, color: '#F59E0B' },
  { name: 'Cancelado', value: 5, color: '#EF4444' },
];

const mockTopPages = [
  { page: '/produtos', views: 45230 },
  { page: '/carrinho', views: 28450 },
  { page: '/checkout', views: 18230 },
  { page: '/contato', views: 9450 },
  { page: '/sobre', views: 7230 },
];

const mockRevenueData = [
  { month: 'Jan', revenue: 185000, orders: 1240 },
  { month: 'Fev', revenue: 212000, orders: 1380 },
  { month: 'Mar', revenue: 198000, orders: 1290 },
  { month: 'Abr', revenue: 245000, orders: 1520 },
  { month: 'Mai', revenue: 228000, orders: 1410 },
  { month: 'Jun', revenue: 265000, orders: 1680 },
  { month: 'Jul', revenue: 289000, orders: 1820 },
  { month: 'Ago', revenue: 312000, orders: 1950 },
  { month: 'Set', revenue: 278000, orders: 1740 },
  { month: 'Out', revenue: 295000, orders: 1880 },
  { month: 'Nov', revenue: 342000, orders: 2150 },
  { month: 'Dez', revenue: 398000, orders: 2480 },
];

const mockHourlyData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i.toString().padStart(2, '0')}:00`,
  views: Math.floor(Math.random() * 5000) + 1000,
}));

const mockWeekData = [
  { day: 'Seg', views: 45230 },
  { day: 'Ter', views: 52340 },
  { day: 'Qua', views: 48920 },
  { day: 'Qui', views: 51200 },
  { day: 'Sex', views: 58400 },
  { day: 'Sáb', views: 32100 },
  { day: 'Dom', views: 28450 },
];

const mockCountryData = [
  { country: 'Brasil', visitors: 89500, revenue: 185000 },
  { country: 'Portugal', visitors: 12400, revenue: 28000 },
  { country: 'EUA', visitors: 8200, revenue: 42000 },
  { country: 'Argentina', visitors: 5100, revenue: 12000 },
  { country: 'Espanha', visitors: 3800, revenue: 8500 },
];

const mockConversions = [
  { step: 'Visitantes', value: 100, fill: '#8B5CF6' },
  { step: 'Pageviews', value: 387, fill: '#3B82F6' },
  { step: 'Add Carrinho', value: 42, fill: '#F59E0B' },
  { step: 'Checkout', value: 18, fill: '#10B981' },
  { step: 'Comprou', value: 12, fill: '#10B981' },
];

interface MiniPieProps {
  data: { name: string; value: number; color: string }[];
  colors: typeof darkColors;
}

const MiniPie: React.FC<MiniPieProps> = ({ data, colors }) => {
  const total = data.reduce((acc, d) => acc + d.value, 0);
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      return (
        <div style={{ 
          background: colors.bgSecondary, 
          border: `1px solid ${item.payload.color}`, 
          borderRadius: 8, 
          padding: '8px 12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: colors.textMuted }}>{item.name}</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: item.payload.color }}>{Math.round((item.value / total) * 100)}%</div>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, height: '100%' }}>
      <div style={{ width: '40%', height: '100%', minHeight: 120 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={28}
              outerRadius={48}
              dataKey="value"
              nameKey="name"
            >
              {data.map((item, i) => (
                <Cell key={i} fill={item.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minWidth: 0 }}>
        {data.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: item.color, flexShrink: 0 }} />
            <span style={{ color: colors.textSecondary, flex: 1 }}>{item.name}</span>
            <span style={{ color: colors.text, fontWeight: 600, flexShrink: 0 }}>{Math.round((item.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface MiniBarProps {
  data: { page: string; views: number }[];
  colors: typeof darkColors;
}

const MiniPagesBar: React.FC<MiniBarProps> = ({ data, colors }) => {
  const max = Math.max(...data.map(d => d.views));
  const [hovered, setHovered] = React.useState<number | null>(null);
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%' }}>
      {data.map((item, i) => (
        <div 
          key={i}
          style={{ cursor: 'pointer' }}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
            <span style={{ color: colors.textSecondary }}>{item.page}</span>
            <span style={{ color: colors.text, fontWeight: 600 }}>{item.views.toLocaleString()}</span>
          </div>
          <div style={{ height: 6, background: colors.bgTertiary, borderRadius: 3 }}>
            <div 
              style={{ 
                height: '100%', 
                width: `${(item.views / max) * 100}%`, 
                background: hovered === i ? colors.accentHover : colors.accent, 
                borderRadius: 3,
                transition: 'background 0.2s'
              }} 
            />
          </div>
        </div>
      ))}
    </div>
  );
};

interface RevenueChartProps {
  data: { month: string; revenue: number }[];
  colors: typeof darkColors;
}

const RevenueArea: React.FC<RevenueChartProps> = ({ data, colors }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          background: colors.bgSecondary, 
          border: `1px solid ${colors.accent}`, 
          borderRadius: 8, 
          padding: '10px 14px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: colors.textMuted, marginBottom: 4 }}>{label}</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: colors.accent }}>
            {payload[0].value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ height: '100%', minHeight: 180 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.accent} stopOpacity={0.25}/>
              <stop offset="95%" stopColor={colors.accent} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: colors.textMuted, fontSize: 9 }} dy={4} />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="revenue" stroke={colors.accent} strokeWidth={2} fill="url(#revGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

interface HourlyChartProps {
  data: { hour: string; views: number }[];
  colors: typeof darkColors;
}

const HourlyBar: React.FC<HourlyChartProps> = ({ data, colors }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          background: colors.bgSecondary, 
          border: `1px solid ${colors.info}`, 
          borderRadius: 8, 
          padding: '8px 12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: colors.textMuted }}>{label}</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: colors.info }}>{payload[0].value.toLocaleString()}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ height: '100%', minHeight: 120 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: colors.textMuted, fontSize: 8 }} interval={3} />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="views" fill={colors.info} fillOpacity={0.6} radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

interface WeekChartProps {
  data: { day: string; views: number }[];
  colors: typeof darkColors;
}

const WeekBars: React.FC<WeekChartProps> = ({ data, colors }) => {
  const max = Math.max(...data.map(d => d.views));
  const [hovered, setHovered] = React.useState<number | null>(null);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: '100%', minHeight: 80 }}>
      {data.map((item, i) => (
        <div 
          key={i} 
          style={{ flex: 1, textAlign: 'center', cursor: 'pointer' }}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
        >
          <div style={{ 
            height: `${(item.views / max) * 100}%`, 
            background: hovered === i ? colors.accentHover : (i >= 5 ? colors.warning : colors.accent), 
            borderRadius: 3,
            minHeight: 4,
            transition: 'background 0.2s'
          }} />
          <div style={{ fontSize: 8, color: colors.textMuted, marginTop: 4 }}>{item.day}</div>
          {hovered === i && (
            <div style={{ 
              position: 'absolute', 
              background: colors.bgSecondary, 
              border: `1px solid ${colors.accent}`, 
              borderRadius: 6, 
              padding: '4px 8px',
              fontSize: 10,
              fontWeight: 600,
              color: colors.text,
              marginTop: -4,
              zIndex: 10
            }}>
              {item.views.toLocaleString()}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

interface FunnelProps {
  data: { step: string; value: number; fill: string }[];
  colors: typeof darkColors;
}

const FunnelViz: React.FC<FunnelProps> = ({ data, colors }) => {
  const max = Math.max(...data.map(d => d.value));
  const [hovered, setHovered] = React.useState<number | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: '100%' }}>
      {data.map((item, i) => (
        <div 
          key={i}
          style={{ cursor: 'pointer' }}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
            <span style={{ color: colors.textSecondary }}>{item.step}</span>
            <span style={{ color: hovered === i ? item.fill : colors.text, fontWeight: 600 }}>{item.value}%</span>
          </div>
          <div style={{ height: 24, background: colors.bgTertiary, borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ 
              height: '100%', 
              width: `${(item.value / max) * 100}%`, 
              background: hovered === i ? item.fill : `${item.fill}cc`, 
              borderRadius: 4,
              transition: 'background 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingRight: 8
            }}>
              {hovered === i && (
                <span style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>{item.value}%</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ dateRange: _dateRange }) => {
  const { theme } = useTheme();
  const colors = theme === 'dark' ? darkColors : lightColors;

  const totalRevenue = mockRevenueData.reduce((acc, d) => acc + d.revenue, 0);

  return (
    <div>
      <KPICards cards={mockKPIs} loading={false} />

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginTop: 24 }}>
        <div style={{ background: colors.bgSecondary, borderRadius: 12, padding: 20, border: `1px solid ${colors.borderLight}`, display: 'flex', flexDirection: 'column', minHeight: 280 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 10, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>Receita Total</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: colors.text }}>
                {totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: colors.textMuted }}>+15.2%</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: colors.success }}>+R$ 37.400</div>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <RevenueArea data={mockRevenueData} colors={colors} />
          </div>
        </div>

        <div style={{ background: colors.bgSecondary, borderRadius: 12, padding: 20, border: `1px solid ${colors.borderLight}`, display: 'flex', flexDirection: 'column', minHeight: 280 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: colors.text, marginBottom: 12 }}>Pedidos</div>
          <div style={{ flex: 1 }}>
            <MiniPie data={mockOrderStatus} colors={colors} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
        <div style={{ background: colors.bgSecondary, borderRadius: 12, padding: 20, border: `1px solid ${colors.borderLight}`, minHeight: 200, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: colors.text, marginBottom: 12 }}>Tráfego</div>
          <div style={{ flex: 1 }}>
            <MiniPie data={mockTrafficSources} colors={colors} />
          </div>
        </div>
        
        <div style={{ background: colors.bgSecondary, borderRadius: 12, padding: 20, border: `1px solid ${colors.borderLight}`, minHeight: 200, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: colors.text, marginBottom: 12 }}>Dispositivos</div>
          <div style={{ flex: 1 }}>
            <MiniPie data={mockDevices} colors={colors} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
        <div style={{ background: colors.bgSecondary, borderRadius: 12, padding: 20, border: `1px solid ${colors.borderLight}`, minHeight: 200, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: colors.text, marginBottom: 12 }}>Páginas</div>
          <div style={{ flex: 1 }}>
            <MiniPagesBar data={mockTopPages} colors={colors} />
          </div>
        </div>

        <div style={{ background: colors.bgSecondary, borderRadius: 12, padding: 20, border: `1px solid ${colors.borderLight}`, minHeight: 200, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: colors.text, marginBottom: 12 }}>Funil</div>
          <div style={{ flex: 1 }}>
            <FunnelViz data={mockConversions} colors={colors} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
        <div style={{ background: colors.bgSecondary, borderRadius: 12, padding: 20, border: `1px solid ${colors.borderLight}`, display: 'flex', flexDirection: 'column', minHeight: 180 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: colors.text, marginBottom: 12 }}>Dia da Semana</div>
          <div style={{ flex: 1 }}>
            <WeekBars data={mockWeekData} colors={colors} />
          </div>
        </div>

        <div style={{ background: colors.bgSecondary, borderRadius: 12, padding: 20, border: `1px solid ${colors.borderLight}`, display: 'flex', flexDirection: 'column', minHeight: 180 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: colors.text, marginBottom: 12 }}>Por Hora</div>
          <div style={{ flex: 1 }}>
            <HourlyBar data={mockHourlyData} colors={colors} />
          </div>
        </div>
      </div>

      <div style={{ background: colors.bgSecondary, borderRadius: 12, padding: 20, border: `1px solid ${colors.borderLight}`, marginTop: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: colors.text, marginBottom: 16 }}>Por País</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
          {mockCountryData.map((item, i) => (
            <div key={i} style={{ textAlign: 'center', padding: 16, background: colors.bgTertiary, borderRadius: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: colors.text, marginBottom: 4 }}>{item.country}</div>
              <div style={{ fontSize: 10, color: colors.textMuted }}>{item.visitors.toLocaleString()} visits</div>
              <div style={{ fontSize: 11, color: colors.success, marginTop: 4 }}>
                {item.revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};