import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Loader2, AlertCircle, ArrowRight } from 'lucide-react';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { user, signIn, signInWithGoogle, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');

  // Auto-redirect if user is already logged in
  useEffect(() => {
    if (user && !authLoading) {
      if (redirect === 'checkout') {
        navigate('/checkout');
      } else {
        navigate('/shop');
      }
    }
  }, [user, authLoading, navigate, redirect]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      console.log('Attempting login for:', email);
      const { data, error: loginError } = await signIn(email, password);
      
      if (loginError) {
        console.error('Login Error Object:', loginError);
        throw loginError;
      }
      
      console.log('Login Successful, session data:', data);
      navigate('/shop');
    } catch (err) {
      console.error('Caught Login Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error: googleError } = await signInWithGoogle();
      if (googleError) throw googleError;
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="pt-40 pb-24 min-h-screen bg-white">
      <div className="container mx-auto px-4 flex justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-zinc-900 uppercase tracking-tighter mb-4">Welcome Back</h1>
            <p className="text-zinc-500 text-xs uppercase tracking-widest">Access your account and orders</p>
          </div>

          <div className="bg-white border border-zinc-100 p-8 md:p-10 shadow-2xl shadow-zinc-200/50 rounded-sm">
            <button 
              onClick={handleGoogleLogin}
              className="w-full py-4 border border-zinc-200 text-zinc-900 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-zinc-50 transition-all mb-8"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="Google" />
              Continue with Google
            </button>

            <div className="relative mb-8 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-100"></div>
              </div>
              <span className="relative bg-white px-4 text-[10px] font-black text-zinc-300 uppercase tracking-widest">Or login via email</span>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-zinc-900 transition-colors" size={16} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-100 focus:border-zinc-900 focus:bg-white outline-none p-4 pl-12 text-zinc-900 text-xs font-bold transition-all placeholder:text-zinc-300"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-zinc-900 transition-colors" size={16} />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-100 focus:border-zinc-900 focus:bg-white outline-none p-4 pl-12 text-zinc-900 text-xs font-bold transition-all placeholder:text-zinc-300"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="text-red-500 shrink-0" size={16} />
                  <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{error}</p>
                </div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-secondary transition-all flex items-center justify-center gap-3 shadow-xl group"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <>Sign In <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></>}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                Don't have an account? <Link to="/signup" className="text-zinc-900 underline underline-offset-4 hover:text-secondary decoration-2 transition-colors">Create one now</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
