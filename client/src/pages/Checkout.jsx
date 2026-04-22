import React, { useState, useEffect } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { CreditCard, Truck, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Checkout = () => {
  const { cart: cartItems, cartTotal: cartTotalAmount, clearCart } = useCart();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState('idle'); // idle, processing, success, error

  // Check if this is a direct purchase (Buy Now)
  const directPurchase = location.state?.directPurchase;
  const directQuantity = location.state?.quantity || 1;

  // Final data to use for checkout
  const items = directPurchase 
    ? [{ ...directPurchase, quantity: directQuantity }] 
    : cartItems;

  const totalAmount = directPurchase 
    ? directPurchase.price * directQuantity 
    : cartTotalAmount;

  // If not logged in, they shouldn't even be here
  if (!user) {
    return <Navigate to="/login?redirect=checkout" replace />;
  }

  const [formData, setFormData] = useState({
    fullName: profile?.full_name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    notes: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRazorpayPayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOrderStatus('processing');

    // Validate form
    if (!formData.fullName || !formData.phone || !formData.address) {
      alert("Please fill in all required fields.");
      setLoading(false);
      setOrderStatus('idle');
      return;
    }

    try {
      // 1. Create order on the server
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/order/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalAmount, receipt: `order_${Date.now()}` })
      });
      
      if (!response.ok) throw new Error('Order creation failed');
      const order = await response.json();

      // 2. Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Should be Key ID from Razorpay Dashboard
        amount: order.amount,
        currency: order.currency,
        name: "SKML Party Store",
        description: "Order Checkout",
        image: "/logo.jpeg",
        order_id: order.id,
        handler: async function (response) {
          // 3. Verify payment on the server
          const verifyRes = await fetch(`${import.meta.env.VITE_API_URL}/api/order/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response)
          });
          
          if (verifyRes.ok) {
            handleOrderSuccess(response.razorpay_payment_id);
          } else {
            setOrderStatus('error');
            setLoading(false);
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: "#000000"
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response) {
        setOrderStatus('error');
        setLoading(false);
      });
      rzp1.open();

    } catch (error) {
      console.error("Error initializing payment:", error);
      setOrderStatus('error');
      setLoading(false);
    }
  };

  const handleOrderSuccess = async (paymentId) => {
    try {
      setLoading(true);
      // 1. Save main order to Supabase
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          pincode: formData.pincode,
          total_amount: totalAmount,
          payment_id: paymentId,
          payment_status: 'completed',
          order_notes: formData.notes,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Save all items in the order with full details
      const orderItems = items.map(item => ({
        order_id: orderData.id,
        product_id: Number(item.id),
        product_name: item.name,
        product_image: item.image,
        quantity: item.quantity,
        price_at_purchase: item.price,
        selected_color: item.selectedColor || null,
        selected_size: item.selectedSize || null,
        selected_height: item.selectedHeight || null,
        selected_width: item.selectedWidth || null
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      setOrderStatus('success');
      clearCart();
    } catch (err) {
      console.error('Database save error:', err);
      // Even if DB fails, payment was successful, so we should handle gracefully
      setOrderStatus('success'); 
      clearCart();
    } finally {
      setLoading(false);
    }
  };

  if (orderStatus === 'success') {
    return (
      <div className="pt-48 pb-24 min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <div className="h-24 w-24 bg-zinc-50 rounded-full flex items-center justify-center text-secondary mb-8" data-aos="zoom-in">
          <CheckCircle2 size={48} />
        </div>
        <div className="text-center space-y-4 mb-12" data-aos="fade-up">
          <h1 className="text-4xl font-black text-zinc-900 uppercase tracking-tight">Order Confirmed!</h1>
          <p className="text-zinc-500 font-light tracking-widest uppercase text-sm">
            Thank you for choosing S K M L Party Store. <br />
            Our team will process your order and ship via <span className="text-secondary font-bold">DCDT Courier</span>.
          </p>
        </div>
        <div className="flex flex-col gap-4 w-full max-w-xs" data-aos="fade-up" data-aos-delay="100">
          <Link 
            to="/" 
            className="w-full py-4 bg-zinc-900 text-white font-bold uppercase tracking-widest text-[10px] text-center hover:bg-secondary transition-all"
          >
            Back to Home
          </Link>
          <a 
            href={`https://wa.me/919398324095?text=Hello, I just placed an order! Name: ${formData.fullName}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 border border-zinc-200 text-zinc-900 font-bold uppercase tracking-widest text-[10px] text-center hover:bg-zinc-900 hover:text-white transition-all"
          >
            Check Status on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-12" data-aos="fade-right">
          <span className="text-secondary text-xs uppercase tracking-[0.3em] mb-4 block">Secure</span>
          <h1 className="text-5xl md:text-6xl font-black text-zinc-900 uppercase tracking-tight">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Checkout Form */}
          <form className="lg:col-span-2 space-y-12" onSubmit={handleRazorpayPayment} data-aos="fade-up">
            <div className="space-y-8">
              <h2 className="text-xl font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                 <span className="h-8 w-8 rounded-full border border-secondary text-secondary flex items-center justify-center text-xs">1</span>
                 Shipping Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Full Name *</label>
                  <input 
                    name="fullName" required value={formData.fullName} onChange={handleInputChange}
                    className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs p-4 focus:border-zinc-900 focus:outline-none transition-all uppercase tracking-widest"
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Email Address</label>
                  <input 
                    name="email" type="email" value={formData.email} onChange={handleInputChange}
                    className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs p-4 focus:border-zinc-900 focus:outline-none transition-all tracking-widest"
                    placeholder="Enter email (optional)"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Phone Number *</label>
                  <input 
                    name="phone" required value={formData.phone} onChange={handleInputChange}
                    className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs p-4 focus:border-zinc-900 focus:outline-none transition-all tracking-widest"
                    placeholder="Enter 10-digit number"
                  />
                </div>
                <div className="space-y-2">
                   <label className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Pincode *</label>
                   <input 
                     name="pincode" required value={formData.pincode} onChange={handleInputChange}
                     className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs p-4 focus:border-zinc-900 focus:outline-none transition-all tracking-widest"
                     placeholder="Enter local pincode"
                   />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Full Address *</label>
                  <textarea 
                    name="address" required value={formData.address} onChange={handleInputChange}
                    rows="3"
                    className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs p-4 focus:border-zinc-900 focus:outline-none transition-all uppercase tracking-widest resize-none"
                    placeholder="Building, Street, Area details"
                  ></textarea>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Order Notes</label>
                  <input 
                    name="notes" value={formData.notes} onChange={handleInputChange}
                    className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs p-4 focus:border-zinc-900 focus:outline-none transition-all uppercase tracking-widest"
                    placeholder="Custom requirements or special instructions"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-8">
               <h2 className="text-xl font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                  <span className="h-8 w-8 rounded-full border border-secondary text-secondary flex items-center justify-center text-xs">2</span>
                  Delivery Information
               </h2>
               <div className="p-6 bg-zinc-50 border border-zinc-100 rounded-sm flex items-start gap-4">
                  <div className="h-10 w-10 bg-zinc-900 rounded-full flex items-center justify-center text-white shrink-0">
                    <Truck size={20} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-zinc-900 text-xs font-bold uppercase tracking-widest">Standard Delivery via DCDT</p>
                    <p className="text-zinc-500 text-[10px] uppercase leading-relaxed font-light">
                      Safe and secure shipping through our partner DCDT courier. Expected delivery within 3-7 business days.
                    </p>
                  </div>
                  <div className="ml-auto text-secondary text-[10px] font-bold uppercase tracking-widest">Free</div>
               </div>
            </div>

            <div className="pt-8">
               <button 
                type="submit"
                disabled={loading}
                className="w-full py-6 bg-zinc-900 text-white font-black uppercase tracking-[0.3em] text-xs hover:bg-secondary transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? "Initializing Gateway..." : "Pay Now via Razorpay"} <ArrowRight size={18} />
              </button>
              <div className="mt-4 flex items-center justify-center gap-4 opacity-40">
                <ShieldCheck size={16} />
                <span className="text-[8px] uppercase tracking-[0.4em] font-black">Encrypted & Secure Payment</span>
                <CreditCard size={16} />
              </div>
            </div>
          </form>

          {/* Cart Sidebar */}
          <div className="relative" data-aos="fade-left">
            <div className="bg-zinc-50 p-8 rounded-sm sticky top-32 space-y-8 border border-zinc-100 shadow-xl">
              <h2 className="text-2xl font-bold text-zinc-900 uppercase tracking-tight">Your Order</h2>
              
              <div className="space-y-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="h-16 w-16 shrink-0 bg-zinc-200 overflow-hidden">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-zinc-900 text-[10px] font-bold uppercase tracking-widest truncate">{item.name}</p>
                      <p className="text-zinc-500 text-[10px] uppercase">Qty: {item.quantity}</p>
                      <p className="text-zinc-900 text-[10px] font-bold mt-1">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-zinc-200">
                <div className="flex justify-between text-zinc-500 text-[10px] uppercase tracking-widest font-bold">
                  <span>Subtotal</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-500 text-[10px] uppercase tracking-widest font-bold">
                  <span>Delivery</span>
                  <span className="text-green-600 uppercase">Free</span>
                </div>
                <div className="pt-4 flex justify-between">
                  <span className="text-zinc-900 font-black uppercase tracking-[0.2em] text-sm">Total</span>
                  <span className="text-2xl font-black text-zinc-900 tracking-tight">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {orderStatus === 'error' && (
                <div className="p-4 bg-red-950/30 border border-red-900/50 rounded-sm flex items-start gap-3">
                   <AlertCircle size={16} className="text-red-500 shrink-0" />
                   <div className="space-y-1">
                      <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">Payment Failed</p>
                      <p className="text-red-400/70 text-[10px] leading-relaxed">Could not initialize payment gateway. Please check your connection or contact support.</p>
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
