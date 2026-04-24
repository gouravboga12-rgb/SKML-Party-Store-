import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShoppingBag, Truck } from 'lucide-react';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckoutClick = (e) => {
    if (!user) {
      e.preventDefault();
      // Redirect to login but remember to come back to checkout
      navigate('/login?redirect=checkout');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="pt-48 pb-24 min-h-screen bg-white flex flex-col items-center justify-center space-y-8 px-4">
        <div className="h-24 w-24 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-300" data-aos="zoom-in">
          <ShoppingBag size={48} />
        </div>
        <div className="text-center space-y-4" data-aos="fade-up">
          <h1 className="text-4xl font-black text-zinc-900 uppercase tracking-tight">Your cart is empty</h1>
          <p className="text-zinc-400 font-light tracking-widest uppercase text-sm">Looks like you haven't added anything yet.</p>
        </div>
        <Link 
          to="/shop" 
          className="px-12 py-4 bg-zinc-900 text-white font-bold uppercase tracking-widest text-xs hover:bg-secondary transition-all"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Explore Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-12" data-aos="fade-right">
          <span className="text-secondary text-xs uppercase tracking-[0.3em] mb-4 block">Bag</span>
          <h1 className="text-5xl md:text-6xl font-black text-zinc-900 uppercase tracking-tight">Shopping Cart</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-8" data-aos="fade-up">
            {cart.map((item) => (
              <div key={item.cartItemId} className="flex flex-col sm:flex-row gap-6 pb-8 border-b border-zinc-100 group">
                {/* Image */}
                <Link to={`/product/${item.id}`} className="w-full sm:w-32 aspect-square bg-zinc-50 rounded-sm overflow-hidden block">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?q=80&w=1000&auto=format&fit=crop';
                    }}
                  />
                </Link>

                {/* Info */}
                <div className="flex-grow space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-secondary text-[10px] uppercase tracking-widest font-bold mb-1 block">
                        {item.category.replace('-', ' ')}
                      </span>
                      <Link to={`/product/${item.id}`}>
                        <h3 className="text-zinc-900 text-lg font-bold uppercase tracking-tight hover:text-secondary transition-colors">{item.name}</h3>
                      </Link>
                      {(item.selectedHeight && item.selectedWidth) ? (
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                          Dimensions: {item.selectedHeight}ft x {item.selectedWidth}ft
                        </p>
                      ) : null}
                      {item.selectedDimension && (
                        <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest">
                          Dimension: {item.selectedDimension}
                        </p>
                      )}
                      {item.lead_time && (
                        <p className="text-[10px] text-secondary font-bold uppercase tracking-widest flex items-center gap-1">
                          <Plus size={10} /> Ships in: {item.lead_time}
                        </p>
                      )}
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="text-zinc-400 hover:text-red-500 transition-colors p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-4">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-zinc-200 self-start">
                      <button 
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="px-4 py-2 text-zinc-900 hover:bg-zinc-50 transition-colors"
                      ><Minus size={14} /></button>
                      <div className="flex flex-col items-center px-1">
                        <span className="w-10 text-center text-zinc-900 text-xs font-bold">{item.quantity}</span>
                        {item.price_type === 'meter' && <span className="text-[8px] text-zinc-400 font-bold uppercase -mt-1">Meters</span>}
                      </div>
                      <button 
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="px-4 py-2 text-zinc-900 hover:bg-zinc-50 transition-colors"
                      ><Plus size={14} /></button>
                    </div>

                    {/* Price */}
                    <p className="text-xl font-bold text-zinc-900 tracking-tight">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-8">
              <Link to="/shop" className="text-zinc-400 hover:text-zinc-900 transition-colors text-xs uppercase tracking-[0.2em] font-bold flex items-center gap-2">
                <ArrowLeft size={16} /> Continue Shopping
              </Link>
            </div>
          </div>

          {/* Summary */}
          <div className="relative" data-aos="fade-left">
            <div className="bg-zinc-50 p-8 rounded-sm sticky top-32 space-y-8 border border-zinc-100 shadow-xl">
              <h2 className="text-2xl font-bold text-zinc-900 uppercase tracking-tight">Order Summary</h2>
              
              <div className="space-y-4 pt-4">
                <div className="flex justify-between text-zinc-500 text-sm uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span className="text-zinc-900 font-bold">₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-500 text-sm uppercase tracking-widest">
                  <span>Shipping</span>
                  <span className="text-secondary font-bold text-[10px]">Calculated at Checkout</span>
                </div>
                <div className="pt-4 border-t border-zinc-200 flex justify-between">
                  <span className="text-zinc-900 font-black uppercase tracking-[0.2em]">Total</span>
                  <span className="text-2xl font-black text-zinc-900 tracking-tight">₹{cartTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-4 pt-6">
                <Link 
                  to="/checkout" 
                  onClick={handleCheckoutClick}
                  className="w-full py-4 bg-zinc-900 text-white font-bold uppercase tracking-widest text-xs hover:bg-secondary hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  Proceed to Checkout <ArrowRight size={16} />
                </Link>
                
                <div className="p-4 bg-white rounded-sm border border-zinc-200 space-y-2">
                   <p className="text-[10px] text-zinc-900 uppercase tracking-widest font-black flex items-center gap-2">
                      <Truck size={14} className="text-secondary" /> Shipping Partners
                   </p>
                   <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest leading-relaxed">
                      Pan-India via <span className="text-zinc-900 font-bold">DTDC</span>. Local (Vizag) same-day via <span className="text-secondary font-bold">Rapido & Uber</span>.
                   </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
