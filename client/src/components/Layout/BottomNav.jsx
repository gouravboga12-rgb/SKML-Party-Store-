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
      className="fixed bottom-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-md border-t border-zinc-100 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ label, icon: Icon, path, badge }) => {
          const active = isActive(path);
          return (
            <NavLink
              key={label}
              to={path}
              className={`relative flex flex-col items-center gap-1.5 py-1 px-4 transition-all duration-300 ${
                active ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'
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
              <div className={`transition-transform duration-300 ${active ? 'scale-110' : ''}`}>
                <Icon
                  size={20}
                  strokeWidth={active ? 2.5 : 2}
                  fill={active && label === 'Wishlist' ? 'currentColor' : 'none'}
                />
              </div>
              <span className={`text-[8px] font-black uppercase tracking-tighter transition-all ${
                active ? 'opacity-100' : 'opacity-70'
              }`}>
                {label}
              </span>
              {badge > 0 && (
                <span className="absolute top-1 right-2 bg-zinc-900 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                  {badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
