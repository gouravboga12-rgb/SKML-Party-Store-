import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

const CartToast = () => {
  const { notification, clearNotification } = useCart();

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        clearNotification();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification, clearNotification]);

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          key={notification.id}
          initial={{ opacity: 0, y: -20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
          className="fixed top-24 right-4 md:right-8 z-[60] w-[calc(100vw-2rem)] max-w-[340px]"
        >
          <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/20 overflow-hidden flex items-center p-4 gap-4 ring-1 ring-black/5">
            <div className="h-14 w-12 flex-shrink-0 bg-zinc-50 rounded-lg overflow-hidden border border-zinc-100">
              <img 
                src={notification.image} 
                alt="" 
                className="h-full w-full object-cover" 
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?q=80&w=1000&auto=format&fit=crop';
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <div className="bg-green-500 text-white p-0.5 rounded-full">
                  <Check size={10} strokeWidth={3} />
                </div>
                <p className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em]">Success</p>
              </div>
              <p className="text-zinc-900 text-sm font-bold truncate leading-none mb-1">{notification.name}</p>
              <div className="flex items-center gap-3">
                <p className="text-zinc-400 text-[10px] uppercase font-bold tracking-widest">Added to Cart</p>
                <Link 
                  to="/cart" 
                  onClick={clearNotification} 
                  className="text-secondary text-[10px] font-black uppercase tracking-widest hover:underline"
                >
                  View Cart
                </Link>
              </div>
            </div>
            <button 
              onClick={clearNotification}
              className="text-zinc-300 hover:text-zinc-900 transition-colors p-1"
            >
              <X size={18} />
            </button>
            
            {/* Progress bar */}
            <motion.div 
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 4, ease: "linear" }}
              className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 origin-left"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartToast;
