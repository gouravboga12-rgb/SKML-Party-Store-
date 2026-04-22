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
      className="fixed z-[100] transition-all duration-500
        bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-zinc-100 pb-[env(safe-area-inset-bottom)] 
        lg:bottom-8 lg:left-1/2 lg:-translate-x-1/2 lg:right-auto lg:w-max lg:rounded-full lg:shadow-[0_15px_60px_rgba(0,0,0,0.15)] lg:border lg:px-8 lg:pb-0 lg:bg-white"
    >
      <div className="flex items-center justify-around py-2 lg:py-3 lg:gap-8">
        {navItems.map(({ label, icon: Icon, path, badge }) => {
          const active = isActive(path);
          return (
            <NavLink
              key={label}
              to={path}
              className={`relative flex flex-col items-center gap-1.5 py-1 px-4 lg:px-2 transition-all duration-300 ${
                active ? 'text-zinc-900 lg:bg-zinc-100 lg:rounded-full lg:px-6' : 'text-zinc-400 hover:text-zinc-900'
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
              <span className={`text-[8px] lg:text-[9px] font-black uppercase tracking-tighter lg:tracking-widest transition-all ${
                active ? 'opacity-100' : 'opacity-70'
              }`}>
                {label}
              </span>
              {badge > 0 && (
                <span className="absolute top-1 right-2 lg:-top-1 lg:right-0 bg-zinc-900 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
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
