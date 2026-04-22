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
    description: '',
    image: '',
    images: [],
    colors: [],
    sizes: [],
    price_type: 'fixed',
    price_unit: 'per piece',
    min_order: 1,
    lead_time: '',
    stock_status: 'In Stock',
    discount_pct: 0,
    rating: 4.5,
    reviews_count: 0
  });
  const [uploading, setUploading] = useState(false);

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
      
      setIsModalOpen(false);
      setEditingProduct(null);
      resetForm();
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
      description: '',
      image: '',
      images: [],
      colors: [],
      sizes: [],
      price_type: 'fixed',
      price_unit: 'per piece',
      min_order: 1,
      lead_time: '',
      stock_status: 'In Stock',
      discount_pct: 0,
      rating: 4.5,
      reviews_count: 0
    });
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
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

      {/* Product Table */}
      <div className="bg-white border border-zinc-200 rounded-sm overflow-x-auto shadow-sm scrollbar-hide">
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
                    <span className="text-sm font-black text-zinc-900 uppercase">₹{p.price}</span>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
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

      {/* Modal / Side Panel */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 md:p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full h-full md:h-auto md:max-w-4xl md:rounded-sm shadow-2xl flex flex-col max-h-screen md:max-h-[90vh] overflow-hidden">
            <div className="p-4 md:p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
              <div>
                <h2 className="text-xl md:text-3xl font-black uppercase tracking-tighter">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <p className="text-[8px] md:text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mt-1 md:mt-2">Inventory Management System</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white border border-zinc-200 rounded-full hover:bg-red-50 hover:text-red-500 transition-all">
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 md:p-10 bg-white">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left Column: Media */}
                <div className="space-y-8">
                  <div className="p-6 bg-zinc-50 border border-zinc-100 rounded-sm mb-8">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block mb-4">Product Inventory Type</label>
                    <div className="flex gap-2">
                      <button 
                        type="button"
                        onClick={() => setFormData({ ...formData, colors: [], sizes: [] })}
                        className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest border transition-all ${
                          (!formData.colors?.length && !formData.sizes?.length) 
                            ? 'bg-zinc-900 text-white border-zinc-900 shadow-md' 
                            : 'bg-white text-zinc-400 border-zinc-200'
                        }`}
                      >
                        Single Product
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          if (!formData.colors?.length) {
                             setFormData({ ...formData, colors: [{ name: 'Default', value: '#000000', image: '' }] });
                          }
                        }}
                        className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest border transition-all ${
                          (formData.colors?.length || formData.sizes?.length) 
                            ? 'bg-zinc-900 text-white border-zinc-900 shadow-md' 
                            : 'bg-white text-zinc-400 border-zinc-200'
                        }`}
                      >
                        Multiple Variants
                      </button>
                    </div>
                    <p className="text-[8px] text-zinc-400 mt-3 italic uppercase font-bold tracking-tighter">Choose "Multiple Variants" for Sarees or Backdrops with multiple colors/sizes.</p>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block mb-2">Main Product Image</label>
                    <div className="aspect-[4/5] border-2 border-dashed border-zinc-200 rounded-sm bg-zinc-50 flex flex-col items-center justify-center relative group overflow-hidden">
                      {formData.image ? (
                        <>
                          <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={() => setFormData({ ...formData, image: '' })}
                            className="absolute top-4 right-4 p-2 bg-black/60 text-white rounded-full hover:bg-red-600 transition-all"
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <div className="text-center p-10 space-y-4">
                          <ImageIcon size={48} className="mx-auto text-zinc-300 group-hover:text-zinc-900 transition-colors" />
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
                          <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900">Uploading to Cloudinary...</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block mb-2">Additional Media (Gallery)</label>
                    <div className="grid grid-cols-4 gap-3">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="aspect-square bg-zinc-100 rounded-sm relative group overflow-hidden">
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
                      <div className="aspect-square border-2 border-dashed border-zinc-200 rounded-sm flex items-center justify-center relative hover:border-zinc-900 transition-all">
                        <Plus size={20} className="text-zinc-300" />
                        <input 
                          type="file" 
                          multiple
                          className="absolute inset-0 opacity-0 cursor-pointer" 
                          onChange={(e) => handleUpload(e, 'gallery')}
                          disabled={uploading}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Details */}
                <div className="space-y-8">
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block mb-2">Category</label>
                        <select 
                          required
                          className="w-full p-4 bg-zinc-50 border border-zinc-200 focus:border-zinc-900 outline-none text-[10px] font-black uppercase tracking-widest appearance-none transition-all cursor-pointer"
                          value={formData.category}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData({ 
                              ...formData, 
                              category: val
                            });
                          }}
                        >
                          <option value="">Select Category</option>
                          {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block mb-2">Price (INR)</label>
                        <input 
                          type="number" 
                          required
                          placeholder="500"
                          className="w-full p-4 bg-zinc-50 border border-zinc-200 focus:border-zinc-900 outline-none font-bold text-xs"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block mb-2">Product Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Traditional Red Backdrop"
                        className="w-full p-4 bg-zinc-50 border border-zinc-200 focus:border-zinc-900 outline-none uppercase font-bold text-xs tracking-widest tracking-tight transition-all"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block mb-2">Sub Category</label>
                      <input 
                        type="text" 
                        placeholder="e.g. traditional, floral, modern"
                        className="w-full p-4 bg-zinc-50 border border-zinc-200 focus:border-zinc-900 outline-none uppercase font-bold text-xs tracking-widest transition-all"
                        value={formData.sub_category}
                        onChange={(e) => setFormData({ ...formData, sub_category: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block mb-2">Description</label>
                      <textarea 
                        rows="4"
                        placeholder="Detailed product specifications and info..."
                        className="w-full p-4 bg-zinc-50 border border-zinc-200 focus:border-zinc-900 outline-none text-xs font-medium leading-relaxed transition-all"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="p-8 bg-zinc-50 border border-zinc-100 rounded-sm space-y-8">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 underline underline-offset-4">Variants Management (Optional)</p>
                    
                    {/* Color Variants */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900">Color Variants</label>
                        <button 
                          type="button"
                          onClick={() => setFormData({
                            ...formData,
                            colors: [...(formData.colors || []), { name: '', value: '#000000', image: '' }]
                          })}
                          className="px-3 py-2 bg-zinc-900 text-white text-[8px] font-black uppercase tracking-widest rounded-sm hover:bg-secondary transition-all shadow-lg"
                        >
                          + Add Color Option
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        {formData.colors?.map((color, idx) => (
                          <div key={idx} className="bg-white p-4 border border-zinc-200 rounded-sm group relative shadow-sm hover:shadow-md transition-all">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                              <div className="md:col-span-4">
                                <input 
                                  type="text"
                                  placeholder="Color Name"
                                  className="w-full p-3 bg-zinc-50 border border-zinc-100 text-[10px] font-bold uppercase tracking-widest focus:border-zinc-900 outline-none"
                                  value={color.name}
                                  onChange={(e) => {
                                    const newColors = [...formData.colors];
                                    newColors[idx].name = e.target.value;
                                    setFormData({ ...formData, colors: newColors });
                                  }}
                                />
                              </div>
                              <div className="md:col-span-1">
                                <input 
                                  type="color"
                                  className="w-full h-10 p-1 bg-zinc-50 border border-zinc-100 cursor-pointer rounded-sm"
                                  value={color.value}
                                  onChange={(e) => {
                                    const newColors = [...formData.colors];
                                    newColors[idx].value = e.target.value;
                                    setFormData({ ...formData, colors: newColors });
                                  }}
                                />
                              </div>
                              <div className="md:col-span-6 flex items-center gap-3">
                                <div className="w-10 h-10 bg-zinc-100 rounded-sm overflow-hidden border border-zinc-200 flex-shrink-0">
                                  {color.image ? (
                                    <img src={color.image} alt="Preview" className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <ImageIcon size={14} className="text-zinc-300" />
                                    </div>
                                  )}
                                </div>
                                <div className="relative flex-1">
                                  <button type="button" className="w-full py-2 bg-zinc-100 text-zinc-600 text-[8px] font-black uppercase tracking-widest rounded-sm hover:bg-zinc-200 transition-all border border-zinc-200">
                                    {color.image ? 'Change Photo' : 'Upload Photo'}
                                  </button>
                                  <input 
                                    type="file" 
                                    className="absolute inset-0 opacity-0 cursor-pointer" 
                                    onChange={(e) => handleUpload(e, 'color', idx)}
                                    disabled={uploading}
                                  />
                                </div>
                              </div>
                              <div className="md:col-span-1 text-right">
                                <button 
                                  type="button"
                                  onClick={() => setFormData({
                                    ...formData,
                                    colors: formData.colors.filter((_, i) => i !== idx)
                                  })}
                                  className="p-2 text-zinc-300 hover:text-red-500 transition-colors"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                        {(!formData.colors || formData.colors.length === 0) && (
                          <p className="text-[9px] text-zinc-400 italic">No color variants added.</p>
                        )}
                      </div>
                    </div>

                    {/* Size Variants */}
                    <div className="space-y-4 pt-4 border-t border-zinc-200">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900">Size Variants</label>
                        <div className="flex gap-2">
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
                              className={`px-2 py-1 text-[8px] font-black uppercase tracking-widest border transition-all ${
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
                    </div>

                    <div className="pt-4 border-t border-zinc-200">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6 underline underline-offset-4">Advanced Attributes</p>
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block">Pricing Model</label>
                          <div className="flex flex-wrap gap-2">
                            {['fixed', 'meter', 'sqft'].map(type => (
                              <button 
                                key={type}
                                type="button"
                                onClick={() => setFormData({ ...formData, price_type: type })}
                                className={`flex-1 py-3 px-4 text-[10px] uppercase font-black tracking-widest border transition-all ${
                                  formData.price_type === type 
                                    ? 'bg-zinc-900 text-white border-zinc-900' 
                                    : 'bg-white text-zinc-400 border-zinc-200'
                                }`}
                              >
                                {type === 'sqft' ? 'Area (HxW)' : type === 'meter' ? 'Per Meter' : 'Fixed'}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block mb-2">Price Unit Label</label>
                            <input 
                              type="text" 
                              placeholder="e.g. per piece, per sqft"
                              className="w-full p-4 bg-zinc-50 border border-zinc-200 focus:border-zinc-900 outline-none text-xs font-bold uppercase tracking-widest"
                              value={formData.price_unit}
                              onChange={(e) => setFormData({ ...formData, price_unit: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block mb-2">Min Order (MOQ)</label>
                            <input 
                              type="number" 
                              className="w-full p-4 bg-zinc-50 border border-zinc-200 focus:border-zinc-900 outline-none text-xs font-bold"
                              value={formData.min_order}
                              onChange={(e) => setFormData({ ...formData, min_order: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block mb-2">Production Lead Time</label>
                            <input 
                              type="text" 
                              placeholder="e.g. 5-7 business days"
                              className="w-full p-4 bg-zinc-50 border border-zinc-200 focus:border-zinc-900 outline-none text-xs font-medium"
                              value={formData.lead_time}
                              onChange={(e) => setFormData({ ...formData, lead_time: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block mb-2">Sale Discount (%)</label>
                            <input 
                              type="number" 
                              placeholder="e.g. 20"
                              className="w-full p-4 bg-zinc-50 border border-zinc-200 focus:border-zinc-900 outline-none text-xs font-bold"
                              value={formData.discount_pct}
                              onChange={(e) => setFormData({ ...formData, discount_pct: e.target.value })}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block mb-2">Availability Status</label>
                          <select 
                            className="w-full p-4 bg-zinc-50 border border-zinc-200 focus:border-zinc-900 outline-none text-[10px] font-black uppercase tracking-widest"
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
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={loading || uploading}
                    className="w-full py-6 bg-zinc-900 text-white text-xs font-black uppercase tracking-widest hover:bg-zinc-800 disabled:opacity-50 transition-all shadow-2xl flex items-center justify-center gap-3"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                    {loading ? 'SAVING DATA...' : (editingProduct ? 'Update Product' : 'Publish Product')}
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
