import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Shield, Clock, Camera, Save, Loader2, CheckCircle, ShoppingBag, MessageSquare, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
    }
  }, [profile]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName, updated_at: new Date() })
        .eq('id', user.id);
      
      if (error) throw error;
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="pt-40 pb-24 min-h-screen bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12">
          
          {/* Left Sidebar: Profile Summary */}
          <div className="w-full md:w-1/3 space-y-8">
            <div className="bg-zinc-50 border border-zinc-100 p-8 text-center rounded-sm">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center text-white text-3xl font-black italic">
                  {fullName ? fullName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-white border border-zinc-100 rounded-full shadow-lg hover:bg-zinc-50 transition-colors">
                  <Camera size={14} className="text-zinc-600" />
                </button>
              </div>
              <h2 className="text-xl font-bold text-zinc-900 tracking-tight">{fullName || 'Valued Member'}</h2>
              <p className="text-zinc-400 text-[10px] uppercase tracking-widest mt-1">Customer Account</p>
            </div>

            <div className="bg-white border border-zinc-100 p-8 space-y-6 rounded-sm shadow-sm">
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-900 border-b border-zinc-50 pb-2">Quick Navigation</p>
                <Link to="/my-orders" className="flex items-center justify-between group">
                  <div className="flex items-center gap-3 text-zinc-500 group-hover:text-zinc-900 transition-colors">
                    <ShoppingBag size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">My Orders</span>
                  </div>
                  <ChevronRight size={12} className="text-zinc-300 group-hover:text-zinc-900 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link to="/my-reviews" className="flex items-center justify-between group">
                  <div className="flex items-center gap-3 text-zinc-500 group-hover:text-zinc-900 transition-colors">
                    <MessageSquare size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">My Reviews</span>
                  </div>
                  <ChevronRight size={12} className="text-zinc-300 group-hover:text-zinc-900 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              <div className="pt-4 border-t border-zinc-50 space-y-6">
                <div className="flex items-center gap-4 text-zinc-500">
                  <Shield size={18} className="text-zinc-900" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-900 leading-none">Security</p>
                    <p className="text-[10px] uppercase text-zinc-400 mt-1">Enforced by Supabase Auth</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-zinc-500">
                  <Clock size={18} className="text-zinc-900" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-900 leading-none">Joined</p>
                    <p className="text-[10px] uppercase text-zinc-400 mt-1">{new Date(user.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content: Profile Settings */}
          <div className="flex-1 space-y-12">
            <div>
              <h1 className="text-4xl font-black text-zinc-900 uppercase tracking-tighter mb-2 italic">Account Settings</h1>
              <p className="text-zinc-400 text-xs uppercase tracking-widest">Manage your personal information and preferences</p>
            </div>

            <form onSubmit={handleUpdate} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Full Identity Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={16} />
                    <input 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-100 focus:border-zinc-900 focus:bg-white outline-none p-4 pl-12 text-zinc-900 text-xs font-bold uppercase tracking-widest transition-all"
                      placeholder="Your Name"
                    />
                  </div>
                </div>

                <div className="space-y-2 opacity-60">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Account Email (Locked)</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={16} />
                    <input 
                      type="email" 
                      readOnly
                      value={user.email}
                      className="w-full bg-zinc-100 border border-zinc-100 outline-none p-4 pl-12 text-zinc-500 text-xs font-bold transition-all cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-50 flex items-center justify-between">
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-10 py-5 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-secondary transition-all flex items-center gap-3 shadow-xl disabled:opacity-50"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <>Save Changes <Save size={14} /></>}
                </button>

                {success && (
                  <div className="flex items-center gap-2 text-green-600 animate-in fade-in slide-in-from-right-2">
                    <CheckCircle size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Profile Updated</span>
                  </div>
                )}
              </div>
            </form>

            <div className="bg-red-50 p-8 rounded-sm space-y-4">
              <h3 className="text-red-900 text-xs font-black uppercase tracking-widest">Danger Zone</h3>
              <p className="text-[10px] text-red-700/60 uppercase tracking-widest leading-loose">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button className="text-red-900 text-[10px] font-black uppercase tracking-widest border-b border-red-200 hover:border-red-900 transition-colors pb-1">
                Deactivate My Account
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
