import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Users, Mail, Calendar, Shield, Search, RefreshCw, User as UserIcon } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch official profiles
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      // 2. Fetch customers from orders (to catch everyone who bought something)
      const { data: orderData } = await supabase
        .from('orders')
        .select('full_name, email, created_at, user_id');

      // Create a map to merge data and prevent duplicates
      const customerMap = new Map();

      // Add profiles first
      (profileData || []).forEach(p => {
        customerMap.set(p.email.toLowerCase(), {
          ...p,
          source: 'profile'
        });
      });

      // Add/Update from orders (catches guest checkouts or missing profiles)
      (orderData || []).forEach(o => {
        const email = o.email?.toLowerCase();
        if (email && !customerMap.has(email)) {
          customerMap.set(email, {
            id: o.user_id || `guest_${email}`,
            full_name: o.full_name,
            email: o.email,
            created_at: o.created_at,
            source: 'order'
          });
        }
      });

      setUsers(Array.from(customerMap.values()).sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      ));
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <RefreshCw size={32} className="animate-spin text-zinc-900" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-zinc-900 uppercase tracking-tighter italic">Customer Database</h1>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <Users size={14} /> Registered Elite Members
        </p>
      </div>

      {/* Search */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" size={16} />
        <input 
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-zinc-50 border border-zinc-100 p-4 pl-12 text-xs font-bold uppercase tracking-widest focus:bg-white focus:border-zinc-900 outline-none transition-all"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white border border-zinc-100 rounded-sm overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-100">
              <th className="text-left p-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Customer</th>
              <th className="text-left p-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Access Level</th>
              <th className="text-left p-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Joined On</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-zinc-50/50 transition-colors group">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-all">
                       <UserIcon size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-900 uppercase tracking-wide">{user.full_name || 'Incognito Member'}</p>
                      <p className="text-[10px] text-zinc-500 flex items-center gap-1.5 mt-0.5">
                        <Mail size={10} /> {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit ${
                    user.email === 'trendingfabricstore@gmail.com' ? 'bg-zinc-900 text-white' : 
                    user.source === 'profile' ? 'bg-blue-50 text-blue-600' : 'bg-zinc-100 text-zinc-500'
                  }`}>
                    <Shield size={10} />
                    {user.email === 'trendingfabricstore@gmail.com' ? 'Super Admin' : 
                     user.source === 'profile' ? 'Verified Member' : 'Guest Shopper'}
                  </span>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
                    <Calendar size={12} />
                    {new Date(user.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="p-20 text-center text-zinc-300 space-y-4">
            <Users size={48} className="mx-auto opacity-20" />
            <p className="text-[10px] uppercase font-black tracking-[0.2em]">No members found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
