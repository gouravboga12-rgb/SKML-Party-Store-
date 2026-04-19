import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products, categories } from '../data/products';
import ProductCard from '../components/UI/ProductCard';
import { SlidersHorizontal, Search } from 'lucide-react';

const Shop = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [activeCategory, setActiveCategory] = useState(categoryParam || 'all');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    let result = products;

    if (activeCategory !== 'all') {
      result = result.filter(p => p.category === activeCategory);
    }

    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(result);
  }, [activeCategory, searchQuery]);

  // Handle URL param changes
  useEffect(() => {
    if (categoryParam) setActiveCategory(categoryParam);
    const sq = searchParams.get('search');
    if (sq) setSearchQuery(sq);
  }, [categoryParam, searchParams]);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-white">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="mb-12" data-aos="fade-right">
          <span className="text-secondary text-xs uppercase tracking-[0.3em] mb-4 block">Collections</span>
          <h1 className="text-5xl md:text-6xl font-black text-zinc-900 uppercase tracking-tight">Full Catalog</h1>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12" data-aos="fade-up">
          {/* Categories */}
          <div className="flex flex-wrap gap-4 flex-grow">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-6 py-2 text-[10px] uppercase tracking-widest font-bold border transition-all ${
                activeCategory === 'all' 
                ? 'bg-zinc-900 text-white border-zinc-900' 
                : 'text-zinc-400 border-zinc-200 hover:border-zinc-900 hover:text-zinc-900'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-2 text-[10px] uppercase tracking-widest font-bold border transition-all ${
                  activeCategory === cat.id 
                  ? 'bg-zinc-900 text-white border-zinc-900' 
                  : 'text-zinc-400 border-zinc-200 hover:border-zinc-900 hover:text-zinc-900'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input
              type="text"
              placeholder="SEARCH PRODUCTS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs tracking-widest px-12 py-3 focus:outline-none focus:border-zinc-900 transition-all uppercase"
            />
          </div>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-zinc-100" data-aos="fade-in">
          <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">
            Showing {filteredProducts.length} Results
          </p>
          <div className="flex items-center gap-2 text-zinc-500 text-[10px] uppercase tracking-widest font-bold">
            <SlidersHorizontal size={14} />
            <span>Sort By: Newest</span>
          </div>
        </div>

        {/* Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center space-y-4">
            <p className="text-zinc-500 uppercase tracking-widest text-sm">No products found matching your criteria.</p>
            <button 
              onClick={() => {setActiveCategory('all'); setSearchQuery('');}}
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
