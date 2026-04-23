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
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-base md:text-lg tracking-widest uppercase whitespace-nowrap">
                  SKML Fabric Store
                </span>
                <span className="text-[9px] font-semibold tracking-[0.35em] uppercase text-secondary whitespace-nowrap">
                  Indana
                </span>
              </div>
            </Link>
            <p className="text-zinc-600 text-sm leading-relaxed max-w-xs">
              Premium event backdrops, boutique fabrics, and home decoration materials. Elevating your celebrations with elegance and quality.
            </p>
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
              We partner with <span className="text-secondary font-bold">DTDC Courier Services</span> for fast and reliable online delivery across all regions.
            </p>
            <div className="pt-2">
              <span className="px-4 py-2 border border-secondary/30 text-[10px] uppercase tracking-widest text-secondary rounded">
                Daily Shipping via DTDC
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
            © 2026 SKML Fabric Store. All Rights Reserved.
          </p>
          <p className="text-zinc-400 text-[10px] uppercase tracking-widest">
            Developed by <a href="https://www.codtechitsolutions.com/" target="_blank" rel="noopener noreferrer" className="text-zinc-900 font-bold hover:text-secondary transition-colors underline decoration-zinc-200">CODTECH IT SOLUTION</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
