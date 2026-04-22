import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { Star, MessageSquare, Trash2, Edit3, ShoppingBag, ExternalLink, RefreshCw, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyReviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);
  const [editForm, setEditForm] = useState({ rating: 5, comment: '' });
  const [updating, setUpdating] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    if (user) {
      fetchUserReviews();
    }
  }, [user]);

  const fetchUserReviews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          products (name, image)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      setReviews(reviews.filter(r => r.id !== id));
      showNotification('Review deleted successfully');
    } catch (error) {
      console.error('Error deleting review:', error);
      showNotification('Failed to delete review', 'error');
    }
  };

  const startEdit = (review) => {
    setEditingReview(review);
    setEditForm({ rating: review.rating, comment: review.comment });
  };

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      const { error } = await supabase
        .from('reviews')
        .update({
          rating: editForm.rating,
          comment: editForm.comment,
          status: 'approved' // Reset to approved on edit for simplicity
        })
        .eq('id', editingReview.id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setReviews(reviews.map(r => r.id === editingReview.id ? { ...r, ...editForm } : r));
      setEditingReview(null);
      showNotification('Review updated successfully');
    } catch (error) {
      console.error('Error updating review:', error);
      showNotification('Failed to update review', 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-48 pb-24 min-h-screen bg-white flex items-center justify-center">
        <RefreshCw size={32} className="animate-spin text-zinc-900" />
      </div>
    );
  }

  return (
    <div className="pt-40 pb-24 min-h-screen bg-white">
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

      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-12 space-y-2">
          <h1 className="text-4xl font-black text-zinc-900 uppercase tracking-tighter italic">My Product Reviews</h1>
          <p className="text-zinc-400 text-xs uppercase tracking-widest">Manage the feedback you've shared with the community</p>
        </div>

        {reviews.length === 0 ? (
          <div className="bg-zinc-50 border border-dashed border-zinc-200 rounded-sm p-20 text-center space-y-6">
            <MessageSquare className="mx-auto text-zinc-300" size={48} />
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-zinc-900 uppercase tracking-tight">No reviews yet</h3>
              <p className="text-zinc-400 text-[10px] uppercase tracking-widest">Share your experience on your favorite boutique pieces.</p>
            </div>
            <Link to="/my-orders" className="inline-block px-12 py-4 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-all">
              Review Recent Purchases
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-white border border-zinc-100 rounded-sm overflow-hidden hover:shadow-2xl hover:shadow-zinc-100 transition-all duration-500 flex flex-col md:flex-row">
                {/* Product Preview */}
                <Link 
                  to={`/product/${rev.product_id}`}
                  className="md:w-48 bg-zinc-50 p-6 flex flex-col items-center justify-center border-r border-zinc-50 group/prod"
                >
                  <div className="w-20 h-24 bg-white rounded-sm overflow-hidden mb-3 shadow-sm border border-zinc-100 group-hover/prod:border-zinc-900 transition-colors">
                    <img src={rev.products?.image} alt={rev.products?.name} className="w-full h-full object-cover transition-transform group-hover/prod:scale-110" />
                  </div>
                  <p className="text-[10px] font-black text-zinc-900 uppercase tracking-tight text-center line-clamp-2 group-hover/prod:text-secondary transition-colors">{rev.products?.name}</p>
                </Link>

                {/* Review Content */}
                <div className="flex-1 p-8 space-y-4">
                  {editingReview?.id === rev.id ? (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setEditForm({ ...editForm, rating: star })}
                            className={`transition-all ${editForm.rating >= star ? 'text-secondary' : 'text-zinc-200'}`}
                          >
                            <Star size={18} fill={editForm.rating >= star ? 'currentColor' : 'none'} />
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={editForm.comment}
                        onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                        className="w-full bg-zinc-50 border border-zinc-100 p-4 text-xs font-medium focus:border-zinc-900 outline-none resize-none h-24"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleUpdate}
                          disabled={updating}
                          className="px-6 py-2 bg-zinc-900 text-white text-[9px] font-black uppercase tracking-widest hover:bg-secondary transition-all"
                        >
                          {updating ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                          onClick={() => setEditingReview(null)}
                          className="px-6 py-2 bg-zinc-100 text-zinc-400 text-[9px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} size={14} fill={rev.rating >= star ? 'currentColor' : 'none'} className={rev.rating >= star ? 'text-secondary' : 'text-zinc-200'} />
                          ))}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                          rev.status === 'approved' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {rev.status}
                        </span>
                      </div>
                      <p className="text-zinc-500 text-sm font-light leading-relaxed">"{rev.comment}"</p>
                      <div className="flex items-center justify-between pt-4 border-t border-zinc-50">
                        <p className="text-[9px] text-zinc-400 uppercase tracking-widest">
                          Posted on {new Date(rev.created_at).toLocaleDateString()}
                        </p>
                        <div className="flex gap-4">
                          <button 
                            onClick={() => startEdit(rev)}
                            className="flex items-center gap-1.5 text-[9px] font-black text-zinc-900 uppercase tracking-widest hover:text-secondary transition-colors"
                          >
                            <Edit3 size={12} /> Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(rev.id)}
                            className="flex items-center gap-1.5 text-[9px] font-black text-red-500 uppercase tracking-widest hover:text-red-700 transition-colors"
                          >
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReviews;
