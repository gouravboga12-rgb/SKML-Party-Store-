import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Lock, Mail, Loader2, AlertCircle, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin';

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      // Early check to ensure only the owner email is used
      if (email.toLowerCase() !== 'trendingfabricstore@gmail.com') {
        setError('Unauthorized Access: Only the owner can log in here.');
        setLoading(false);
        return;
      }

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      
      if (data.session) {
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err.message);
      setError('Invalid credentials. Access Denied.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 selection:bg-zinc-800 selection:text-white">
      {/* Background Aesthetic */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-zinc-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-zinc-900/20 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo/Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex h-16 w-16 items-center justify-center bg-white rounded-sm mb-6 shadow-2xl shadow-white/5">
            <Lock className="text-black" size={28} />
          </div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">SKML Admin</h1>
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Proprietary Access Only</p>
        </div>

        {/* Login Card */}
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 p-8 sm:p-12 rounded-sm shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Identity (Email)</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-white transition-colors" size={16} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/5 focus:border-white/20 outline-none p-4 pl-12 text-white text-xs font-bold uppercase tracking-widest transition-all placeholder:text-zinc-800"
                  placeholder="admin@skml.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Passkey</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-white transition-colors" size={16} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/5 focus:border-white/20 outline-none p-4 pl-12 text-white text-xs font-bold uppercase tracking-widest transition-all placeholder:text-zinc-800"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="text-red-500 shrink-0" size={16} />
                <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest leading-relaxed">{error}</p>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-zinc-200 disabled:opacity-50 transition-all flex items-center justify-center gap-3 shadow-xl shadow-white/5 group"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  Authenticate Access
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em] max-w-[280px] mx-auto leading-loose">
            Unauthorized access is strictly monitored. Encryption level: Industry Standard AES-256.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
