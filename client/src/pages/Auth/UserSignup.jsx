import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, User, Loader2, AlertCircle, ArrowRight, Check } from 'lucide-react';

const UserSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const { user, signUp, signInWithGoogle, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Auto-redirect if user is already logged in
  useEffect(() => {
    if (user && !authLoading) {
      navigate('/shop');
    }
  }, [user, authLoading, navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setLoading(true);
      setError(null);
      const { error: signUpError } = await signUp(formData.email, formData.password, {
        full_name: formData.name
      });
      if (signUpError) throw signUpError;
      setSuccess(true);
    } catch (err) {
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

  if (success) {
    return (
      <div className="pt-40 pb-24 min-h-screen bg-white">
        <div className="container mx-auto px-4 flex justify-center text-center">
          <div className="w-full max-w-md space-y-8">
            <div className="inline-flex h-20 w-20 items-center justify-center bg-green-50 text-green-600 rounded-full">
              <Check size={40} />
            </div>
            <h1 className="text-4xl font-black text-zinc-900 uppercase tracking-tighter">Check Your Email</h1>
            <p className="text-zinc-500 font-light leading-relaxed">
              We've sent a verification link to <span className="font-bold text-zinc-900">{formData.email}</span>. 
              Please confirm your email to activate your account.
            </p>
            <Link to="/login" className="inline-block py-4 px-10 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-all">
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-40 pb-24 min-h-screen bg-white">
      <div className="container mx-auto px-4 flex justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-zinc-900 uppercase tracking-tighter mb-4">Create Account</h1>
            <p className="text-zinc-500 text-xs uppercase tracking-widest">Join the SKML elite collections</p>
          </div>

          <div className="bg-white border border-zinc-100 p-8 md:p-10 shadow-2xl shadow-zinc-200/50 rounded-sm">
            <button 
              onClick={handleGoogleLogin}
              className="w-full py-4 border border-zinc-200 text-zinc-900 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-zinc-50 transition-all mb-8"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="Google" />
              Sign up with Google
            </button>

            <div className="relative mb-8 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-100"></div>
              </div>
              <span className="relative bg-white px-4 text-[10px] font-black text-zinc-300 uppercase tracking-widest">Or use your email</span>
            </div>

            <form onSubmit={handleSignup} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-zinc-900 transition-colors" size={16} />
                  <input 
                    type="text" 
                    required
                    className="w-full bg-zinc-50 border border-zinc-100 focus:border-zinc-900 focus:bg-white outline-none p-4 pl-12 text-zinc-900 text-xs font-bold transition-all placeholder:text-zinc-300"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-zinc-900 transition-colors" size={16} />
                  <input 
                    type="email" 
                    required
                    className="w-full bg-zinc-50 border border-zinc-100 focus:border-zinc-900 focus:bg-white outline-none p-4 pl-12 text-zinc-900 text-xs font-bold transition-all placeholder:text-zinc-300"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                    className="w-full bg-zinc-50 border border-zinc-100 focus:border-zinc-900 focus:bg-white outline-none p-4 pl-12 text-zinc-900 text-xs font-bold transition-all placeholder:text-zinc-300"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Confirm Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-zinc-900 transition-colors" size={16} />
                  <input 
                    type="password" 
                    required
                    className="w-full bg-zinc-50 border border-zinc-100 focus:border-zinc-900 focus:bg-white outline-none p-4 pl-12 text-zinc-900 text-xs font-bold transition-all placeholder:text-zinc-300"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
                {loading ? <Loader2 size={16} className="animate-spin" /> : <>Create Account <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></>}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                Already have an account? <Link to="/login" className="text-zinc-900 underline underline-offset-4 hover:text-secondary decoration-2 transition-colors">Sign in here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSignup;
