import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/UI/ProductCard';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  if (wishlist.length === 0) {
    return (
      <div className="pt-32 pb-20 min-h-screen bg-white flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-6 text-zinc-300">
          <Heart size={40} />
        </div>
        <h2 className="text-3xl font-bold text-zinc-900 uppercase tracking-tight mb-4">Your Wishlist is Empty</h2>
        <p className="text-zinc-500 max-w-sm mb-8">
          Save your favorite backdrops and fabrics here to view them later or move them to your cart.
        </p>
        <Link 
          to="/shop" 
          className="px-10 py-4 bg-zinc-900 text-white font-bold uppercase tracking-widest text-xs hover:bg-secondary hover:text-white transition-all"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 min-h-screen bg-white">
      <div className="container mx-auto px-4">
        <header className="mb-12" data-aos="fade-right">
          <span className="text-secondary text-xs uppercase tracking-[0.3em] mb-4 block">Favorites</span>
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 uppercase tracking-tight">Your Wishlist</h1>
          <p className="text-zinc-500 mt-2">{wishlist.length} Items saved</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {wishlist.map((product) => (
            <div key={product.id} className="relative group">
              <ProductCard product={product} />
              <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => removeFromWishlist(product.id)}
                  className="h-10 w-10 bg-zinc-900/80 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  title="Remove from Wishlist"
                >
                  <Trash2 size={18} />
                </button>
                <button 
                  onClick={() => handleMoveToCart(product)}
                  className="h-10 w-10 bg-white text-zinc-900 rounded-full flex items-center justify-center hover:bg-secondary hover:text-white transition-colors"
                  title="Move to Cart"
                >
                  <ShoppingBag size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
