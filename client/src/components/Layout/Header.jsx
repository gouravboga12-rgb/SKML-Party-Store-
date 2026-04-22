import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, X, User, LogOut, Package, ShoppingBag, MessageSquare } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartCount, clearCart } = useCart();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Force header to be solid on all pages except the Home page hero
  const isHomePage = location.pathname === '/';
  const shouldBeSolid = isScrolled || !isHomePage;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${searchQuery}`);
      setShowSearch(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    clearCart(); // Clear the cart when user logs out
    setShowUserMenu(false);
    navigate('/');
  };

  const announcements = [
    "SALE IS LIVE! PREMIUM BACKDROPS - SHOP NOW",
    "FREE CONSULTATION & CUSTOM SIZES AVAILABLE VIA WHATSAPP",
    "FAST DCDT COURIER SHIPPING PAN-INDIA - ORDER TODAY",
    "SKML PARTY STORE: CRAFTING ELEGANCE FOR EVERY CELEBRATION"
  ];

  return (
    <>
      {/* Announcement Bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-zinc-900 text-white overflow-hidden py-2 border-b border-white/5">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...announcements, ...announcements].map((text, idx) => (
            <span key={idx} className="inline-block px-12 text-[10px] font-black uppercase tracking-[0.3em]">
              {text}
            </span>
          ))}
        </div>
      </div>

      <header 
        className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
          shouldBeSolid ? 'bg-white/95 backdrop-blur-md py-4 shadow-sm border-b border-zinc-100' : 'bg-transparent py-6'
        } top-8`}
      >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Logo (Left) */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <img src="/logo.jpeg" alt="SKML Logo" className="h-10 w-10 md:h-12 md:w-12 object-cover rounded-full border border-secondary/30 shadow-lg" />
            <span className={`inline-block font-black text-[10px] sm:text-xs md:text-sm lg:text-base tracking-[0.2em] uppercase whitespace-nowrap transition-colors duration-300 ${shouldBeSolid ? 'text-zinc-900' : 'text-white'}`}>
              SKML Party Store
            </span>
          </Link>

          {/* Search Bar (Center) */}
          <div className="flex-1 max-w-xl hidden md:block">
            <form onSubmit={handleSearch} className="relative group">
              <input 
                type="text" 
                placeholder="Search premium collections..." 
                className={`w-full border rounded-full py-2.5 px-6 pl-12 text-sm focus:outline-none transition-all ${
                  shouldBeSolid 
                    ? 'bg-zinc-100 border-zinc-200 text-zinc-900 focus:bg-white focus:border-secondary' 
                    : 'bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20'
                }`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                shouldBeSolid ? 'text-zinc-400 group-focus-within:text-secondary' : 'text-white/60 group-focus-within:text-white'
              }`} size={18} />
            </form>
          </div>

          {/* Icons (Right) */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Mobile Search Toggle */}
            <button 
              className={`md:hidden p-2 hover:text-secondary transition-colors ${shouldBeSolid ? 'text-zinc-900' : 'text-white'}`}
              onClick={() => setShowSearch(!showSearch)}
            >
              {showSearch ? <X size={24} /> : <Search size={22} />}
            </button>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`p-2.5 rounded-full transition-all hover:scale-105 ${shouldBeSolid ? 'text-zinc-900 bg-zinc-100 hover:bg-zinc-200' : 'text-white bg-white/10 hover:bg-white/20 border border-white/20'}`}
              >
                <User size={22} />
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-64 bg-white border border-zinc-100 shadow-2xl rounded-sm overflow-hidden py-2 z-[60]"
                  >
                    {user ? (
                      <>
                        <div className="px-6 py-4 border-b border-zinc-50">
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Authenticated as</p>
                          <p className="text-sm font-bold text-zinc-900 truncate">{user.email}</p>
                        </div>
                        <Link to="/profile" className="flex items-center gap-3 px-6 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest hover:bg-zinc-50 hover:text-zinc-900 transition-colors">
                          <User size={14} /> My Profile
                        </Link>
                        <Link 
                          to="/my-orders" 
                          className="flex items-center gap-3 px-6 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                        >
                          <ShoppingBag size={14} /> My Orders
                        </Link>
                        <Link 
                          to="/my-reviews" 
                          className="flex items-center gap-3 px-6 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                        >
                          <MessageSquare size={14} /> My Reviews
                        </Link>
                        <button 
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-6 py-4 text-[10px] font-black text-red-500 uppercase tracking-widest hover:bg-red-50 transition-colors border-t border-zinc-50 mt-2"
                        >
                          <LogOut size={14} /> Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="px-6 py-4 border-b border-zinc-50">
                          <p className="text-[10px] font-black text-zinc-900 uppercase tracking-widest">Premium Collections</p>
                          <p className="text-[9px] text-zinc-400 uppercase mt-1">Sign in to unlock exclusive party decor deals</p>
                        </div>
                        <Link 
                          to="/login" 
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-6 py-4 text-[10px] font-black text-zinc-900 uppercase tracking-[0.2em] hover:bg-zinc-50 transition-colors"
                        >
                          Login to Account
                        </Link>
                        <Link 
                          to="/signup" 
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center mx-4 py-3 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-[0.2em] justify-center hover:bg-secondary transition-all rounded-sm"
                        >
                          Create Account
                        </Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart Icon */}
            <Link to="/cart" className={`relative group ${isScrolled ? 'text-zinc-900' : 'text-white'}`}>
              <motion.div 
                key={cartCount}
                initial={{ scale: 1 }}
                animate={cartCount > 0 ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
                className={`p-2.5 rounded-full transition-all hover:scale-105 ${shouldBeSolid ? 'bg-zinc-100 group-hover:bg-zinc-200' : 'bg-white/10 group-hover:bg-white/20 border border-white/20'}`}
              >
                <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
              </motion.div>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-zinc-900 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg transform group-hover:-translate-y-1 transition-transform">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search Dropdown */}
        {showSearch && (
          <div className="md:hidden mt-4 pb-2 animate-in slide-in-from-top duration-300">
            <form onSubmit={handleSearch} className="relative">
              <input 
                type="text" 
                placeholder="Search products..." 
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg py-3 px-12 text-sm text-zinc-900 focus:outline-none focus:border-zinc-400"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            </form>
          </div>
        )}
      </div>
    </header>
    </>
  );
};

export default Header;
