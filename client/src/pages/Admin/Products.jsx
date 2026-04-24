import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Image as ImageIcon,
  Video as VideoIcon,
  Loader2,
  X,
  Filter,
  MoreVertical,
  PlusCircle,
  Check,
  RefreshCw,
  Package
} from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    sub_category: '',
    price: '',
    discount_pct: 0,
    shipping_cost: 0,
    sku: '',
    description: '',
    image: '',
    images: [],
    colors: [],
    sizes: [],
    dimensions: [],
    price_type: 'fixed',
    price_unit: 'per piece',
    min_order: 1,
    lead_time: '',
    stock_status: 'In Stock',
    is_featured: false,
    rating: 4.5,
    reviews_count: 0
  });
  const [newDimension, setNewDimension] = useState('');
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('general'); // 'general', 'media', 'variants', 'inventory'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('id, name')
      ]);
      
      if (prodRes.error) throw prodRes.error;
      if (catRes.error) throw catRes.error;
      
      setProducts(prodRes.data || []);
      setCategories(catRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e, field, colorIdx = null) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    try {
      setUploading(true);
      const urls = [];
      
      for (const file of files) {
        const type = file.type.startsWith('video') ? 'video' : 'image';
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
        
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/${type}/upload`,
          {
            method: 'POST',
            body: data,
          }
        );

        const result = await response.json();
        if (!response.ok) throw new Error(result.error?.message || 'Upload failed');
        urls.push(result.secure_url);
      }

      if (field === 'main') {
        setFormData({ ...formData, image: urls[0] });
      } else if (field === 'color' && colorIdx !== null) {
        const newColors = [...formData.colors];
        newColors[colorIdx].image = urls[0];
        setFormData({ ...formData, colors: newColors });
      } else {
        setFormData({ ...formData, images: [...formData.images, ...urls] });
      }
      alert('Media uploaded successfully!');
    } catch (error) {
      console.error('Upload Error:', error);
      alert(`Upload Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase
        .from('products')
        .upsert({
          ...formData,
          id: editingProduct?.id // Keep ID if editing
        });
      
      if (error) throw error;
      
      alert('Product saved successfully!');
      setIsModalOpen(false);
      setEditingProduct(null);
      resetForm();
      setActiveTab('general'); // Reset tab
      fetchData();
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save product.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      alert('Product deleted successfully!');
      fetchData();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete product.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      sub_category: '',
      price: '',
      discount_pct: 0,
      shipping_cost: 0,
      sku: '',
      description: '',
      image: '',
      images: [],
      colors: [],
      sizes: [],
      dimensions: [],
      price_type: 'fixed',
      price_unit: 'per piece',
      min_order: 1,
      lead_time: '',
      stock_status: 'In Stock',
      is_featured: false,
      rating: 4.5,
      reviews_count: 0
    });
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <h1 className="text-4xl font-black text-zinc-900 uppercase tracking-tighter italic">Products</h1>
             <span className="px-2 py-0.5 bg-zinc-100 text-zinc-400 text-[7px] font-black uppercase tracking-widest rounded-full">v2.1 Update: {new Date().toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <Package size={14} /> Inventory Management System
            </p>
            <div className="h-4 w-[1px] bg-zinc-200"></div>
            <div className="flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
               <p className="text-secondary text-[10px] font-black uppercase tracking-widest">
                 {products.filter(p => (p.colors?.length > 0 || p.sizes?.length > 0)).length} Configurable Products Live
               </p>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchData}
            className="px-6 py-4 bg-zinc-100 text-zinc-900 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center gap-2"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button 
            onClick={() => {
              resetForm();
              setEditingProduct(null);
              setIsModalOpen(true);
            }}
            className="px-8 py-4 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200"
          >
            + Add New Product
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 border border-zinc-200 rounded-sm shadow-sm">
        <div className="flex-1 flex items-center gap-2 w-full">
          <Search size={20} className="text-zinc-400 ml-2" />
          <input 
            type="text" 
            placeholder="SEARCH PRODUCTS BY NAME, CATEGORY..." 
            className="flex-1 bg-transparent border-none outline-none text-xs font-bold uppercase tracking-widest text-zinc-900 placeholder:text-zinc-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="h-6 w-px bg-zinc-100 mx-4 hidden sm:block" />
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors">
            <Filter size={16} /> Filter
          </button>
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
            Total: {products.length}
          </span>
        </div>
      </div>

      {/* Mobile Card View (Visible only on small screens) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {loading && products.length === 0 ? (
          <div className="bg-white p-10 text-center opacity-20">
            <Loader2 size={32} className="animate-spin mx-auto" />
          </div>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <div key={p.id} className="bg-white border border-zinc-200 p-4 rounded-sm space-y-4 shadow-sm">
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-zinc-100 rounded-sm overflow-hidden flex-shrink-0">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded-sm uppercase font-black tracking-widest w-fit mb-1 block">
                    {p.category}
                  </span>
                  <h3 className="text-sm font-black text-zinc-900 uppercase tracking-tighter truncate">{p.name}</h3>
                  <p className="text-sm font-black text-zinc-900 mt-1">₹{p.price}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setEditingProduct(p);
                      setFormData(p);
                      setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest rounded-sm"
                  >
                    <Edit2 size={12} /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(p.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-sm"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
                <span className={`text-[8px] px-2 py-0.5 rounded-full uppercase font-black tracking-tighter ${
                  p.price_type === 'meter' ? 'bg-secondary text-white' : 'bg-zinc-100 text-zinc-500'
                }`}>
                  {p.price_type === 'meter' ? 'Per Meter' : 'Fixed'}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-10 text-center opacity-20 italic text-xs">
            No products found matching your search.
          </div>
        )}
      </div>

      {/* Desktop Product Table (Hidden on small screens) */}
      <div className="hidden md:block bg-white border border-zinc-200 rounded-sm overflow-hidden shadow-sm">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left min-w-[1000px]">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr>
              <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-black text-zinc-500">Overview</th>
              <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-black text-zinc-500">Category</th>
              <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-black text-zinc-500">Variants</th>
              <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-black text-zinc-500 text-right">Price</th>
              <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-black text-zinc-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 font-medium">
            {loading && products.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-20 text-center opacity-20">
                  <Loader2 size={48} className="animate-spin mx-auto" />
                </td>
              </tr>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-zinc-50/50 transition-colors group">
                  <td className="px-6 py-6 flex items-center gap-4">
                    <div className="w-16 h-16 bg-zinc-100 rounded-sm overflow-hidden flex-shrink-0">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-sm font-black text-zinc-900 uppercase tracking-tighter block">{p.name}</span>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-widest mt-1 block italic">{p.sub_category || 'No Subcategory'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] px-3 py-1.5 bg-zinc-100 text-zinc-600 rounded-sm uppercase font-black tracking-widest w-fit">
                        {p.category}
                      </span>
                      <span className={`text-[8px] px-2 py-0.5 rounded-full uppercase font-black tracking-tighter w-fit ${
                        p.price_type === 'meter' ? 'bg-secondary text-white' : 'bg-zinc-900 text-white'
                      }`}>
                        {p.price_type === 'meter' ? 'Per Meter' : 'Fixed'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="space-y-2">
                       {Array.isArray(p.colors) && p.colors.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                             <span className="text-[7px] font-black text-zinc-400 uppercase tracking-widest block w-full">Colors:</span>
                             <div className="flex flex-wrap gap-1 mt-1">
                                {p.colors.map((c, i) => (
                                   <div key={i} className="flex items-center gap-1 px-1.5 py-0.5 border border-zinc-200 rounded-sm">
                                      <div 
                                         className="w-2 h-2 rounded-full border border-zinc-300" 
                                         style={{ backgroundColor: typeof c === 'object' ? c.value : '#ccc' }}
                                      ></div>
                                      <span className="text-[8px] uppercase font-bold text-zinc-600">
                                         {typeof c === 'object' ? c.name : c}
                                      </span>
                                   </div>
                                ))}
                             </div>
                          </div>
                       )}
                       {Array.isArray(p.sizes) && p.sizes.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                             <span className="text-[7px] font-black text-zinc-400 uppercase tracking-widest block w-full">Sizes:</span>
                             {p.sizes.map((s, i) => (
                                <span key={i} className="px-1.5 py-0.5 border border-zinc-200 text-[8px] uppercase font-bold text-zinc-600">{s}</span>
                             ))}
                          </div>
                       )}
                       {(!Array.isArray(p.colors) || !p.colors.length) && (!Array.isArray(p.sizes) || !p.sizes.length) && (
                          <span className="text-[9px] text-zinc-300 italic">No Variants</span>
                       )}
                    </div>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <div className="flex flex-col items-end">
                       <span className="text-sm font-black text-zinc-900 uppercase tracking-tight">₹{p.price}</span>
                       {p.discount_pct > 0 && (
                         <span className="text-[8px] font-black text-green-600 uppercase tracking-widest mt-0.5">-{p.discount_pct}% Off</span>
                       )}
                       {p.shipping_cost > 0 && (
                         <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest mt-0.5">Ship: ₹{p.shipping_cost}</span>
                       )}
                       {p.is_featured && (
                         <span className="text-[8px] font-black text-secondary uppercase tracking-widest mt-1 px-1.5 py-0.5 bg-secondary/10 rounded-full italic">Featured</span>
                       )}
                    </div>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => {
                          setEditingProduct(p);
                          setFormData(p);
                          setIsModalOpen(true);
                        }}
                        className="p-2.5 bg-white border border-zinc-200 text-zinc-900 rounded-sm hover:bg-zinc-900 hover:text-white transition-all shadow-sm"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(p.id)}
                        className="p-2.5 bg-white border border-zinc-200 text-red-600 rounded-sm hover:bg-red-600 hover:text-white transition-all shadow-sm"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-20 text-center opacity-20 italic">
                  No products found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

      {/* Modal / Side Panel */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 md:p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full h-full md:h-auto md:max-w-4xl md:rounded-sm shadow-2xl flex flex-col max-h-screen md:max-h-[90vh] overflow-hidden">
            <div className="p-4 md:px-8 md:py-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50 backdrop-blur-sm sticky top-0 z-20">
              <div>
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <p className="text-[8px] md:text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mt-1">Inventory Management System</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center bg-white border border-zinc-200 rounded-full hover:bg-red-50 hover:text-red-500 transition-all shadow-sm">
                <X size={18} />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-zinc-100 bg-white sticky top-[81px] z-20 overflow-x-auto scrollbar-hide">
              {[
                { id: 'general', label: 'Basic Info', icon: <Package size={14} /> },
                { id: 'media', label: 'Media & Gallery', icon: <ImageIcon size={14} /> },
                { id: 'variants', label: 'Variants', icon: <PlusCircle size={14} /> },
                { id: 'inventory', label: 'Inventory & Pricing', icon: <RefreshCw size={14} /> }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-b-2 ${
                    activeTab === tab.id 
                    ? 'border-zinc-900 text-zinc-900 bg-zinc-50/50' 
                    : 'border-transparent text-zinc-400 hover:text-zinc-600'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
                     <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto bg-zinc-50/20">
              <div className="p-4 md:p-10 max-w-5xl mx-auto">
                {/* General Info Tab */}
                {activeTab === 'general' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-white p-8 border border-zinc-100 shadow-sm rounded-sm space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block mb-2">Product Name</label>
                          <input 
                            type="text" 
                            required
                            placeholder="e.g. Traditional Red Backdrop"
                            className="w-full p-4 bg-zinc-50 border border-zinc-100 focus:border-zinc-900 outline-none uppercase font-bold text-xs tracking-tight transition-all"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block mb-2">Category</label>
                          <select 
                            required
                            className="w-full p-4 bg-zinc-50 border border-zinc-100 focus:border-zinc-900 outline-none text-[10px] font-black uppercase tracking-widest appearance-none transition-all cursor-pointer"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          >
                            <option value="">Select Category</option>
                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block mb-2">Sub Category</label>
                          <input 
                            type="text" 
                            placeholder="e.g. traditional, floral, modern"
                            className="w-full p-4 bg-zinc-50 border border-zinc-100 focus:border-zinc-900 outline-none uppercase font-bold text-xs tracking-widest transition-all"
                            value={formData.sub_category}
                            onChange={(e) => setFormData({ ...formData, sub_category: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block mb-2">Base Price (INR)</label>
                          <input 
                            type="number" 
                            required
                            placeholder="500"
                            className="w-full p-4 bg-zinc-50 border border-zinc-100 focus:border-zinc-900 outline-none font-bold text-xs"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block mb-2">Discount (%)</label>
                          <input 
                            type="number" 
                            placeholder="10"
                            className="w-full p-4 bg-zinc-50 border border-zinc-100 focus:border-zinc-900 outline-none font-bold text-xs"
                            value={formData.discount_pct}
                            onChange={(e) => setFormData({ ...formData, discount_pct: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block mb-2">Shipping Charge (INR)</label>
                          <input 
                            type="number" 
                            placeholder="0 for Free"
                            className="w-full p-4 bg-zinc-50 border border-zinc-100 focus:border-zinc-900 outline-none font-bold text-xs"
                            value={formData.shipping_cost}
                            onChange={(e) => setFormData({ ...formData, shipping_cost: e.target.value })}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block mb-2">Description</label>
                        <textarea 
                          rows="6"
                          placeholder="Detailed product specifications and info..."
                          className="w-full p-4 bg-zinc-50 border border-zinc-100 focus:border-zinc-900 outline-none text-xs font-medium leading-relaxed transition-all"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Media Tab */}
                {activeTab === 'media' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-white p-8 border border-zinc-100 shadow-sm rounded-sm space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900 block mb-2">Main Product Image</label>
                        <div className="aspect-[4/5] border-2 border-dashed border-zinc-100 rounded-sm bg-zinc-50 flex flex-col items-center justify-center relative group overflow-hidden">
                          {formData.image ? (
                            <>
                              <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                              <button 
                                type="button"
                                onClick={() => setFormData({ ...formData, image: '' })}
                                className="absolute top-4 right-4 p-2 bg-black/60 text-white rounded-full hover:bg-red-600 transition-all z-10"
                              >
                                <X size={16} />
                              </button>
                            </>
                          ) : (
                            <div className="text-center p-10 space-y-4">
                              <ImageIcon size={48} className="mx-auto text-zinc-200 group-hover:text-zinc-900 transition-colors" />
                              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover:text-zinc-900">Click to upload cover image</p>
                              <input 
                                type="file" 
                                className="absolute inset-0 opacity-0 cursor-pointer" 
                                onChange={(e) => handleUpload(e, 'main')}
                                disabled={uploading}
                              />
                            </div>
                          )}
                          {uploading && (
                            <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center z-10 transition-all">
                              <Loader2 size={32} className="animate-spin text-zinc-900" />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-white p-8 border border-zinc-100 shadow-sm rounded-sm space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900 block mb-2">Gallery & Videos</label>
                        <div className="grid grid-cols-2 gap-3">
                          {formData.images.map((img, idx) => (
                            <div key={idx} className="aspect-square bg-zinc-100 rounded-sm relative group overflow-hidden border border-zinc-200">
                              {img.toLowerCase().endsWith('.mp4') ? (
                                <video src={img} className="w-full h-full object-cover" />
                              ) : (
                                <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                              )}
                              <button 
                                type="button"
                                onClick={() => setFormData({ ...formData, images: formData.images.filter((_, i) => i !== idx) })}
                                className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                          <div className="aspect-square border-2 border-dashed border-zinc-200 rounded-sm flex items-center justify-center relative hover:border-zinc-900 transition-all bg-zinc-50 group">
                            <Plus size={24} className="text-zinc-300 group-hover:text-zinc-900 transition-colors" />
                            <input 
                              type="file" 
                              multiple
                              className="absolute inset-0 opacity-0 cursor-pointer" 
                              onChange={(e) => handleUpload(e, 'gallery')}
                              disabled={uploading}
                            />
                          </div>
                        </div>
                        <p className="text-[8px] text-zinc-400 uppercase tracking-widest font-bold mt-4">Support images (JPG, PNG) and short videos (MP4)</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Variants Tab */}
                {activeTab === 'variants' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-white p-8 border border-zinc-100 shadow-sm rounded-sm">
                      <div className="p-6 bg-zinc-50/50 border border-zinc-100 rounded-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900 block">Inventory Complexity</label>
                          <p className="text-[8px] text-zinc-400 mt-1 italic uppercase tracking-tighter">Choose "Multiple Variants" to enable Color, Size, and Dimension selectors.</p>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            type="button"
                            onClick={() => setFormData({ ...formData, colors: [], sizes: [], dimensions: [] })}
                            className={`px-6 py-2.5 text-[9px] font-black uppercase tracking-widest border transition-all ${
                              (!formData.colors?.length && !formData.sizes?.length && !formData.dimensions?.length) 
                                ? 'bg-zinc-900 text-white border-zinc-900 shadow-md' 
                                : 'bg-white text-zinc-400 border-zinc-200'
                            }`}
                          >
                            Single Piece
                          </button>
                          <button 
                            type="button"
                            onClick={() => {
                              if (!formData.colors?.length && !formData.sizes?.length && !formData.dimensions?.length) {
                                 setFormData({ ...formData, colors: [{ name: 'Default', value: '#000000', image: '' }] });
                              }
                            }}
                            className={`px-6 py-2.5 text-[9px] font-black uppercase tracking-widest border transition-all ${
                              (formData.colors?.length || formData.sizes?.length || formData.dimensions?.length) 
                                ? 'bg-zinc-900 text-white border-zinc-900 shadow-md' 
                                : 'bg-white text-zinc-400 border-zinc-200'
                            }`}
                          >
                            Multiple Variants
                          </button>
                        </div>
                      </div>

                      {/* Variants Content */}
                      {(formData.colors?.length > 0 || formData.sizes?.length > 0 || formData.dimensions?.length > 0) && (
                        <div className="space-y-12">
                          {/* Color Variants */}
                          <div className="space-y-6">
                            <div className="flex items-center justify-between">
                              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900">Color/Fabric Variants</label>
                              <button 
                                type="button"
                                onClick={() => setFormData({ ...formData, colors: [...formData.colors, { name: '', value: '#000000', image: '' }] })}
                                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-900 hover:text-secondary transition-colors"
                              >
                                <Plus size={14} /> Add Color
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {formData.colors.map((color, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-4 border border-zinc-100 bg-zinc-50/50 rounded-sm relative group">
                                  <div className="relative h-12 w-12 rounded-sm border border-zinc-200 overflow-hidden bg-white shrink-0">
                                    {color.image ? (
                                      <img src={color.image} alt="Color" className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-zinc-200"><ImageIcon size={16} /></div>
                                    )}
                                    <input 
                                      type="file" 
                                      className="absolute inset-0 opacity-0 cursor-pointer" 
                                      onChange={(e) => handleUpload(e, 'color', idx)}
                                    />
                                  </div>
                                  <div className="flex-1 space-y-2">
                                    <input 
                                      type="text" 
                                      placeholder="Color Name"
                                      className="w-full bg-transparent border-b border-zinc-200 text-[10px] font-black uppercase tracking-widest outline-none focus:border-zinc-900"
                                      value={color.name}
                                      onChange={(e) => {
                                        const newColors = [...formData.colors];
                                        newColors[idx].name = e.target.value;
                                        setFormData({ ...formData, colors: newColors });
                                      }}
                                    />
                                    <input 
                                      type="color" 
                                      className="h-4 w-full cursor-pointer bg-transparent border-none p-0"
                                      value={color.value}
                                      onChange={(e) => {
                                        const newColors = [...formData.colors];
                                        newColors[idx].value = e.target.value;
                                        setFormData({ ...formData, colors: newColors });
                                      }}
                                    />
                                  </div>
                                  <button 
                                    type="button"
                                    onClick={() => setFormData({ ...formData, colors: formData.colors.filter((_, i) => i !== idx) })}
                                    className="p-2 text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Size Variants */}
                          <div className="space-y-6 pt-10 border-t border-zinc-100">
                             <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900">Size Presets</label>
                             <div className="flex flex-wrap gap-2">
                               {['S', 'M', 'L', 'XL', 'XXL', 'Standard', 'Custom'].map(sz => (
                                 <button
                                   key={sz}
                                   type="button"
                                   onClick={() => {
                                     const sizes = formData.sizes || [];
                                     const newSizes = sizes.includes(sz)
                                       ? sizes.filter(s => s !== sz)
                                       : [...sizes, sz];
                                     setFormData({ ...formData, sizes: newSizes });
                                   }}
                                   className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest border transition-all ${
                                     formData.sizes?.includes(sz)
                                       ? 'bg-zinc-900 text-white border-zinc-900'
                                       : 'bg-white text-zinc-400 border-zinc-200 hover:border-zinc-900'
                                   }`}
                                 >
                                   {sz}
                                 </button>
                               ))}
                             </div>
                          </div>

                          {/* Dimension Variants */}
                          <div className="space-y-6 pt-10 border-t border-zinc-100">
                            <div className="flex items-center justify-between">
                              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900">Custom Dimension Presets</label>
                              <div className="flex gap-2">
                                <input 
                                  type="text"
                                  placeholder="e.g. 20x30 ft"
                                  className="p-2 border border-zinc-200 text-[10px] uppercase font-bold outline-none focus:border-zinc-900 transition-all w-32"
                                  value={newDimension}
                                  onChange={(e) => setNewDimension(e.target.value)}
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      if (newDimension.trim()) {
                                        const dims = formData.dimensions || [];
                                        if (!dims.includes(newDimension.trim())) {
                                          setFormData({ ...formData, dimensions: [...dims, newDimension.trim()] });
                                        }
                                        setNewDimension('');
                                      }
                                    }
                                  }}
                                />
                                <button 
                                  type="button"
                                  onClick={() => {
                                    if (newDimension.trim()) {
                                      const dims = formData.dimensions || [];
                                      if (!dims.includes(newDimension.trim())) {
                                        setFormData({ ...formData, dimensions: [...dims, newDimension.trim()] });
                                      }
                                      setNewDimension('');
                                    }
                                  }}
                                  className="px-4 py-2 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-all"
                                >
                                  Add
                                </button>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {['6x4 ft', '8x8 ft', '10x10 ft', '12x15 ft', '15x20 ft'].map(dim => (
                                <button
                                  key={dim}
                                  type="button"
                                  onClick={() => {
                                    const dims = formData.dimensions || [];
                                    const newDims = dims.includes(dim)
                                      ? dims.filter(d => d !== dim)
                                      : [...dims, dim];
                                    setFormData({ ...formData, dimensions: newDims });
                                  }}
                                  className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest border transition-all ${
                                    formData.dimensions?.includes(dim)
                                      ? 'bg-zinc-900 text-white border-zinc-900'
                                      : 'bg-white text-zinc-400 border-zinc-200 hover:border-zinc-900'
                                  }`}
                                >
                                  {dim}
                                </button>
                              ))}
                            </div>
                            {formData.dimensions?.length > 0 && (
                              <div className="flex flex-wrap gap-2 p-4 bg-zinc-50 border border-zinc-100 rounded-sm">
                                {formData.dimensions.map(dim => (
                                  <div key={dim} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-zinc-200 text-[8px] font-black uppercase tracking-widest text-zinc-900">
                                    {dim}
                                    <button 
                                      type="button"
                                      onClick={() => setFormData({ ...formData, dimensions: formData.dimensions.filter(d => d !== dim) })}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <X size={10} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Inventory Tab */}
                {activeTab === 'inventory' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-white p-8 border border-zinc-100 shadow-sm rounded-sm space-y-8">
                       <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900 block">Pricing Strategy</label>
                          <div className="flex gap-2">
                             {['fixed', 'meter'].map(type => (
                               <button 
                                 key={type}
                                 type="button"
                                 onClick={() => setFormData({ ...formData, price_type: type })}
                                 className={`flex-1 py-4 px-6 text-[10px] uppercase font-black tracking-widest border transition-all ${
                                   formData.price_type === type 
                                     ? 'bg-zinc-900 text-white border-zinc-900 shadow-md' 
                                     : 'bg-white text-zinc-400 border-zinc-200'
                                 }`}
                                >
                                 {type === 'meter' ? 'Per Meter Pricing' : 'Fixed Product Pricing'}
                               </button>
                             ))}
                          </div>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block mb-2">Product SKU</label>
                            <input 
                              type="text" 
                              placeholder="e.g. SKML-001"
                              className="w-full p-4 bg-zinc-50 border border-zinc-100 focus:border-zinc-900 outline-none uppercase font-bold text-xs tracking-widest transition-all"
                              value={formData.sku}
                              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block mb-2">Lead Time (Ships In)</label>
                            <input 
                              type="text" 
                              placeholder="e.g. 2-3 Days"
                              className="w-full p-4 bg-zinc-50 border border-zinc-100 focus:border-zinc-900 outline-none uppercase font-bold text-xs tracking-widest transition-all"
                              value={formData.lead_time}
                              onChange={(e) => setFormData({ ...formData, lead_time: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block mb-2">Availability Status</label>
                            <select 
                              className="w-full p-4 bg-zinc-50 border border-zinc-100 focus:border-zinc-900 outline-none text-[10px] font-black uppercase tracking-widest cursor-pointer"
                              value={formData.stock_status}
                              onChange={(e) => setFormData({ ...formData, stock_status: e.target.value })}
                            >
                              <option value="In Stock">In Stock (Standard)</option>
                              <option value="Limited Edition">Limited Edition</option>
                              <option value="Made to Order">Made to Order (Boutique)</option>
                              <option value="Pre-Order">Pre-Order</option>
                              <option value="Out of Stock">Out of Stock</option>
                            </select>
                          </div>
                       </div>

                       <div className="p-6 bg-zinc-50 border border-zinc-100 rounded-sm flex items-center justify-between">
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900 block">Featured Selection</label>
                            <p className="text-[8px] text-zinc-400 uppercase tracking-tighter mt-1">Show this product in the homepage featured collection</p>
                          </div>
                          <button 
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, is_featured: !prev.is_featured }))}
                            className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${
                              formData.is_featured 
                                ? 'bg-zinc-900 text-white border-zinc-900 shadow-xl scale-105' 
                                : 'bg-white text-zinc-400 border-zinc-200 hover:border-zinc-400'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${formData.is_featured ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-200'}`} />
                              {formData.is_featured ? 'Featured Item' : 'Standard Product'}
                            </div>
                          </button>
                       </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sticky Footer Actions */}
              <div className="sticky bottom-0 bg-white border-t border-zinc-100 p-6 flex items-center justify-between gap-4 z-20">
                 <div className="hidden md:block">
                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                       Draft: {formData.name || 'Untitled Product'}
                    </p>
                    <p className="text-[7px] text-zinc-300 uppercase font-black">Changes are not saved until published</p>
                 </div>
                 <div className="flex gap-3 w-full md:w-auto">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 md:flex-none px-10 py-4 border border-zinc-200 text-zinc-400 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50 transition-all"
                    >
                      Discard
                    </button>
                    <button 
                      type="submit"
                      disabled={loading || uploading}
                      className="flex-1 md:flex-none px-12 py-4 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-800 disabled:opacity-50 transition-all shadow-xl flex items-center justify-center gap-3"
                    >
                      {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                      {loading ? 'SAVING...' : (editingProduct ? 'Update Product' : 'Publish to Store')}
                    </button>
                 </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
