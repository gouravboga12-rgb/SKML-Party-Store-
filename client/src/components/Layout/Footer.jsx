import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-zinc-50 text-zinc-900 pt-20 pb-10 border-t border-zinc-200">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <img src="/logo.jpeg" alt="Logo" className="h-10 w-10 object-cover rounded-full border border-secondary/30" />
              <span className="font-bold text-base md:text-lg tracking-widest uppercase whitespace-nowrap">
                S K M L PARTY STORE
              </span>
            </Link>
            <p className="text-zinc-600 text-sm leading-relaxed max-w-xs">
              Premium event backdrops, boutique fabrics, and home decoration materials. Elevating your celebrations with elegance and quality.
            </p>
            <div className="flex gap-4">
              <a href="#" className="h-10 w-10 glass-effect rounded-full flex items-center justify-center hover:bg-zinc-900 hover:text-white transition-all shadow-sm">
                {/* Instagram SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="#" className="h-10 w-10 glass-effect rounded-full flex items-center justify-center hover:bg-zinc-900 hover:text-white transition-all shadow-sm">
                {/* Facebook SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-[0.2em]">Explore</h4>
            <ul className="space-y-4 text-zinc-500 text-sm">
              <li><Link to="/shop" className="hover:text-zinc-900 transition-colors tracking-widest uppercase">Shop All</Link></li>
              <li><Link to="/#categories" className="hover:text-zinc-900 transition-colors tracking-widest uppercase">Categories</Link></li>
              <li><Link to="/#about" className="hover:text-zinc-900 transition-colors tracking-widest uppercase">Our Story</Link></li>
              <li><Link to="/#contact" className="hover:text-zinc-900 transition-colors tracking-widest uppercase">Contact</Link></li>
            </ul>
          </div>

          {/* Delivery Info */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-[0.2em]">Shipping & Delivery</h4>
            <p className="text-zinc-600 text-sm leading-relaxed">
              We partner with <span className="text-secondary font-bold">DCDT Courier Services</span> for fast and reliable online delivery across all regions.
            </p>
            <div className="pt-2">
              <span className="px-4 py-2 border border-secondary/30 text-[10px] uppercase tracking-widest text-secondary rounded">
                Daily Shipping via DCDT
              </span>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-[0.2em]">Get in Touch</h4>
            <ul className="space-y-4 text-sm text-zinc-600">
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-secondary" />
                <span>+91 9398324095</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-secondary" />
                <span>inmypartystore@gmail.com</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={18} className="text-secondary" />
                <span>Andhra Pradesh, India (Address to be added)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-zinc-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-400 text-[10px] uppercase tracking-widest">
            © 2026 SKML Party Store. All Rights Reserved.
          </p>
          <p className="text-zinc-400 text-[10px] uppercase tracking-widest">
            Designed for Excellence
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
