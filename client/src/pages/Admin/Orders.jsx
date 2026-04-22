import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Package, 
  Search, 
  Filter, 
  Phone, 
  MapPin, 
  ExternalLink, 
  RefreshCw, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  Truck, 
  X, 
  Check, 
  CheckCircle2,
  XCircle,
  ChevronDown 
} from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updating, setUpdating] = useState(null);
  const [activeInvoice, setActiveInvoice] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };
  
  // Management States
  const [editingOrder, setEditingOrder] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [manageMenuOpen, setManageMenuOpen] = useState(null); // stores order.id
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: '',
    pincode: '',
    tracking_id: '',
    tracking_url: '',
    status: ''
  });

  useEffect(() => {
    fetchOrders();
    const handleAfterPrint = () => setActiveInvoice(null);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => window.removeEventListener('afterprint', handleAfterPrint);
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdating(orderId);
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      showNotification('Status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      showNotification('Failed to update status', 'error');
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm('Are you sure you want to PERMANENTLY DELETE this order? This action cannot be undone.')) return;
    
    try {
      setUpdating(orderId);
      const { error: itemsError } = await supabase
        .from('order_items')
        .delete()
        .eq('order_id', orderId);
      
      if (itemsError) throw itemsError;

      const { error: orderError } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (orderError) throw orderError;
      
      setOrders(orders.filter(o => o.id !== orderId));
      setManageMenuOpen(null);
      showNotification('Order deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      showNotification('Failed to delete order', 'error');
    } finally {
      setUpdating(null);
    }
  };

  const handleEditClick = (order) => {
    setEditingOrder(order);
    setFormData({
      full_name: order.full_name || '',
      phone: order.phone || '',
      address: order.address || '',
      pincode: order.pincode || '',
      tracking_id: order.tracking_id || '',
      tracking_url: order.tracking_url || '',
      status: order.status || ''
    });
    setIsEditModalOpen(true);
    setManageMenuOpen(null);
  };

  const handleUpdateOrder = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase
        .from('orders')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          address: formData.address,
          pincode: formData.pincode,
          tracking_id: formData.tracking_id,
          tracking_url: formData.tracking_url,
          status: formData.status
        })
        .eq('id', editingOrder.id);

      if (error) throw error;
      
      fetchOrders();
      setIsEditModalOpen(false);
      showNotification('Order details updated successfully');
    } catch (error) {
      console.error('Update error:', error);
      if (error.message?.includes('column "tracking_id" does not exist')) {
        showNotification('ACTION REQUIRED: Missing tracking_id column in DB', 'error');
      } else {
        showNotification('Failed to update order details', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = (order) => {
    setActiveInvoice(order);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'shipped': return 'bg-indigo-100 text-indigo-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-zinc-100 text-zinc-700';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw size={32} className="animate-spin text-zinc-900" />
      </div>
    );
  }

  return (
    <>
      {/* Automated Notifications */}
      {notification && (
        <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] px-8 py-4 rounded-sm shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300 ${
          notification.type === 'error' ? 'bg-red-600 text-white' : 'bg-zinc-900 text-white'
        }`}>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3">
             {notification.type === 'error' ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
             {notification.message}
          </p>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .print-only { display: block !important; visibility: visible !important; }
          #invoice-root { position: absolute; left: 0; top: 0; width: 100%; z-index: 9999; }
        }
      `}} />

      <div className={`space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 no-print ${activeInvoice ? 'opacity-20 pointer-events-none' : ''}`}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-zinc-900 uppercase tracking-tighter italic">Manage Orders</h1>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <Package size={14} /> Global Order Fulfillment Center
            </p>
          </div>
          <button 
            onClick={fetchOrders}
            className="px-6 py-4 bg-zinc-100 text-zinc-900 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-xl shadow-zinc-100"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Sync Database
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative group md:col-span-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" size={16} />
            <input 
              type="text"
              placeholder="Search by ID, Name or Phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-100 p-4 pl-12 text-xs font-bold uppercase tracking-widest focus:bg-white focus:border-zinc-900 outline-none transition-all"
            />
          </div>
          <div className="relative group">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" size={16} />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-100 p-4 pl-12 text-xs font-bold uppercase tracking-widest focus:bg-white focus:border-zinc-900 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div 
                key={order.id}
                className="bg-white border border-zinc-100 rounded-sm overflow-hidden hover:shadow-2xl hover:shadow-zinc-200/50 transition-all duration-500 group relative"
              >
                <div className="absolute top-6 right-6 z-10 print:hidden">
                  <button 
                    onClick={() => setManageMenuOpen(manageMenuOpen === order.id ? null : order.id)}
                    className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-400 hover:text-zinc-900"
                  >
                    <MoreVertical size={20} />
                  </button>
                  {manageMenuOpen === order.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-zinc-100 shadow-2xl rounded-sm py-2 animate-in fade-in zoom-in-95 duration-200">
                      <button 
                        onClick={() => handleEditClick(order)}
                        className="w-full flex items-center gap-3 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                      >
                        <Edit3 size={14} /> Edit Details
                      </button>
                      <button 
                        onClick={() => handlePrint(order)}
                        className="w-full flex items-center gap-3 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                      >
                        <Package size={14} /> View Invoice
                      </button>
                      <div className="h-px bg-zinc-100 my-2 mx-2"></div>
                      <button 
                        onClick={() => handleDelete(order.id)}
                        disabled={updating === order.id}
                        className="w-full flex items-center gap-3 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={14} /> Delete Order
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-6 border-b border-zinc-50 flex flex-wrap items-center justify-between gap-4 bg-zinc-50/30">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Order Reference</p>
                    <div className="flex items-center gap-3">
                       <p className="text-sm font-black text-zinc-900 tracking-tight uppercase">#{order.id.slice(0, 8)}</p>
                       <select 
                          value={order.status}
                          disabled={updating === order.id}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className={`p-1 px-3 rounded-full text-[8px] font-black uppercase tracking-widest border border-zinc-200 cursor-pointer outline-none transition-all hover:border-zinc-900 ${getStatusColor(order.status)}`}
                       >
                         <option value="pending">Pending</option>
                         <option value="processing">Processing</option>
                         <option value="shipped">Shipped</option>
                         <option value="delivered">Delivered</option>
                         <option value="cancelled">Cancelled</option>
                       </select>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8 mr-12">
                     {order.tracking_id && (
                       <div className="text-right hidden sm:block">
                         <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">DCDT Tracking ID</p>
                         <p className="text-xs font-black text-secondary tracking-widest uppercase">{order.tracking_id}</p>
                         {order.tracking_url && (
                           <a
                             href={order.tracking_url}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="inline-flex items-center gap-1 mt-1 text-[9px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 underline"
                           >
                             <ExternalLink size={10} /> Track Package
                           </a>
                         )}
                       </div>
                     )}
                     <div className="text-right">
                       <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Total</p>
                       <p className="text-sm font-black text-zinc-900 italic tracking-tighter">₹{Number(order.total_amount).toLocaleString()}</p>
                     </div>
                  </div>
                </div>

                <div className="p-8 flex flex-col lg:flex-row gap-12">
                  <div className="flex-grow space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-zinc-400">
                          <Package size={14} className="opacity-50" />
                          <span className="text-[9px] font-black uppercase tracking-widest">Customer</span>
                        </div>
                        <p className="text-xs font-bold text-zinc-900 uppercase">{order.full_name}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-zinc-400">
                          <Phone size={14} className="opacity-50" />
                          <span className="text-[9px] font-black uppercase tracking-widest">Mobile</span>
                        </div>
                        <a href={`tel:${order.phone}`} className="text-xs font-bold text-zinc-900 hover:text-secondary transition-colors underline decoration-zinc-200">{order.phone}</a>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-zinc-400">
                          <MapPin size={14} className="opacity-50" />
                          <span className="text-[9px] font-black uppercase tracking-widest">Address</span>
                        </div>
                        <p className="text-[10px] text-zinc-500 uppercase font-medium leading-relaxed">{order.address}, {order.pincode}</p>
                        {order.tracking_id && (
                          <div className="mt-3 p-2 bg-zinc-50 border-l-2 border-secondary">
                             <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">DCDT TRACKING</p>
                             <p className="text-[10px] font-black text-secondary uppercase tracking-widest mt-0.5">{order.tracking_id}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-zinc-50/50 p-6 rounded-sm border border-zinc-100">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-zinc-200">
                            <th className="text-left py-3 text-[8px] font-black text-zinc-400 uppercase tracking-widest">Description</th>
                            <th className="text-center py-3 text-[8px] font-black text-zinc-400 uppercase tracking-widest w-20">Qty</th>
                            <th className="text-right py-3 text-[8px] font-black text-zinc-400 uppercase tracking-widest w-32">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.order_items?.map((item) => (
                            <tr key={item.id} className="border-b border-zinc-50 last:border-0">
                              <td className="py-4">
                                <p className="text-[11px] font-black text-zinc-900 uppercase tracking-tight">{item.product_name}</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {item.selected_color && <span className="px-2 py-0.5 bg-zinc-900 text-white text-[8px] font-black uppercase tracking-widest rounded-sm">{item.selected_color}</span>}
                                  {item.selected_size && <span className="px-2 py-0.5 bg-secondary text-white text-[8px] font-black uppercase tracking-widest rounded-sm">{item.selected_size}</span>}
                                  {item.selected_height && <span className="px-2 py-0.5 border border-zinc-200 text-zinc-500 text-[8px] font-black uppercase tracking-widest rounded-sm">{Number(item.selected_height)}x{Number(item.selected_width)} FT</span>}
                                </div>
                              </td>
                              <td className="py-4 text-center text-[10px] font-bold text-zinc-400">× {item.quantity}</td>
                              <td className="py-4 text-right text-[10px] font-black text-zinc-900">₹{Number(item.price_at_purchase).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="flex flex-row lg:flex-col gap-2 min-w-[140px] print:hidden">
                    <a 
                      href={`https://wa.me/91${order.phone}?text=Hello ${order.full_name}, regarding order #${order.id.slice(0, 8)}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 p-3 bg-green-50 text-green-700 rounded-sm hover:bg-green-600 hover:text-white transition-all flex items-center justify-center gap-2 text-[9px] font-bold uppercase tracking-widest"
                    >
                      WhatsApp Support
                    </a>
                    <button 
                      onClick={() => handlePrint(order)}
                      className="flex-1 p-3 bg-zinc-100 text-zinc-900 rounded-sm hover:bg-zinc-900 hover:text-white transition-all text-[9px] font-bold uppercase tracking-widest"
                    >
                      Invoice
                    </button>
                    <button 
                      onClick={() => handleEditClick(order)}
                      className="flex-1 p-3 border border-zinc-200 text-zinc-500 rounded-sm hover:bg-zinc-900 hover:text-white transition-all text-[9px] font-bold uppercase tracking-widest"
                    >
                      Quick Edit
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center bg-white border border-zinc-100 rounded-sm">
              <Package size={48} className="mx-auto text-zinc-100 mb-4" />
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">No matching orders</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 no-print">
          <div className="absolute inset-0 bg-zinc-900/80 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)}></div>
          <div className="bg-white w-full h-full md:h-auto md:max-w-xl md:rounded-sm relative z-10 shadow-2xl overflow-hidden flex flex-col max-h-screen md:max-h-[90vh]">
            <div className="p-6 md:p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
               <div>
                  <h2 className="text-lg md:text-xl font-black text-zinc-900 uppercase tracking-tighter">Edit Order Details</h2>
                  <p className="text-[9px] md:text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Ref: #{editingOrder?.id.slice(0, 8).toUpperCase()}</p>
               </div>
               <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-zinc-200 rounded-full transition-colors">
                  <X size={20} />
               </button>
            </div>
            
            <form onSubmit={handleUpdateOrder} className="p-6 md:p-8 space-y-6 overflow-y-auto bg-white flex-1">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                     <label className="text-[10px] font-black uppercase text-zinc-400">Customer Name</label>
                     <input required value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} className="w-full p-3 bg-zinc-50 border border-zinc-100 text-xs font-bold uppercase tracking-widest focus:bg-white focus:border-zinc-900 outline-none" />
                  </div>
                  <div className="space-y-1">
                     <label className="text-[10px] font-black uppercase text-zinc-400">Phone Number</label>
                     <input required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full p-3 bg-zinc-50 border border-zinc-100 text-xs font-bold uppercase tracking-widest focus:bg-white focus:border-zinc-900 outline-none" />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                     <label className="text-[10px] font-black uppercase text-zinc-400">Shipping Address</label>
                     <textarea required rows="3" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full p-3 bg-zinc-50 border border-zinc-100 text-xs font-bold uppercase tracking-widest focus:bg-white focus:border-zinc-900 outline-none resize-none" />
                  </div>
                  <div className="space-y-1">
                     <label className="text-[10px] font-black uppercase text-zinc-400">Pincode</label>
                     <input required value={formData.pincode} onChange={(e) => setFormData({...formData, pincode: e.target.value})} className="w-full p-3 bg-zinc-50 border border-zinc-100 text-xs font-bold uppercase tracking-widest focus:bg-white focus:border-zinc-900 outline-none" />
                  </div>
                  <div className="space-y-1">
                     <label className="text-[10px] font-black uppercase text-secondary">DCDT Tracking ID</label>
                     <input placeholder="DCDT TRACKING #" value={formData.tracking_id} onChange={(e) => setFormData({...formData, tracking_id: e.target.value})} className="w-full p-3 bg-secondary/5 border border-secondary/20 text-xs font-black uppercase tracking-widest focus:bg-white focus:border-secondary outline-none text-secondary" />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] font-black uppercase text-blue-600 flex items-center gap-1"><ExternalLink size={10} /> Track URL (Optional)</label>
                    <input
                      placeholder="https://dcdt.in/track/..."
                      value={formData.tracking_url}
                      onChange={(e) => setFormData({...formData, tracking_url: e.target.value})}
                      className="w-full p-3 bg-blue-50 border border-blue-100 text-xs font-medium tracking-wide focus:bg-white focus:border-blue-500 outline-none text-blue-700"
                    />
                    <p className="text-[9px] text-zinc-400 uppercase tracking-widest">Customer will see a clickable "Track Your Order" link on their My Orders page.</p>
                  </div>
                  <div className="space-y-1">
                     <label className="text-[10px] font-black uppercase text-zinc-400">Status</label>
                     <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className={`w-full p-3 text-xs font-black uppercase tracking-widest outline-none border border-zinc-100 ${getStatusColor(formData.status)}`}>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                     </select>
                  </div>
               </div>
               <div className="pt-4 flex gap-4">
                  <button type="submit" disabled={loading} className="flex-1 py-4 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-secondary transition-all shadow-xl shadow-zinc-200">Save Changes</button>
                  <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-4 bg-zinc-100 text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-200 hover:text-zinc-900 transition-all">Cancel</button>
               </div>
            </form>
          </div>
        </div>
      )}

      {/* INDEPENDENT PRINT AREA */}
      {activeInvoice && (
        <div id="invoice-root" className="hidden print-only bg-white p-10 text-black font-sans min-h-screen">
          <div className="flex justify-between items-start mb-12 border-b-2 border-black pb-8">
             <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter italic">SKML Party Store</h1>
                <p className="text-[10px] font-bold uppercase tracking-widest mt-1">Official Invoice / Receipt</p>
             </div>
             <div className="text-right">
                <p className="text-sm font-black uppercase">Order ID: #{activeInvoice.id.slice(0, 8).toUpperCase()}</p>
                <p className="text-[10px] font-bold uppercase mt-1">Date: {new Date(activeInvoice.created_at).toLocaleDateString()}</p>
             </div>
          </div>
          <div className="grid grid-cols-2 gap-12 mb-12">
             <div className="space-y-1">
                <p className="text-[8px] font-black uppercase text-zinc-400 mb-2 tracking-[0.2em]">Billed To:</p>
                <p className="text-base font-black uppercase">{activeInvoice.full_name}</p>
                <p className="text-[10px] font-medium uppercase leading-relaxed max-w-[250px]">{activeInvoice.address}, {activeInvoice.pincode}</p>
                <p className="text-[10px] font-bold mt-2">Phone: {activeInvoice.phone}</p>
             </div>
             <div className="text-right space-y-1">
                <p className="text-[8px] font-black uppercase text-zinc-400 mb-2 tracking-[0.2em]">Shipped Via:</p>
                <p className="text-base font-black uppercase text-zinc-900">DCDT Courier Service</p>
                <p className="text-[10px] font-medium uppercase text-zinc-500">Express Delivery</p>
                {activeInvoice.tracking_id && <p className="text-[10px] font-black text-secondary uppercase mt-2">Tracking: {activeInvoice.tracking_id}</p>}
             </div>
          </div>
          <table className="w-full mb-12">
             <thead className="border-b-2 border-black">
                <tr>
                   <th className="py-4 text-left text-[10px] font-black uppercase tracking-widest">Description</th>
                   <th className="py-4 text-center text-[10px] font-black uppercase w-20">Qty</th>
                   <th className="py-4 text-right text-[10px] font-black uppercase w-32">Total</th>
                </tr>
             </thead>
             <tbody>
                {activeInvoice.order_items?.map((item) => (
                  <tr key={item.id} className="border-b border-zinc-100">
                     <td className="py-6">
                        <p className="text-xs font-black uppercase tracking-tight">{item.product_name}</p>
                         <div className="flex flex-wrap gap-4 mt-3">
                            {item.selected_color && <div className="px-2 py-1 bg-zinc-100 border border-zinc-200 text-black text-[8px] font-black uppercase tracking-widest rounded-sm">Color: {item.selected_color}</div>}
                            {item.selected_size && <div className="px-2 py-1 bg-zinc-100 border border-zinc-200 text-black text-[8px] font-black uppercase tracking-widest rounded-sm">Size: {item.selected_size}</div>}
                            {item.selected_height && <div className="px-2 py-1 bg-zinc-100 border border-zinc-200 text-black text-[8px] font-black uppercase tracking-widest rounded-sm">Dim: {Number(item.selected_height)}x{Number(item.selected_width)} FT</div>}
                         </div>
                     </td>
                     <td className="py-6 text-center text-xs font-bold">{item.quantity}</td>
                     <td className="py-6 text-right text-xs font-black">₹{Number(item.price_at_purchase).toLocaleString()}</td>
                  </tr>
                ))}
             </tbody>
          </table>
          <div className="flex justify-end pt-8 border-t-2 border-black">
             <div className="w-64 space-y-4">
                <div className="flex justify-between text-[10px] font-bold uppercase text-zinc-500"><span>Subtotal</span><span>₹{Number(activeInvoice.total_amount).toLocaleString()}</span></div>
                <div className="flex justify-between text-[10px] font-bold uppercase text-zinc-500"><span>Shipping</span><span className="text-green-600 font-black">FREE</span></div>
                <div className="pt-4 border-t border-zinc-200 flex justify-between items-end"><span className="text-sm font-black uppercase tracking-tighter">Total Amount</span><span className="text-2xl font-black italic">₹{Number(activeInvoice.total_amount).toLocaleString()}</span></div>
             </div>
          </div>
          <div className="mt-32 pt-12 border-t border-zinc-100 flex justify-between items-end">
             <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-secondary">SKML Party Store</p>
                <p className="text-[8px] text-zinc-400 uppercase">Global Fulfillment Center | +91 9398324095</p>
             </div>
             <div className="text-right">
                <div className="inline-block p-4 border-2 border-black mb-2"><span className="text-xl font-black uppercase italic">SKML</span></div>
             </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminOrders;
