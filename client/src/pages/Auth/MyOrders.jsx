import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { Package, Truck, CheckCircle2, Clock, ChevronRight, ShoppingBag, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircle2 className="text-green-500" size={18} />;
      case 'shipped': return <Truck className="text-blue-500" size={18} />;
      case 'processing': return <Package className="text-amber-500" size={18} />;
      default: return <Clock className="text-zinc-400" size={18} />;
    }
  };

  if (loading) {
    return (
      <div className="pt-48 pb-24 min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-zinc-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pt-40 pb-24 min-h-screen bg-white">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-12 space-y-2">
          <h1 className="text-4xl font-black text-zinc-900 uppercase tracking-tighter italic">My Order History</h1>
          <p className="text-zinc-400 text-xs uppercase tracking-widest">Track and manage your elite purchases</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-zinc-50 border border-dashed border-zinc-200 rounded-sm p-20 text-center space-y-6">
            <ShoppingBag className="mx-auto text-zinc-300" size={48} />
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-zinc-900 uppercase tracking-tight">No orders yet</h3>
              <p className="text-zinc-400 text-[10px] uppercase tracking-widest">Your collection is waiting for its first piece.</p>
            </div>
            <Link to="/shop" className="inline-block px-12 py-4 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-all">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="group bg-white border border-zinc-100 rounded-sm overflow-hidden hover:shadow-2xl hover:shadow-zinc-200/50 transition-all duration-500">
                {/* Order Header */}
                <div className="bg-zinc-50/50 p-6 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-zinc-900 font-black text-xs uppercase tracking-widest">Order ID: #{order.id.slice(0, 8)}</span>
                      <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-widest">Placed on {new Date(order.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-zinc-400 text-[10px] uppercase tracking-widest mb-1 leading-none">Total Amount</p>
                    <p className="text-zinc-900 font-black text-xl tracking-tighter italic">₹{Number(order.total_amount).toLocaleString()}</p>
                  </div>
                </div>

                {/* Items Preview */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Items In Bag</h4>
                    <div className="space-y-3">
                      {order.order_items?.map((item) => (
                        <Link 
                          key={item.id} 
                          to={`/product/${item.product_id}`}
                          className="flex items-center gap-4 group/item hover:bg-zinc-50 p-2 rounded-sm transition-all"
                        >
                          <div className="w-12 h-12 bg-zinc-100 rounded-sm overflow-hidden flex-shrink-0 border border-zinc-100 group-hover/item:border-zinc-900 transition-colors">
                            <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover transition-transform group-hover/item:scale-110" />
                          </div>
                          <div className="flex-grow min-w-0">
                            <p className="text-zinc-900 text-[10px] font-bold uppercase tracking-widest truncate group-hover/item:text-secondary transition-colors">{item.product_name}</p>
                            <div className="flex flex-wrap gap-2 mt-0.5">
                              {item.selected_color && <span className="text-[7px] font-black text-zinc-400 uppercase tracking-tighter">Color: {item.selected_color}</span>}
                              {item.selected_size && <span className="text-[7px] font-black text-zinc-400 uppercase tracking-tighter">Size: {item.selected_size}</span>}
                              {item.selected_height && item.selected_width && (
                                <span className="text-[7px] font-black text-zinc-400 uppercase tracking-tighter">
                                  {Number(item.selected_height)}x{Number(item.selected_width)} FT
                                </span>
                              )}
                            </div>
                            <p className="text-zinc-400 text-[9px] uppercase tracking-widest mt-0.5">Qty: {item.quantity} × ₹{Number(item.price_at_purchase).toLocaleString()}</p>
                          </div>
                          <ChevronRight size={12} className="text-zinc-200 group-hover/item:text-zinc-900 transition-all opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1" />
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="bg-zinc-50/30 p-6 space-y-4 rounded-sm border border-zinc-50">
                    <h4 className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Shipping Destination</h4>
                    <div className="space-y-1.5">
                      <p className="text-zinc-900 text-[10px] font-bold uppercase tracking-widest">{order.full_name}</p>
                      <p className="text-zinc-500 text-[10px] leading-relaxed uppercase font-light truncate">{order.address}</p>
                      <p className="text-zinc-500 text-[10px] uppercase font-light">PIN: {order.pincode}</p>
                      
                      {order.tracking_id && (
                        <div className="mt-4 p-3 bg-secondary/5 border-l-2 border-secondary rounded-r-sm space-y-2">
                           <p className="text-[7px] font-black text-secondary/60 uppercase tracking-[0.2em]">DCDT Tracking ID</p>
                           <p className="text-sm font-black text-secondary tracking-widest uppercase italic">{order.tracking_id}</p>
                           {order.tracking_url ? (
                             <div className="pt-2 border-t border-secondary/10">
                               <p className="text-[8px] text-zinc-500 uppercase tracking-widest mb-2">
                                 Click the link below to track your package in real-time.
                               </p>
                               <a
                                 href={order.tracking_url}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="inline-flex items-center gap-2 py-2 px-4 bg-zinc-900 text-white text-[9px] font-black uppercase tracking-widest hover:bg-secondary transition-all rounded-sm"
                               >
                                 <ExternalLink size={10} /> Track Your Order
                               </a>
                             </div>
                           ) : (
                             <p className="text-[8px] text-zinc-400 uppercase tracking-widest">Tracking link will be available once your order is shipped.</p>
                           )}
                        </div>
                      )}
                    </div>
                    <div className="pt-4 flex gap-3">
                      <a 
                        href={`https://wa.me/919398324095?text=Hello, I have a question about my order #${order.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-3 bg-zinc-900 text-white text-[8px] font-black uppercase tracking-widest text-center hover:bg-secondary transition-all flex items-center justify-center gap-2"
                      >
                        Help <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
