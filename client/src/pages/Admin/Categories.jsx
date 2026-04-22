import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Image as ImageIcon,
  Loader2,
  X,
  Check
} from 'lucide-react';
import axios from 'axios';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ id: '', name: '', description: '', image: '' });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
      
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        data
      );
      
      setFormData({ ...formData, image: res.data.secure_url });
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Check Cloudinary settings.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase
        .from('categories')
        .upsert(formData);
      
      if (error) throw error;
      
      setIsModalOpen(false);
      setEditingCategory(null);
      setFormData({ id: '', name: '', description: '', image: '' });
      fetchCategories();
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save category.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      fetchCategories();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete category.');
    }
  };

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-zinc-900 uppercase tracking-tighter">Categories</h1>
          <p className="text-zinc-500 text-sm uppercase tracking-widest mt-2">Manage your product collections</p>
        </div>
        <button
          onClick={() => {
            setEditingCategory(null);
            setFormData({ id: '', name: '', description: '', image: '' });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-8 py-4 bg-zinc-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all rounded-sm shadow-xl"
        >
          <Plus size={18} /> Add Category
        </button>
      </div>

      {/* Search & Stats */}
      <div className="flex items-center gap-4 bg-white p-4 border border-zinc-200 rounded-sm shadow-sm">
        <Search size={20} className="text-zinc-400 ml-2" />
        <input 
          type="text" 
          placeholder="SEARCH CATEGORIES BY NAME OR ID..." 
          className="flex-1 bg-transparent border-none outline-none text-xs font-bold uppercase tracking-widest text-zinc-900 placeholder:text-zinc-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="h-6 w-px bg-zinc-100 mx-4 hidden sm:block" />
        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] hidden sm:block">
          Total: {categories.length}
        </span>
      </div>

      {/* Grid */}
      {loading && categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-40 opacity-20">
          <Loader2 size={48} className="animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredCategories.map((cat) => (
            <div key={cat.id} className="group bg-white border border-zinc-200 rounded-sm overflow-hidden hover:border-zinc-900 transition-all shadow-sm hover:shadow-2xl flex flex-col">
              <div className="aspect-[4/3] bg-zinc-100 relative overflow-hidden">
                <img 
                  src={cat.image || 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1000&auto=format&fit=crop'} 
                  alt={cat.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 flex gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                  <button 
                    onClick={() => {
                      setEditingCategory(cat);
                      setFormData(cat);
                      setIsModalOpen(true);
                    }}
                    className="p-2 bg-white text-zinc-900 rounded-sm shadow-lg hover:bg-zinc-900 hover:text-white transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={() => handleDelete(cat.id)}
                    className="p-2 bg-white text-red-600 rounded-sm shadow-lg hover:bg-red-600 hover:text-white transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4 flex-1 flex flex-col">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{cat.id}</span>
                  <h3 className="text-lg font-black text-zinc-900 uppercase tracking-tighter line-clamp-1">{cat.name}</h3>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2 italic font-light flex-1">
                  {cat.description || 'No description available for this category.'}
                </p>
                <div className="pt-4 border-t border-zinc-50">
                  <button className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300 group-hover:text-zinc-900 transition-colors flex items-center gap-2">
                    View Products <Plus size={10} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-xl rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-zinc-100 flex items-center justify-between">
              <h2 className="text-2xl font-black uppercase tracking-tighter">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-900">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block mb-2">Category ID (Slug)</label>
                  <input 
                    type="text" 
                    required
                    disabled={!!editingCategory}
                    placeholder="e.g. backdrops"
                    className="w-full p-4 bg-zinc-50 border border-zinc-200 focus:border-zinc-900 outline-none transition-all uppercase font-bold text-xs tracking-widest disabled:opacity-50"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  />
                </div>
                
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block mb-2">Display Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Backdrops & Decoration"
                    className="w-full p-4 bg-zinc-50 border border-zinc-200 focus:border-zinc-900 outline-none transition-all uppercase font-bold text-xs tracking-widest"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block mb-2">Description</label>
                  <textarea 
                    rows="3"
                    placeholder="Provide a brief overview of this collection..."
                    className="w-full p-4 bg-zinc-50 border border-zinc-200 focus:border-zinc-900 outline-none transition-all text-xs font-medium"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block mb-2">Category Image</label>
                  <div className="border-2 border-dashed border-zinc-200 rounded-sm p-8 text-center space-y-4 hover:border-zinc-400 transition-all group relative">
                    {formData.image ? (
                      <div className="relative aspect-video rounded-sm overflow-hidden max-w-xs mx-auto">
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => setFormData({ ...formData, image: '' })}
                          className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-red-600 transition-all"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center mx-auto text-zinc-400 group-hover:text-zinc-900 transition-colors">
                          {uploading ? <Loader2 size={24} className="animate-spin" /> : <ImageIcon size={24} />}
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                          {uploading ? 'UPLOADING TO CLOUDINARY...' : 'Click to upload category image'}
                        </p>
                        <input 
                          type="file" 
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={handleImageUpload}
                          disabled={uploading}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <button 
                type="submit"
                disabled={loading || uploading}
                className="w-full py-5 bg-zinc-900 text-white text-xs font-black uppercase tracking-widest hover:bg-zinc-800 disabled:opacity-50 transition-all mt-6 shadow-2xl"
              >
                {loading ? 'PROCESSING...' : (editingCategory ? 'Update Category' : 'Create Category')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
