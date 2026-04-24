import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/UI/ProductCard';
import SEO from '../components/SEO/SEO';
import { SlidersHorizontal, Search, X, Loader2, ChevronDown } from 'lucide-react';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(categoryParam || 'all');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState('newest'); // newest, price-low, price-high
  const [isSortOpen, setIsSortOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [activeCategory, searchQuery, sortBy]);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*');
    if (data) setCategories(data);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Only select necessary columns for the shop grid to speed up loading
      let query = supabase.from('products').select('id, name, price, image, discount_pct, price_type, stock_status, category, lead_time, price_unit');

      // Filtering
      if (activeCategory !== 'all') {
        query = query.eq('category', activeCategory);
      }

      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }

      // Sorting
      if (sortBy === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else if (sortBy === 'price-low') {
        query = query.order('price', { ascending: true });
      } else if (sortBy === 'price-high') {
        query = query.order('price', { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    setSearchParams(prev => {
      if (catId === 'all') prev.delete('category');
      else prev.set('category', catId);
      return prev;
    });
  };

  const sortOptions = {
    'newest': 'Newest First',
    'price-low': 'Price: Low to High',
    'price-high': 'Price: High to Low'
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-white">
      <SEO 
        title="Shop Premium Boutique Fabrics"
        description="Browse our full catalog of premium boutique fabrics and event backdrops. High-quality velvet, cotton, and party decor materials available for online order."
        keywords="buy fabric online india, premium velvet cloth, event backdrop materials, shop fabrics visakhapatnam, party supplies online"
        url="shop"
      />
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="mb-12" data-aos="fade-right">
          <span className="text-secondary text-xs uppercase tracking-[0.3em] mb-4 block">Collections</span>
          <h1 className="text-5xl md:text-6xl font-black text-zinc-900 uppercase tracking-tight">Full Catalog</h1>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12" data-aos="fade-up">
          {/* Categories */}
          <div className="flex flex-wrap gap-3 flex-grow">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-6 py-2 text-[10px] uppercase tracking-widest font-bold border rounded-full transition-all ${
                activeCategory === 'all' 
                ? 'bg-zinc-900 text-white border-zinc-900 shadow-lg' 
                : 'text-zinc-400 border-zinc-200 hover:border-zinc-900 hover:text-zinc-900'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-6 py-2 text-[10px] uppercase tracking-widest font-bold border rounded-full transition-all ${
                  activeCategory === cat.id 
                  ? 'bg-zinc-900 text-white border-zinc-900 shadow-lg' 
                  : 'text-zinc-400 border-zinc-200 hover:border-zinc-900 hover:text-zinc-900'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="lg:w-96">
            <div className="flex items-center bg-zinc-50 border border-zinc-200 px-6 rounded-full focus-within:border-zinc-900 focus-within:bg-white focus-within:shadow-2xl focus-within:shadow-zinc-200/50 transition-all group">
              <Search className="text-zinc-400 group-focus-within:text-zinc-900 transition-colors" size={18} />
              <input
                type="text"
                placeholder="SEARCH PRODUCTS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none text-zinc-900 text-[10px] font-bold tracking-[0.2em] px-4 py-4 focus:outline-none uppercase"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-zinc-400 hover:text-zinc-900 transition-colors p-1"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Info & Sort */}
        <div className="flex justify-between items-center mb-12 pb-4 border-b border-zinc-100" data-aos="fade-in">
          <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">
            {loading ? 'Searching...' : `Showing ${products.length} Results`}
          </p>
          
          <div className="relative">
            <button 
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-2 text-zinc-900 text-[10px] uppercase tracking-widest font-black hover:opacity-70 transition-all"
            >
              <SlidersHorizontal size={14} />
              <span>Sort By: {sortOptions[sortBy]}</span>
              <ChevronDown size={12} className={`transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isSortOpen && (
              <div className="absolute right-0 mt-4 w-48 bg-white border border-zinc-100 shadow-2xl z-50 py-2 animate-in fade-in slide-in-from-top-2">
                {Object.entries(sortOptions).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => {
                      setSortBy(value);
                      setIsSortOpen(false);
                    }}
                    className={`w-full text-left px-6 py-3 text-[10px] uppercase tracking-widest font-bold transition-colors ${
                      sortBy === value ? 'bg-zinc-900 text-white' : 'text-zinc-400 hover:bg-zinc-50 hover:text-zinc-900'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="space-y-4">
                <div className="aspect-[3/4] bg-zinc-100 animate-pulse rounded-sm relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-zinc-100 rounded-sm w-3/4 animate-pulse" />
                  <div className="h-3 bg-zinc-100 rounded-sm w-1/2 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center space-y-4">
            <p className="text-zinc-500 uppercase tracking-widest text-sm">No products found matching your criteria.</p>
            <button 
              onClick={() => {handleCategoryChange('all'); setSearchQuery('');}}
              className="text-zinc-900 border-b border-zinc-900 pb-1 uppercase text-xs tracking-widest font-bold"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
