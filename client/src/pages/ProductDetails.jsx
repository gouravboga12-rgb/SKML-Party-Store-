import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { 
  ShoppingCart, 
  Phone, 
  Truck, 
  ShieldCheck, 
  RefreshCw, 
  ChevronRight, 
  Star, 
  ChevronLeft, 
  Maximize2,
  Check,
  X
} from 'lucide-react';
import RatingStars from '../components/UI/RatingStars';
import ProductCard from '../components/UI/ProductCard';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [customSize, setCustomSize] = useState('');
  const [showZoom, setShowZoom] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  const mainImageRef = useRef(null);

  useEffect(() => {
    const foundProduct = products.find(p => p.id === parseInt(id));
    if (foundProduct) {
      setProduct(foundProduct);
      setActiveImage(foundProduct.image);
      
      // Select default color if available
      if (foundProduct.colors && foundProduct.colors.length > 0) {
        setSelectedColor(foundProduct.colors[0]);
        setActiveImage(foundProduct.colors[0].image);
      }
      
      // Select default size if available
      if (foundProduct.sizes && foundProduct.sizes.length > 0) {
        setSelectedSize(foundProduct.sizes[0]);
      }

      // Filter related products
      const related = products.filter(p => 
        p.category === foundProduct.category && p.id !== foundProduct.id
      ).slice(0, 4);
      setRelatedProducts(related);
      
    } else {
      navigate('/shop');
    }
    window.scrollTo(0, 0);
  }, [id, navigate]);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setActiveImage(color.image);
  };

  // Sync selected color when active image changes (e.g. from gallery click)
  useEffect(() => {
    if (product?.colors) {
      const matchingColor = product.colors.find(c => c.image === activeImage);
      if (matchingColor && matchingColor.name !== selectedColor?.name) {
        setSelectedColor(matchingColor);
      }
    }
  }, [activeImage, product, selectedColor]);

  const handleAddToCart = () => {
    const productToCart = {
      ...product,
      selectedColor: selectedColor?.name,
      selectedSize: selectedSize === 'Custom' ? `Custom: ${customSize}` : selectedSize
    };
    addToCart(productToCart, quantity);
  };

  const isVideo = (url) => url?.toLowerCase().endsWith('.mp4');

  if (!product) return null;

  return (
    <div className="pt-32 pb-24 min-h-screen bg-white">
      <div className="container mx-auto px-4 md:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-8 text-zinc-400 text-[10px] uppercase tracking-widest font-bold" data-aos="fade-right">
          <Link to="/" className="hover:text-zinc-900 transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link to="/shop" className="hover:text-zinc-900 transition-colors">Shop</Link>
          <ChevronRight size={12} />
          <span className="text-zinc-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-1 flex lg:flex-col gap-3 order-2 lg:order-1 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 scrollbar-hide">
            {(product.images || [product.image]).map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`flex-shrink-0 w-20 h-24 border-2 transition-all ${
                  activeImage === img ? 'border-zinc-900 shadow-md scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                } rounded-sm overflow-hidden bg-zinc-50`}
              >
                {isVideo(img) ? (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                    <Star size={16} className="text-white animate-pulse" />
                  </div>
                ) : (
                  <img src={img} alt={`${product.name} shadow ${idx}`} className="w-full h-full object-cover" />
                )}
              </button>
            ))}
          </div>

          {/* Center: Main Image Viewer */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-4" data-aos="fade-up">
            <div 
              className="relative aspect-[4/5] bg-zinc-50 rounded-sm overflow-hidden border border-zinc-100 cursor-zoom-in"
              onClick={() => setShowZoom(true)}
            >
              {isVideo(activeImage) ? (
                <video 
                  src={activeImage} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img 
                  ref={mainImageRef}
                  src={activeImage} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?q=80&w=1000&auto=format&fit=crop';
                  }}
                />
              )}
              <div className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
                 <Maximize2 size={16} className="text-zinc-900" />
              </div>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="lg:col-span-5 order-3 space-y-8" data-aos="fade-left">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-secondary text-xs uppercase tracking-[0.3em] font-medium block">
                  {product.category.replace('-', ' ')}
                </span>
                <RatingStars rating={product.rating || 4.5} count={product.reviewsCount || 0} />
              </div>
              
              <h1 className="text-3xl md:text-5xl font-black text-zinc-900 uppercase tracking-tight leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-baseline gap-4">
                <p className="text-3xl font-bold text-zinc-900 tracking-tight">₹{product.price.toLocaleString()}</p>
                <span className="text-zinc-400 line-through text-sm">₹{(product.price * 1.5).toFixed(0)}</span>
                <span className="text-green-600 text-xs font-bold uppercase tracking-widest">33% OFF</span>
              </div>
            </div>

            <p className="text-zinc-500 text-base font-light leading-relaxed">
              {product.description}
            </p>

            {/* Colors */}
            {product.colors && product.colors.length > 1 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-900 text-[10px] uppercase tracking-widest font-bold">Select Variant / Color: <span className="text-secondary">{selectedColor?.name}</span></span>
                </div>
                <div className="flex flex-wrap gap-4">
                  {product.colors.map(color => (
                    <button
                      key={color.name}
                      onClick={() => handleColorSelect(color)}
                      className={`w-14 h-16 rounded-sm border-2 transition-all flex items-center justify-center overflow-hidden bg-zinc-50 ${
                        selectedColor?.name === color.name ? 'border-zinc-900 scale-105 shadow-md' : 'border-zinc-100 hover:border-zinc-300'
                      }`}
                      title={color.name}
                    >
                      <div 
                        className="w-full h-full flex items-center justify-center relative" 
                        style={{ 
                          backgroundColor: color.value,
                          backgroundImage: color.image ? `url(${color.image})` : 'none',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      >
                        {selectedColor?.name === color.name && (
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <Check size={18} className="text-white drop-shadow-lg" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}


            {/* Sizes */}
            {product.sizes && (
              <div className="space-y-4">
                <span className="text-zinc-900 text-[10px] uppercase tracking-widest font-bold">Select Size</span>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-8 py-3 text-[10px] uppercase tracking-widest font-bold border transition-all ${
                        selectedSize === size
                        ? 'bg-zinc-900 text-white border-zinc-900'
                        : 'text-zinc-400 border-zinc-200 hover:border-zinc-900'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                
                {selectedSize === 'Custom' && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="text-zinc-400 text-[9px] uppercase tracking-widest font-bold mb-2 block">Enter Dimensions (e.g. 15x15 ft)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 15x15 ft" 
                      className="w-full border-b border-zinc-200 py-2 text-sm focus:outline-none focus:border-zinc-900 transition-colors uppercase tracking-widest"
                      value={customSize}
                      onChange={(e) => setCustomSize(e.target.value)}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="space-y-4 pt-4">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center border border-zinc-200 w-full sm:w-auto">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-6 py-4 text-zinc-900 hover:bg-zinc-50 transition-colors"
                  >-</button>
                  <input 
                    type="number" 
                    value={quantity}
                    readOnly
                    className="w-16 bg-transparent text-center text-zinc-900 text-sm font-bold focus:outline-none"
                  />
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-6 py-4 text-zinc-900 hover:bg-zinc-50 transition-colors"
                  >+</button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  className="flex-grow w-full py-4 bg-zinc-900 text-white font-bold uppercase tracking-widest text-xs hover:bg-secondary hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={18} /> Add to Cart
                </button>
              </div>
              
              <button 
                className="w-full py-4 bg-zinc-100 text-zinc-900 font-bold uppercase tracking-widest text-xs hover:bg-zinc-900 hover:text-white transition-all flex items-center justify-center gap-2"
                onClick={() => navigate('/checkout', { state: { directPurchase: product, quantity }})}
              >
                Buy Now
              </button>

              <a 
                href={`https://wa.me/919398324095?text=Hello, I want to inquire about: ${product.name} ${selectedColor ? `(Color: ${selectedColor.name})` : ''} ${selectedSize ? `(Size: ${selectedSize})` : ''}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 border border-zinc-900 text-zinc-900 font-bold uppercase tracking-widest text-xs hover:bg-zinc-900 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <Phone size={18} /> Inquire via WhatsApp
              </a>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-zinc-100 opacity-70">
              <div className="flex items-center gap-3">
                <Truck size={20} className="text-secondary" />
                <div className="text-left">
                  <p className="text-zinc-900 text-[10px] font-bold uppercase tracking-widest leading-none mb-1">DCDT Delivery</p>
                  <p className="text-zinc-400 text-[10px] uppercase">Fast Shipping</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck size={20} className="text-secondary" />
                <div className="text-left">
                  <p className="text-zinc-900 text-[10px] font-bold uppercase tracking-widest leading-none mb-1">Razorpay Secured</p>
                  <p className="text-zinc-400 text-[10px] uppercase">Safe Checkout</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RefreshCw size={20} className="text-secondary" />
                <div className="text-left">
                  <p className="text-zinc-900 text-[10px] font-bold uppercase tracking-widest leading-none mb-1">Easy Exchange</p>
                  <p className="text-zinc-400 text-[10px] uppercase">Policy Applied</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Info Section */}
        <div className="mt-24 border-t border-zinc-100 pt-16">
          <div className="flex border-b border-zinc-100 mb-12">
            <button className="px-8 py-4 text-xs font-bold uppercase tracking-[0.3em] border-b-2 border-zinc-900">Description</button>
            <button className="px-8 py-4 text-xs font-bold uppercase tracking-[0.3em] text-zinc-400 border-b-2 border-transparent hover:text-zinc-900">Reviews ({product.reviews?.length || 0})</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            <div className="prose prose-sm text-zinc-500 font-light leading-loose tracking-wide">
              <h4 className="text-zinc-900 uppercase font-black tracking-widest mb-4">Specifications</h4>
              <ul className="space-y-4 list-none p-0">
                {product.specifications ? (
                  Object.entries(product.specifications).map(([key, value]) => (
                    <li key={key} className="flex justify-between border-b border-zinc-50 pb-2">
                      <span className="uppercase text-[10px] font-bold text-zinc-400">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="text-zinc-900">{value}</span>
                    </li>
                  ))
                ) : (
                  <>
                    <li className="flex justify-between border-b border-zinc-50 pb-2">
                      <span className="uppercase text-[10px] font-bold text-zinc-400">Material</span>
                      <span className="text-zinc-900">Premium Boutique Fabric</span>
                    </li>
                    <li className="flex justify-between border-b border-zinc-50 pb-2">
                      <span className="uppercase text-[10px] font-bold text-zinc-400">Occasion</span>
                      <span className="text-zinc-900">Social Events & Party Decor</span>
                    </li>
                    <li className="flex justify-between border-b border-zinc-50 pb-2">
                      <span className="uppercase text-[10px] font-bold text-zinc-400">Care</span>
                      <span className="text-zinc-900">Dry Clean Recommended</span>
                    </li>
                  </>
                )}
              </ul>
            </div>

            
            <div className="space-y-8">
              <h4 className="text-zinc-900 uppercase font-black tracking-widest mb-4">Customer Reviews</h4>
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((rev, i) => (
                  <div key={i} className="space-y-2 pb-6 border-b border-zinc-50">
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-bold uppercase text-zinc-900">{rev.user}</p>
                      <span className="text-[10px] text-zinc-400">{rev.date}</span>
                    </div>
                    <RatingStars rating={rev.rating} size={10} showCount={false} />
                    <p className="text-zinc-500 text-sm font-light">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-zinc-400 text-xs italic">No reviews yet. Be the first to share your experience!</p>
              )}
              <button className="text-[10px] font-bold uppercase tracking-widest border-b border-zinc-900 pb-1">Write a Review</button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 border-t border-zinc-100 pt-16">
            <h2 className="text-3xl font-black text-zinc-900 uppercase tracking-tight mb-12">Related Collections</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Zoom Modal (Simple) */}
      {showZoom && !isVideo(activeImage) && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setShowZoom(false)}
        >
          <img 
            src={activeImage} 
            alt="Zoomed product" 
            className="max-w-full max-h-full object-contain animate-in zoom-in-95 duration-300" 
          />
          <button className="absolute top-8 right-8 text-white hover:rotate-90 transition-transform">
            <X size={32} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
