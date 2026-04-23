import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/Auth';
import { LoginPage } from './components/Auth';
import { ToastProvider } from './components/Toast';
import { ThemeProvider, useTheme } from './components/Theme';
import { PageTransition } from './components/PageTransition';
import { Sidebar } from './components/Sidebar';
import { KPICardComponent } from './components/KPICard';
import { RevenueChart } from './components/RevenueChart';
import { OrdersTable } from './components/OrdersTable';
import { Heatmap } from './components/Heatmap';
import { TopProductsChart } from './components/TopProducts';
import { ActivityFeed } from './components/ActivityFeed';
import { AnalyticsPage } from './components/AnalyticsPage';
import { UsersPage } from './components/UsersPage';
import { ProductsPage } from './components/ProductsPage';
import { OrdersPage } from './components/OrdersPage';
import { SettingsPage } from './components/SettingsPage';
import { useRealTimeClock } from './hooks';
import { darkColors, lightColors } from './types';
import { mockKPIs, mockChartData, mockOrders, mockTopProducts, mockActivity, mockHeatmap } from './data';
import { ExportButton } from './components/ExportButton';

const globalStyles = `
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
  #root { min-height: 100vh; }
  input, button { font-family: inherit; }
`;

const DashboardPage: React.FC = () => {
  const [page, setPage] = useState(0);
  return (
    <div style={{ padding: 32, flex: 1 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }}>
        {mockKPIs.map((kpi, index) => (<KPICardComponent key={kpi.id} kpi={kpi} index={index} />))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <RevenueChart data={mockChartData} />
          <OrdersTable orders={mockOrders} page={page} onPageChange={setPage} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <Heatmap data={mockHeatmap} />
          <TopProductsChart products={mockTopProducts} />
          <ActivityFeed events={mockActivity} />
        </div>
      </div>
    </div>
  );
};

const PageHeader: React.FC<{ title: string; subtitle?: string; children?: React.ReactNode; colors: typeof darkColors }> = ({ title, subtitle, children, colors }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
    <div>
      <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 700, color: colors.text }}>{title}</h1>
      {subtitle && <p style={{ fontSize: 14, color: colors.textMuted, marginTop: 4 }}>{subtitle}</p>}
    </div>
    {children}
  </div>
);

const ProtectedLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { resolvedTheme } = useTheme();
  const colors = resolvedTheme === 'dark' ? darkColors : lightColors;
  const [activePage, setActivePage] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [prevPage, setPrevPage] = useState(activePage);
  const [transitionKey, setTransitionKey] = useState(0);
  const currentTime = useRealTimeClock();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (activePage !== prevPage) {
      setTransitionKey(k => k + 1);
      setPrevPage(activePage);
    }
  }, [activePage]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: colors.bg }}>
        <style>{globalStyles}</style>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 32, height: 32, border: `2px solid ${colors.border}`, borderTop: `2px solid ${colors.accent}`, borderRadius: 6, animation: 'spin 0.8s linear infinite' }} />
          <div style={{ color: colors.textMuted, fontSize: 12, marginTop: 12 }}>Carregando...</div>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (activePage) {
      case 'analytics': return <AnalyticsPage dateRange="30d" />;
      case 'users': return <UsersPage dateRange="30d" />;
      case 'products': return <ProductsPage dateRange="30d" />;
      case 'orders': return <OrdersPage dateRange="30d" />;
      case 'settings': return <SettingsPage dateRange="30d" />;
      default: return <DashboardPage />;
    }
  };

  const getPageInfo = () => {
    switch (activePage) {
      case 'dashboard': return { title: 'Dashboard', subtitle: 'Visão geral do seu negócio' };
      case 'analytics': return { title: 'Analytics', subtitle: 'Dados de desempenho' };
      case 'users': return { title: 'Usuários', subtitle: 'Gerencie seus clientes' };
      case 'products': return { title: 'Produtos', subtitle: 'Catálogo de produtos' };
      case 'orders': return { title: 'Pedidos', subtitle: 'Gerencie pedidos' };
      case 'settings': return { title: 'Configurações', subtitle: 'Preferências da loja' };
      default: return { title: 'Dashboard', subtitle: '' };
    }
  };

  const pageInfo = getPageInfo();
  const showExport = ['users', 'products', 'orders'].includes(activePage);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: colors.bg }}>
      <style>{globalStyles}</style>
      <Sidebar activeItem={activePage} onItemChange={setActivePage} userName={user?.name} userEmail={user?.email} />
      <div style={{ marginLeft: 240, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 16, padding: '16px 32px', borderBottom: `1px solid ${colors.borderLight}`, background: colors.bgSecondary }}>
          <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: 'transparent', border: `1px solid ${colors.borderLight}`, borderRadius: 8, fontSize: 12, color: colors.textMuted, cursor: 'pointer' }}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sair
          </button>
          <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, fontFamily: "'Space Grotesk', sans-serif" }}>
            {new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(currentTime)}
          </div>
        </div>
        <PageTransition key={transitionKey} isActive>
          <div style={{ padding: 32, flex: 1, animation: 'fadeIn 0.3s ease-out' }}>
            <PageHeader title={pageInfo.title} subtitle={pageInfo.subtitle} colors={colors}>
              {showExport && (
                <ExportButton data={mockOrders as unknown as Record<string, unknown>[]} filename={activePage} label="Exportar CSV" />
              )}
            </PageHeader>
            {renderPage()}
          </div>
        </PageTransition>
      </div>
    </div>
  );
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" state={{ from: location }} replace /> : <LoginPage />} />
      <Route path="/*" element={isAuthenticated ? <ProtectedLayout /> : <Navigate to="/login" state={{ from: location }} replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <ThemeProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </ThemeProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}