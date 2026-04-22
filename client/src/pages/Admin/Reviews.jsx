import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Trash2, 
  CheckCircle2, 
  EyeOff, 
  RefreshCw, 
  Star,
  ExternalLink,
  Check,
  X
} from 'lucide-react';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updating, setUpdating] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          products (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateReviewStatus = async (id, newStatus) => {
    try {
      setUpdating(id);
      const { error } = await supabase
        .from('reviews')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      setReviews(reviews.map(r => r.id === id ? { ...r, status: newStatus } : r));
      showNotification(`Review ${newStatus} successfully`);
    } catch (error) {
      console.error('Error updating status:', error);
      showNotification('Failed to update review', 'error');
    } finally {
      setUpdating(null);
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Delete this review permanently?')) return;
    try {
      setUpdating(id);
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setReviews(reviews.filter(r => r.id !== id));
      showNotification('Review deleted permanently');
    } catch (error) {
      console.error('Error deleting review:', error);
      showNotification('Failed to delete review', 'error');
    } finally {
      setUpdating(null);
    }
  };

  const filteredReviews = reviews.filter(rev => {
    const matchesSearch = 
      rev.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rev.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rev.products?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || rev.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading && reviews.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw size={32} className="animate-spin text-zinc-900" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Notifications */}
      {notification && (
        <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] px-8 py-4 rounded-sm shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300 ${
          notification.type === 'error' ? 'bg-red-600 text-white' : 'bg-zinc-900 text-white'
        }`}>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3">
             {notification.type === 'error' ? <X /> : <Check />}
             {notification.message}
          </p>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-zinc-900 uppercase tracking-tighter italic">Manage Reviews</h1>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <MessageSquare size={14} /> Global Feedback Moderation
          </p>
        </div>
        <button 
          onClick={fetchReviews}
          className="px-6 py-4 bg-zinc-100 text-zinc-900 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-xl shadow-zinc-100"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh List
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative group md:col-span-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" size={16} />
          <input 
            type="text"
            placeholder="Search by Product, User or Comment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-100 p-4 pl-12 text-xs font-bold uppercase tracking-widest focus:bg-white focus:border-zinc-900 outline-none transition-all"
          />
        </div>
        <div className="relative group">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" size={16} />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-100 p-4 pl-12 text-xs font-bold uppercase tracking-widest focus:bg-white focus:border-zinc-900 outline-none transition-all appearance-none cursor-pointer"
          >
            <option value="all">All Reviews</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>
      </div>

      {/* Mobile Card View (Visible only on small screens) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((rev) => (
            <div key={rev.id} className="bg-white border border-zinc-100 p-4 rounded-sm shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-xs font-black text-zinc-900 uppercase tracking-tight">{rev.products?.name}</p>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase">{rev.user_name}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                  rev.status === 'approved' ? 'bg-green-100 text-green-700' :
                  rev.status === 'hidden' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {rev.status}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={10} fill={rev.rating >= star ? 'currentColor' : 'none'} className={rev.rating >= star ? 'text-secondary' : 'text-zinc-200'} />
                  ))}
                </div>
                <p className="text-xs text-zinc-600 font-light leading-relaxed italic">"{rev.comment}"</p>
              </div>

              <div className="pt-4 border-t border-zinc-50 flex gap-2">
                {rev.status !== 'approved' && (
                  <button 
                    onClick={() => updateReviewStatus(rev.id, 'approved')}
                    disabled={updating === rev.id}
                    className="flex-1 py-2 bg-zinc-900 text-white text-[9px] font-black uppercase tracking-widest rounded-sm flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={12} /> Approve
                  </button>
                )}
                {rev.status !== 'hidden' && (
                  <button 
                    onClick={() => updateReviewStatus(rev.id, 'hidden')}
                    disabled={updating === rev.id}
                    className="flex-1 py-2 bg-zinc-100 text-zinc-600 text-[9px] font-black uppercase tracking-widest rounded-sm flex items-center justify-center gap-2"
                  >
                    <EyeOff size={12} /> Hide
                  </button>
                )}
                <button 
                  onClick={() => handleDeleteReview(rev.id)}
                  disabled={updating === rev.id}
                  className="p-2 bg-red-50 text-red-500 rounded-sm"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-10 text-center bg-white border border-zinc-100 rounded-sm opacity-20">
            <MessageSquare size={32} className="mx-auto mb-2" />
            <p className="text-[10px] font-black uppercase">No reviews found</p>
          </div>
        )}
      </div>

      {/* Desktop Table View (Hidden on small screens) */}
      <div className="hidden md:block bg-white border border-zinc-100 rounded-sm overflow-x-auto shadow-sm scrollbar-hide">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-100">
              <th className="p-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Product & User</th>
              <th className="p-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Rating & Comment</th>
              <th className="p-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Status & Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((rev) => (
                <tr key={rev.id} className="hover:bg-zinc-50/50 transition-colors group">
                  <td className="p-6 max-w-xs">
                    <div className="space-y-1">
                      <p className="text-xs font-black text-zinc-900 uppercase tracking-tight truncate">{rev.products?.name}</p>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{rev.user_name}</p>
                      <p className="text-[8px] text-zinc-400 font-medium">Joined {new Date(rev.created_at).toLocaleDateString()}</p>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="space-y-2">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} size={10} fill={rev.rating >= star ? 'currentColor' : 'none'} className={rev.rating >= star ? 'text-secondary' : 'text-zinc-200'} />
                        ))}
                      </div>
                      <p className="text-xs text-zinc-600 font-light leading-relaxed italic line-clamp-2">"{rev.comment}"</p>
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                         rev.status === 'approved' ? 'bg-green-100 text-green-700' :
                         rev.status === 'hidden' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                       }`}>
                         {rev.status}
                       </span>
                       
                       <div className="flex gap-1 ml-4 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                          {rev.status !== 'approved' && (
                            <button 
                              onClick={() => updateReviewStatus(rev.id, 'approved')}
                              disabled={updating === rev.id}
                              className="p-2 bg-zinc-900 text-white hover:bg-green-600 transition-colors rounded-sm"
                              title="Approve Review"
                            >
                              <CheckCircle2 size={14} />
                            </button>
                          )}
                          {rev.status !== 'hidden' && (
                            <button 
                              onClick={() => updateReviewStatus(rev.id, 'hidden')}
                              disabled={updating === rev.id}
                              className="p-2 bg-zinc-100 text-zinc-600 hover:bg-zinc-900 hover:text-white transition-colors rounded-sm"
                              title="Hide Review"
                            >
                              <EyeOff size={14} />
                            </button>
                          )}
                          <button 
                            onClick={() => handleDeleteReview(rev.id)}
                            disabled={updating === rev.id}
                            className="p-2 bg-red-50 text-red-500 hover:bg-red-600 hover:text-white transition-colors rounded-sm"
                            title="Delete Review"
                          >
                            <Trash2 size={14} />
                          </button>
                       </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-20 text-center">
                  <div className="flex flex-col items-center gap-4 opacity-20">
                    <MessageSquare size={48} />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">No reviews found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminReviews;
