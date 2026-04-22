import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Phone, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import RatingStars from './RatingStars';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const getSalePrice = () => {
    const basePrice = Number(product?.price) || 0;
    const discount = Number(product?.discount_pct) || 0;
    return basePrice * (1 - (discount / 100));
  };

  const isLiked = isInWishlist(product?.id);
  const salePrice = getSalePrice();
  const formattedSalePrice = typeof salePrice === 'number' && !isNaN(salePrice) ? salePrice.toLocaleString() : '0';
  const formattedBasePrice = product?.price ? Number(product.price).toLocaleString() : '0';

  const optimizeImage = (url) => {
    if (!url || !url.includes('cloudinary.com')) return url;
    // Inject optimization parameters after /upload/
    return url.replace('/upload/', '/upload/q_auto,f_auto,w_600/');
  };

  return (
    <div 
      className="group relative bg-white overflow-hidden rounded-sm transition-all duration-500 hover:shadow-2xl hover:shadow-zinc-200/50 border border-zinc-100"
      data-aos="fade-up"
      data-aos-duration="600"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <Link to={`/product/${product?.id}`} className="block h-full w-full">
          <img
            src={optimizeImage(product?.image) || 'https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?q=80&w=1000&auto=format&fit=crop'}
            alt={product?.name || 'Product'}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?q=80&w=1000&auto=format&fit=crop';
            }}
          />
        </Link>
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4 pointer-events-none">
          <button 
            tabIndex={0}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (product?.colors?.length > 0 || product?.sizes?.length > 0) {
                 navigate(`/product/${product.id}`);
              } else {
                 addToCart({ ...product, price: salePrice });
              }
            }}
            className="p-3 bg-white text-black rounded-full hover:bg-secondary transition-colors pointer-events-auto shadow-xl"
            title={product?.colors?.length > 0 || product?.sizes?.length > 0 ? "Select Options" : "Add to Cart"}
          >
            <ShoppingCart size={20} />
          </button>
          <a 
            href={`https://wa.me/919398324095?text=Hello, I am interested in: ${product?.name}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors pointer-events-auto shadow-xl"
            title="Inquire via WhatsApp"
          >
            <Phone size={20} />
          </a>
        </div>

        {/* Wishlist Button */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-4 right-4 h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md ${
            isLiked ? 'bg-white text-red-600 scale-110 shadow-lg' : 'bg-white/40 text-zinc-900 hover:bg-zinc-900 hover:text-white'
          }`}
        >
          <Heart size={20} fill={isLiked ? "currentColor" : "none"} strokeWidth={2} />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-5 space-y-2">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-secondary font-medium">
              {product?.category?.replace('-', ' ') || 'Collection'}
            </span>
            {product?.sub_category && (
              <span className="text-[9px] uppercase tracking-tighter text-zinc-400 italic">
                {product.sub_category}
              </span>
            )}
          </div>
          <div className="flex flex-col items-end">
            <span className="text-zinc-900 font-bold tracking-tight">
              ₹{formattedSalePrice}{product?.price_type === 'meter' ? ' / m' : ''}
            </span>
            {product?.discount_pct !== 0 && (
              <span className="text-[9px] text-zinc-400 line-through">
                ₹{formattedBasePrice}
              </span>
            )}
          </div>
        </div>
        <Link to={`/product/${product?.id}`}>
          <h3 className="text-zinc-900 text-sm font-light uppercase tracking-widest group-hover:text-secondary transition-colors line-clamp-1">
            {product?.name || 'Premium Product'}
          </h3>
        </Link>
        <RatingStars rating={product?.rating || 4.5} count={product?.reviews_count || 0} />
        
        <button 
          onClick={() => {
            if (product?.colors?.length > 0 || product?.sizes?.length > 0) {
               navigate(`/product/${product.id}`);
            } else {
               addToCart({ ...product, price: salePrice });
            }
          }}
          className="w-full mt-4 py-2 text-[10px] uppercase tracking-[0.2em] border border-zinc-200 hover:bg-zinc-900 hover:text-white transition-all duration-300 font-bold"
        >
          {product?.colors?.length > 0 || product?.sizes?.length > 0 ? "Select Options" : "Quick Add"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
