import React from 'react';
import Header from './Header';
import Footer from './Footer';
import BottomNav from './BottomNav';
import { useLocation } from 'react-router-dom';
import { Phone } from 'lucide-react';
import CartToast from '../UI/CartToast';

const Layout = ({ children }) => {
  const location = useLocation();
  const isCheckout = location.pathname === '/checkout';

  return (
    <div className="flex flex-col min-h-screen bg-white text-zinc-900 selection:bg-black selection:text-white transition-colors duration-500">
      <CartToast />
      <Header />
      <main className="flex-grow pt-0 pb-20">
        {children}
      </main>
      {!isCheckout && <Footer />}

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Floating WhatsApp Button - raised above BottomNav */}
      <a
        href="https://wa.me/919398324095"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-6 z-[110] h-14 w-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 group"
        aria-label="Contact on WhatsApp"
      >
        <Phone size={26} />
        <span className="absolute right-16 bg-zinc-900 text-white text-xs font-bold py-2 px-4 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl border border-white/10">
          Questions? Chat with us
        </span>
      </a>
    </div>
  );
};

export default Layout;
