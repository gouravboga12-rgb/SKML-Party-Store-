import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  Database, 
  Settings, 
  LogOut, 
  Store,
  ChevronRight,
  Menu,
  X,
  ShoppingBag,
  MessageSquare,
  Users
} from 'lucide-react';

import { supabase } from '../../lib/supabase';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
    { name: 'Products', icon: <Package size={20} />, path: '/admin/products' },
    { name: 'Orders', icon: <ShoppingBag size={20} />, path: '/admin/orders' },
    { name: 'Reviews', icon: <MessageSquare size={20} />, path: '/admin/reviews' },
    { name: 'Categories', icon: <Tags size={20} />, path: '/admin/categories' },
    { name: 'Users', icon: <Users size={20} />, path: '/admin/users' },
    { name: 'Migration', icon: <Database size={20} />, path: '/admin/migration' },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900 text-white transition-transform duration-300 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0 print:hidden`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
                <span className="text-black font-black text-xs">SKML</span>
              </div>
              <span className="font-bold tracking-tighter uppercase">Admin Panel</span>
            </Link>
            <button 
              className="lg:hidden text-zinc-400 hover:text-white"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 mt-4">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center justify-between p-3 rounded-md transition-all group ${
                    isActive 
                      ? 'bg-white text-black' 
                      : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="text-sm font-medium uppercase tracking-wider">{item.name}</span>
                  </div>
                  {isActive && <ChevronRight size={14} />}
                </Link>
              );
            })}
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t border-zinc-800 space-y-2">
            <Link 
              to="/" 
              className="flex items-center gap-3 p-3 text-zinc-400 hover:text-white transition-colors"
            >
              <Store size={20} />
              <span className="text-sm font-medium uppercase tracking-wider">Back to Store</span>
            </Link>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 text-zinc-400 hover:text-red-400 transition-colors"
            >
              <LogOut size={20} />
              <span className="text-sm font-medium uppercase tracking-wider">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden print:overflow-visible">
        {/* Header */}
        <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-6 sticky top-0 z-10 print:hidden">
          <button 
            className="lg:hidden text-zinc-600"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center gap-4 ml-auto">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-zinc-900 uppercase">Administrator</p>
              <p className="text-[10px] text-zinc-500 uppercase">Super Admin</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-white text-xs font-bold">
              AD
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
