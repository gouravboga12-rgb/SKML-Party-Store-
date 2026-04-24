import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
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
  X,
  Loader2
} from 'lucide-react';
import RatingStars from '../components/UI/RatingStars';
import ProductCard from '../components/UI/ProductCard';
import SEO from '../components/SEO/SEO';
import { useAuth } from '../context/AuthContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [height, setHeight] = useState(8); // Default height for Area items
  const [width, setWidth] = useState(8);   // Default width for Area items
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [customSize, setCustomSize] = useState('');
  const [selectedDimension, setSelectedDimension] = useState('');
  const [customDimension, setCustomDimension] = useState('');
  const [showZoom, setShowZoom] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Review States
  const [reviews, setReviews] = useState([]);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  
  const mainImageRef = useRef(null);

  useEffect(() => {
    fetchProductDetails();
    fetchReviews();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (user && id) {
      checkPurchaseStatus();
    }
  }, [user, id]);

  const fetchReviews = async () => {
    try {
      const isOwner = user?.email === 'trendingfabricstore@gmail.com';
      
      let query = supabase
        .from('reviews')
        .select('*')
        .eq('product_id', id)
        .order('created_at', { ascending: false });

      // If not owner, only show approved reviews
      if (!isOwner) {
        query = query.eq('status', 'approved');
      }

      const { data, error } = await query;

      if (!error) setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const moderateReview = async (reviewId, newStatus) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ status: newStatus })
        .eq('id', reviewId);

      if (!error) {
        fetchReviews();
        alert(`Review ${newStatus} successfully.`);
      }
    } catch (error) {
      console.error('Error moderating review:', error);
    }
  };

  const deleteReview = async (reviewId) => {
    if (!window.confirm('Delete this review permanently?')) return;
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (!error) fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const checkPurchaseStatus = async () => {
    try {
      // Check if user has a DELIVERED order with this product
      const { data, error } = await supabase
        .from('orders')
        .select(`id, status, order_items!inner(product_id)`)
        .eq('user_id', user.id)
        .eq('order_items.product_id', id)
        .eq('status', 'delivered')
        .limit(1);

      if (!error && data?.length > 0) {
        setHasPurchased(true);
      }
    } catch (error) {
      console.error('Error checking purchase status:', error);
    }
  };

  const submitReview = async () => {
    if (!newReview.comment) return;
    try {
      setSubmitting(true);
      const { error } = await supabase
        .from('reviews')
        .insert({
          product_id: id,
          user_id: user.id,
          user_name: user.user_metadata?.full_name || 'Verified Buyer',
          rating: newReview.rating,
          comment: newReview.comment,
          status: 'approved'
        });

      if (error) throw error;
      
      setNewReview({ rating: 5, comment: '' });
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const optimizeImage = (url, width = 1000) => {
    if (!url || !url.includes('cloudinary.com')) return url;
    return url.replace('/upload/', `/upload/q_auto,f_auto,w_${width}/`);
  };

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch main product first
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error || !data) {
        console.error('Product fetch error:', error);
        navigate('/shop');
        return;
      }

      setProduct(data);
      setActiveImage(data.image);
      setQuantity(data.min_order || 1);
      
      if (data.colors?.length > 0) {
        setSelectedColor(data.colors[0]);
        if (data.colors[0].image) setActiveImage(data.colors[0].image);
      }
      
      if (data.sizes?.length > 0) {
        setSelectedSize(data.sizes[0]);
      }

      if (data.dimensions?.length > 0) {
        setSelectedDimension(data.dimensions[0]);
      }

      // Fetch related products in the background
      supabase
        .from('products')
        .select('*')
        .eq('category', data.category)
        .neq('id', id)
        .limit(4)
        .then(({ data: related }) => {
          setRelatedProducts(related || []);
        });

    } catch (err) {
      console.error('System error:', err);
      navigate('/shop');
    } finally {
      // Set a small delay to ensure UI transitions smoothly
      setTimeout(() => setLoading(false), 300);
    }
  };

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

  const getUnitPrice = () => {
    if (!product) return 0;
    return product.price;
  };

  const getDiscountedUnitPrice = () => {
    return getUnitPrice() * (1 - ((product?.discount_pct || 0) / 100));
  };

  const handleAddToCart = () => {
    const productToCart = {
      ...product,
      price: getCurrentPrice(),
      selectedColor: selectedColor?.name,
      selectedSize: selectedSize === 'Custom' ? `Custom: ${customSize}` : selectedSize,
      selectedDimension: selectedDimension === 'Custom' ? `Custom: ${customDimension}` : selectedDimension
    };
    addToCart(productToCart, quantity);
  };

  const isVideo = (url) => {
    if (!url) return false;
    const urlStr = String(url).toLowerCase();
    return urlStr.endsWith('.mp4') || 
           urlStr.endsWith('.webm') || 
           urlStr.endsWith('.ogg') ||
           urlStr.includes('/video/upload/');
  };

  const getThumbnail = (url) => {
    if (!url) return '';
    const urlStr = String(url);
    if (isVideo(urlStr)) {
      // Improved Cloudinary thumbnail logic
      if (urlStr.includes('/video/upload/')) {
        return urlStr.replace('/video/upload/', '/video/upload/c_fill,g_center,h_200,w_200,so_0/').replace(/\.[^/.]+$/, ".jpg");
      }
      return urlStr; // Return video URL itself if not Cloudinary
    }
    return urlStr;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={48} className="animate-spin text-zinc-900" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Loading Product Details</p>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <SEO 
        title={product.name}
        description={`Buy ${product.name} at SKML Fabric Store. Premium ${product.category} boutique fabric. High quality, reliable delivery.`}
        keywords={`${product.name}, ${product.category} fabric, boutique fabric, vizag store`}
        image={product.image}
        url={`product/${product.id}`}
      />
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
          <div className="lg:col-span-1 flex lg:flex-col gap-3 order-2 lg:order-1 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 scrollbar-hide" data-aos="fade-right" data-aos-duration="600">
            {[...new Set([product.image, ...(Array.isArray(product.images) ? product.images : [])])].filter(Boolean).map((img, idx) => {
              const thumbnail = getThumbnail(img);
              const isVid = isVideo(img);
              
              return (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`flex-shrink-0 w-20 h-24 border-2 transition-all ${
                    activeImage === img ? 'border-zinc-900 shadow-md scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                  } rounded-sm overflow-hidden bg-transparent relative group`}
                >
                  {isVideo(thumbnail) ? (
                    <video 
                      src={thumbnail} 
                      muted 
                      playsInline 
                      className="w-full h-full object-cover"
                      onMouseOver={(e) => e.target.play()}
                      onMouseOut={(e) => {
                        e.target.pause();
                        e.target.currentTime = 0;
                      }}
                    />
                  ) : (
                    <img 
                      src={thumbnail} 
                      alt="" 
                      className="w-full h-full object-cover transition-opacity duration-300" 
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/200x250?text=Media';
                      }}
                    />
                  )}
                  {isVid && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors pointer-events-none">
                      <div className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                        <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-zinc-900 border-b-[6px] border-b-transparent ml-1"></div>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Center: Main Image Viewer */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-4" data-aos="fade-up" data-aos-duration="600">
            <div 
              className="relative aspect-[4/5] bg-transparent rounded-sm overflow-hidden border border-zinc-100 cursor-zoom-in"
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
                  src={optimizeImage(activeImage, 1000)} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/800x1000?text=Product+Image';
                  }}
                />
              )}
              <div className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
                 <Maximize2 size={16} className="text-zinc-900" />
              </div>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="lg:col-span-5 order-3 space-y-8" data-aos="fade-left" data-aos-duration="600">
            <div className="space-y-4">
              <div className="flex items-baseline gap-4">
                <p className="text-3xl font-bold text-zinc-900 tracking-tight">
                  ₹{getDiscountedUnitPrice().toLocaleString()}
                  <span className="text-sm text-zinc-400 font-normal ml-1">/{product.price_unit || (product.price_type === 'meter' ? 'meter' : 'pc')}</span>
                </p>
                <div className="flex items-baseline gap-2">
                  {product?.discount_pct > 0 && (
                    <>
                      <span className="text-zinc-400 line-through text-xs">₹{getUnitPrice().toLocaleString()}</span>
                      <span className="text-green-600 text-[10px] font-black uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                        {product.discount_pct}% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>

            </div>

            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-full border ${
                product.stock_status?.toLowerCase().includes('out') ? 'bg-red-50 text-red-600 border-red-100' : 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
              }`}>
                {product.stock_status || 'In Stock'}
              </span>
              {product.lead_time && (
                <span className="px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-full bg-secondary text-white border border-secondary shadow-sm">
                  {product.lead_time}
                </span>
              )}
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


            {/* Sizes (Show only when product has sizes, is not meter-priced, AND has no dimension variants) */}
            {product.sizes && product.sizes.length > 0 && product.price_type !== 'meter' && (!product.dimensions || product.dimensions.length === 0) && (
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

            {/* Dimensions (Show only when product has dimensions defined) */}
            {product.dimensions && product.dimensions.length > 0 && (
              <div className="space-y-4">
                <span className="text-zinc-900 text-[10px] uppercase tracking-widest font-bold">
                  Select Dimension: <span className="text-secondary">{String(selectedDimension).toUpperCase()}</span>
                </span>
                <div className="flex flex-wrap gap-3">
                  {product.dimensions.map(dim => (
                    <button
                      key={dim}
                      onClick={() => setSelectedDimension(dim)}
                      className={`px-6 py-3 text-[10px] uppercase tracking-widest font-bold border transition-all ${
                        String(selectedDimension).toLowerCase() === String(dim).toLowerCase()
                        ? 'bg-zinc-900 text-white border-zinc-900'
                        : 'text-zinc-400 border-zinc-200 hover:border-zinc-900'
                      }`}
                    >
                      {dim}
                    </button>
                  ))}
                </div>

                {String(selectedDimension).toLowerCase() === 'custom' && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="text-zinc-400 text-[9px] uppercase tracking-widest font-bold mb-2 block">Enter Your Dimensions (e.g. 14x20 ft)</label>
                    <input
                      type="text"
                      placeholder="e.g. 14x20 ft"
                      className="w-full border-b border-zinc-900 py-2 text-sm focus:outline-none focus:border-zinc-900 transition-colors uppercase tracking-widest"
                      value={customDimension}
                      onChange={(e) => setCustomDimension(e.target.value)}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="space-y-4 pt-4">

              <div className="py-4 px-6 bg-zinc-50 border border-zinc-100 rounded-sm flex justify-between items-center animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="space-y-0.5">
                  <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Calculated Total</p>
                  <p className="text-lg font-black text-zinc-900 tracking-tight">₹{(getDiscountedUnitPrice() * quantity).toLocaleString()}</p>
                </div>
                <div className="px-3 py-1 bg-zinc-900 rounded-full">
                  <p className="text-[8px] font-black text-white uppercase tracking-widest">{quantity} {product.price_type === 'meter' ? 'Meters' : 'Items'}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="space-y-2 w-full sm:w-auto">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-1">
                    {product.price_type === 'meter' ? 'Number of Meters' : 'Quantity'}
                  </label>
                  <div className="flex items-center border border-zinc-200">
                    <button 
                      onClick={() => setQuantity(Math.max(product.min_order || 1, quantity - 1))}
                      className="px-6 py-4 text-zinc-900 hover:bg-zinc-50 transition-colors"
                    >-</button>
                    <input 
                      type="number" 
                      value={quantity}
                      min={product.min_order || 1}
                      onChange={(e) => setQuantity(Math.max(product.min_order || 1, parseInt(e.target.value) || 1))}
                      className="w-16 bg-transparent text-center text-zinc-900 text-sm font-bold focus:outline-none"
                    />
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-6 py-4 text-zinc-900 hover:bg-zinc-50 transition-colors"
                    >+</button>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    const productToCart = {
                      ...product,
                      price: getDiscountedUnitPrice(),
                      selectedColor: selectedColor?.name,
                      selectedSize: selectedSize === 'Custom' ? `Custom: ${customSize}` : selectedSize,
                      selectedDimension: selectedDimension === 'Custom' ? `Custom: ${customDimension}` : selectedDimension
                    };
                    addToCart(productToCart, quantity);
                  }}
                  disabled={product.stock_status?.toLowerCase().includes('out')}
                  className={`flex-grow w-full py-4 font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 mt-auto ${
                    product.stock_status?.toLowerCase().includes('out') 
                      ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed' 
                      : 'bg-zinc-900 text-white hover:bg-secondary'
                  }`}
                >
                  <ShoppingCart size={18} /> {product.stock_status?.toLowerCase().includes('out') ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
              
              {product.min_order > 1 && (
                <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">* MINIMUM ORDER QUANTITY: {product.min_order} UNITS</p>
              )}
              
              <button 
                className="w-full py-4 bg-zinc-100 text-zinc-900 font-bold uppercase tracking-widest text-xs hover:bg-zinc-900 hover:text-white transition-all flex items-center justify-center gap-2"
                onClick={() => navigate('/checkout', { 
                  state: { 
                    directPurchase: { 
                      ...product, 
                      price: getDiscountedUnitPrice(),
                      selectedColor: selectedColor?.name,
                      selectedSize: selectedSize === 'Custom' ? `Custom: ${customSize}` : selectedSize,
                      selectedDimension: selectedDimension === 'Custom' ? `Custom: ${customDimension}` : selectedDimension
                    }, 
                    quantity 
                  }
                })}
              >
                Buy Now
              </button>

              <a 
                href={`https://wa.me/919398324095?text=Hello, I want to inquire about: ${product.name} ${selectedColor ? `(Color: ${selectedColor.name})` : ''} ${selectedSize ? `(Size: ${selectedSize})` : ''} ${selectedDimension ? `(Dimension: ${selectedDimension === 'Custom' ? customDimension : selectedDimension})` : ''}`}
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
                  <p className="text-zinc-900 text-[10px] font-bold uppercase tracking-widest leading-none mb-1">DTDC Delivery</p>
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
              
              {/* Review Submission Form (Only for Verified Buyers) */}
              {user && hasPurchased && (
                <div className="bg-zinc-50 p-6 rounded-sm space-y-4 border border-zinc-100 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-900">Write Your Review</p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          className={`transition-all ${newReview.rating >= star ? 'text-secondary' : 'text-zinc-300'}`}
                        >
                          <Star size={16} fill={newReview.rating >= star ? 'currentColor' : 'none'} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    placeholder="Share your experience with this boutique collection..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    className="w-full bg-white border border-zinc-200 p-4 text-xs font-medium focus:border-zinc-900 outline-none resize-none h-24"
                  />
                  <button
                    onClick={submitReview}
                    disabled={submitting || !newReview.comment}
                    className="w-full py-3 bg-zinc-900 text-white text-[9px] font-black uppercase tracking-widest hover:bg-secondary transition-all disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Post Review'}
                  </button>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-6">
                {reviews.length > 0 ? (
                  reviews.map((rev) => (
                    <div key={rev.id} className="space-y-3 pb-6 border-b border-zinc-100 group">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-3">
                            <p className="text-xs font-black uppercase text-zinc-900">{rev.user_name}</p>
                            <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[7px] font-black uppercase tracking-[0.2em] rounded-full border border-green-100 flex items-center gap-1">
                              <ShieldCheck size={8} /> Verified Buyer
                            </span>
                            {user?.email === 'trendingfabricstore@gmail.com' && (
                              <span className={`px-2 py-0.5 text-[7px] font-black uppercase tracking-[0.2em] rounded-full border ${
                                rev.status === 'approved' ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-red-50 text-red-600 border-red-100'
                              }`}>
                                {rev.status}
                              </span>
                            )}
                          </div>
                          <p className="text-[8px] text-zinc-400 uppercase tracking-widest mt-1">
                            {new Date(rev.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                          </p>
                        </div>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} size={10} fill={rev.rating >= star ? 'currentColor' : 'none'} className={rev.rating >= star ? 'text-secondary' : 'text-zinc-200'} />
                          ))}
                        </div>
                      </div>
                      <p className="text-zinc-500 text-sm font-light leading-relaxed">{rev.comment}</p>
                      
                      {/* Actions Bar */}
                      <div className="flex items-center gap-4 mt-2">
                        {/* User's own review actions */}
                        {user && user.id === rev.user_id && (
                          <button 
                            onClick={() => deleteReview(rev.id)}
                            className="text-[8px] font-black text-zinc-400 hover:text-red-500 uppercase tracking-widest transition-colors"
                          >
                            Delete My Review
                          </button>
                        )}

                        {/* Owner Moderation Actions */}
                        {user?.email === 'trendingfabricstore@gmail.com' && (
                          <div className="flex items-center gap-3 border-l border-zinc-100 pl-4">
                            <button 
                              onClick={() => moderateReview(rev.id, rev.status === 'approved' ? 'hidden' : 'approved')}
                              className={`text-[8px] font-black uppercase tracking-widest transition-colors ${
                                rev.status === 'approved' ? 'text-zinc-400 hover:text-zinc-900' : 'text-green-600 hover:text-green-700'
                              }`}
                            >
                              {rev.status === 'approved' ? 'Hide Review' : 'Approve Review'}
                            </button>
                            <button 
                              onClick={() => deleteReview(rev.id)}
                              className="text-[8px] font-black text-red-500 hover:text-red-700 uppercase tracking-widest transition-colors"
                            >
                              Force Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center border border-dashed border-zinc-200 rounded-sm">
                    <Star className="mx-auto text-zinc-200 mb-3" size={24} />
                    <p className="text-zinc-400 text-[10px] uppercase font-black tracking-widest">No verified reviews yet</p>
                    {(!user || !hasPurchased) && (
                      <p className="text-zinc-300 text-[8px] uppercase tracking-widest mt-2 italic">Reviewing is unlocked once your product is officially delivered</p>
                    )}
                  </div>
                )}
              </div>
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
