import { clsx } from 'clsx'; 
import { 
  LayoutDashboard, 
  BarChart3, 
  Users, 
  ShoppingBag, 
  ShoppingCart, 
  Settings, 
  Server, 
  DollarSign
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
}

interface SidebarProps {
  activeItem: string;
  onItemChange: (id: string) => void;
  userName?: string;
  userEmail?: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'finance', label: 'Financeiro' },
  { id: 'users', label: 'Usuários' },
  { id: 'products', label: 'Produtos' },
  { id: 'orders', label: 'Pedidos' },
  { id: 'servers', label: 'Infraestrutura' },
  { id: 'settings', label: 'Configurações' },
];

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  dashboard: LayoutDashboard,
  analytics: BarChart3,
  users: Users,
  products: ShoppingBag,
  orders: ShoppingCart,
  settings: Settings,
  servers: Server,
  dollar: DollarSign,
};

export type { SidebarProps };

export const Sidebar = ({ 
  activeItem, 
  onItemChange, 
  userName = 'Admin',
  userEmail = 'admin@empresa.com'
}: SidebarProps) => {
  return (
    <aside className="w-60 bg-dark-900 border-r border-dark-800 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-8 border-b border-dark-800">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-dark-100 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            LUME
          </span>
          <span className="text-xs font-medium text-accent tracking-wide">
            STUDIO
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = iconMap[item.id];
          const isActive = activeItem === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onItemChange(item.id)}
              className={clsx(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-150',
                'text-left text-sm font-medium',
                isActive 
                  ? 'bg-accent/15 text-accent-hover' 
                  : 'text-dark-400 hover:text-dark-200 hover:bg-dark-800'
              )}
            >
              {Icon && <Icon className="w-4 h-4" />}
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-dark-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
            <span className="text-sm font-semibold text-white">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-dark-200 truncate">
              {userName}
            </p>
            <p className="text-xs text-dark-500 truncate">
              {userEmail}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};