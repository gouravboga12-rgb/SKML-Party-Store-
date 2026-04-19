import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { motion } from 'framer-motion';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartCount } = useCart();
  const navigate = useNavigate();

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

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md py-4 shadow-sm border-b border-zinc-100' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Logo (Left) */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <img src="/logo.jpeg" alt="SKML Logo" className="h-10 w-10 md:h-12 md:w-12 object-cover rounded-full border border-secondary/30 shadow-lg" />
            <span className={`inline-block font-black text-[10px] sm:text-xs md:text-sm lg:text-base tracking-[0.2em] uppercase whitespace-nowrap transition-colors duration-300 ${isScrolled ? 'text-zinc-900' : 'text-white'}`}>
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
                  isScrolled 
                    ? 'bg-zinc-100 border-zinc-200 text-zinc-900 focus:bg-white focus:border-secondary' 
                    : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-zinc-400'
                }`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                isScrolled ? 'text-zinc-400 group-focus-within:text-secondary' : 'text-zinc-400 group-focus-within:text-zinc-900'
              }`} size={18} />
            </form>
          </div>

          {/* Icons (Right) */}
          <div className="flex items-center gap-4">
            {/* Mobile Search Toggle */}
            <button 
              className={`md:hidden hover:text-secondary transition-colors ${isScrolled ? 'text-zinc-900' : 'text-white'}`}
              onClick={() => setShowSearch(!showSearch)}
            >
              {showSearch ? <X size={24} /> : <Search size={22} />}
            </button>

            {/* Cart Icon */}
            <Link to="/cart" className={`relative hover:text-secondary transition-all group ${isScrolled ? 'text-zinc-900' : 'text-white'}`}>
              <motion.div 
                key={cartCount}
                initial={{ scale: 1 }}
                animate={cartCount > 0 ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
                className={`p-2.5 rounded-full transition-colors ${isScrolled ? 'bg-zinc-100 group-hover:bg-zinc-200' : 'bg-white/10 group-hover:bg-white/20 border border-white/20'}`}
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
  );
};

export default Header;
