import React from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Receipt,
  FileText,
  Settings,
  Users,
  Bell,
  LogOut,
  CreditCard,
  BarChart3,
  Link as LinkIcon,
  Target,
  DollarSign,
  Menu,
  ChevronDown
} from 'lucide-react';
import Logo from '../ui/Logo';

interface DashboardLayoutProps {
  isAdmin?: boolean;
}

const DashboardLayout = ({ isAdmin = false }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthContext();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const userNavigation = [
    { name: 'Tableau de bord', icon: LayoutDashboard, href: '/app' },
    { name: 'Produits', icon: Package, href: '/app/products' },
    { name: 'Services', icon: ShoppingBag, href: '/app/services' },
    { name: 'Ventes', icon: Receipt, href: '/app/sales' },
    { name: 'Ventes d\'abonnements', icon: CreditCard, href: '/app/subscription-sales' },
    { name: 'Dépenses', icon: DollarSign, href: '/app/expenses' },
    { name: 'Objectifs', icon: Target, href: '/app/goals' },
    { name: 'Liens numériques', icon: LinkIcon, href: '/app/digital-links' },
    { name: 'Rapports', icon: FileText, href: '/app/reports' },
    { name: 'Paramètres', icon: Settings, href: '/app/settings' }
  ];

  const adminNavigation = [
    { name: 'Tableau de bord', icon: LayoutDashboard, href: '/admin' },
    { name: 'Utilisateurs', icon: Users, href: '/admin/users' },
    { name: 'Abonnements', icon: CreditCard, href: '/admin/subscriptions' },
    { name: 'Analyses', icon: BarChart3, href: '/admin/analytics' },
    { name: 'Notifications', icon: Bell, href: '/admin/notifications' },
    { name: 'Paramètres', icon: Settings, href: '/admin/settings' }
  ];

  const navigation = isAdmin ? adminNavigation : userNavigation;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 bg-gray-900 text-white z-20">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-800 focus:outline-none"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="ml-4">
                <Logo />
              </div>
            </div>
            <div className="flex items-center" ref={dropdownRef}>
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-800 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium">{user?.name}</div>
                    <div className="text-xs text-gray-400">{user?.email}</div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to={isAdmin ? "/admin/settings" : "/app/settings"}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      Paramètres
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 pt-16 flex">
        <div
          className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden ${
            isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsSidebarOpen(false)}
        />

        <div
          className={`relative flex-1 flex flex-col w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0`}
        >
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}

            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-400 hover:bg-gray-800 hover:text-red-300 rounded-lg transition-colors mt-auto"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Se déconnecter
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64 pt-16">
        <main className="p-4 sm:p-6 lg:p-8 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;