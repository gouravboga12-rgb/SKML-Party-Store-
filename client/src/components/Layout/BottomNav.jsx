import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Heart, LayoutGrid } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';

const BottomNav = () => {
  const { wishlist } = useWishlist();
  const location = useLocation();

  const navItems = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'Shop', icon: ShoppingBag, path: '/shop' },
    { label: 'Wishlist', icon: Heart, path: '/wishlist', badge: wishlist.length },
    { label: 'Categories', icon: LayoutGrid, path: '/#categories' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/' && !location.hash;
    if (path.startsWith('/#')) {
      const hash = path.split('#')[1];
      return location.pathname === '/' && location.hash === `#${hash}`;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav 
      className="fixed bottom-8 left-0 right-0 z-[100] px-4 flex justify-center"
      style={{ marginBottom: 'var(--safe-area-bottom)' }}
    >
      <div className="w-full max-w-lg bg-white rounded-full shadow-[0_15px_60px_rgba(0,0,0,0.15)] border border-zinc-100 ring-1 ring-black/5">
        <div className="flex items-center justify-around py-2 px-2">
          {navItems.map(({ label, icon: Icon, path, badge }) => {
            const active = isActive(path);
            return (
              <NavLink
                key={label}
                to={path}
                className={`relative flex flex-col items-center gap-1 py-2 px-5 rounded-full transition-all duration-300 ${
                  active ? 'text-zinc-900 bg-zinc-100' : 'text-zinc-500 hover:text-zinc-900'
                }`}
                onClick={(e) => {
                  if (path.startsWith('/#') && location.pathname === '/') {
                    e.preventDefault();
                    const id = path.split('#')[1];
                    const element = document.getElementById(id);
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <Icon
                  size={22}
                  strokeWidth={active ? 2.5 : 1.8}
                  fill={active && label === 'Wishlist' ? 'currentColor' : 'none'}
                />
                <span className={`text-[9px] font-bold uppercase tracking-widest transition-all ${
                  active ? 'opacity-100' : 'opacity-80'
                }`}>
                  {label}
                </span>
                {badge > 0 && (
                  <span className="absolute top-1 right-3 bg-zinc-900 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
