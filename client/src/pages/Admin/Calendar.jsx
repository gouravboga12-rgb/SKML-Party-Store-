import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  User,
  ShoppingBag,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const AdminCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [currentDate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Get first and last day of current month
      const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
      const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString();

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', start)
        .lte('created_at', end)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Calendar fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  // Group orders by day
  const ordersByDay = orders.reduce((acc, order) => {
    const day = new Date(order.created_at).getDate();
    if (!acc[day]) acc[day] = [];
    acc[day].push(order);
    return acc;
  }, {});

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-green-500';
      case 'shipped': return 'bg-blue-500';
      case 'processing': return 'bg-orange-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-zinc-400';
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-zinc-900">Order Calendar</h1>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mt-2">Event & Delivery Timeline</p>
        </div>
        
        <div className="flex items-center bg-white border border-zinc-200 rounded-sm overflow-hidden shadow-sm">
          <button onClick={prevMonth} className="p-3 hover:bg-zinc-50 transition-colors border-r border-zinc-100">
            <ChevronLeft size={20} />
          </button>
          <div className="px-8 flex items-center gap-3">
            <CalendarIcon size={16} className="text-zinc-400" />
            <span className="text-[11px] font-black uppercase tracking-widest text-zinc-900 w-32 text-center">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
          </div>
          <button onClick={nextMonth} className="p-3 hover:bg-zinc-50 transition-colors border-l border-zinc-100">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Calendar Grid */}
        <div className="lg:col-span-3 bg-white border border-zinc-200 shadow-sm rounded-sm overflow-hidden">
          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b border-zinc-100 bg-zinc-50">
            {days.map(day => (
              <div key={day} className="py-4 text-center text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Body */}
          <div className="grid grid-cols-7">
            {/* Blank spaces for first week */}
            {[...Array(firstDay)].map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square border-b border-r border-zinc-100 bg-zinc-50/30" />
            ))}

            {/* Days of the month */}
            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1;
              const dayOrders = ordersByDay[day] || [];
              const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

              return (
                <div 
                  key={day} 
                  className={`aspect-square border-b border-r border-zinc-100 p-2 transition-all hover:bg-zinc-50 cursor-pointer relative group ${isToday ? 'bg-zinc-50/50' : ''}`}
                  onClick={() => dayOrders.length > 0 && setSelectedOrder(dayOrders[0])}
                >
                  <span className={`text-[10px] font-bold ${isToday ? 'bg-zinc-900 text-white w-6 h-6 rounded-full flex items-center justify-center' : 'text-zinc-400'}`}>
                    {day}
                  </span>
                  
                  <div className="mt-1 space-y-1">
                    {dayOrders.slice(0, 3).map((order, idx) => (
                      <div 
                        key={order.id} 
                        className={`h-1.5 rounded-full ${getStatusColor(order.status)} opacity-80`}
                        title={`Order #${order.id.slice(0, 8)}`}
                      />
                    ))}
                    {dayOrders.length > 3 && (
                      <div className="text-[7px] font-black text-zinc-400 uppercase tracking-tighter">
                        +{dayOrders.length - 3} More
                      </div>
                    )}
                  </div>

                  {dayOrders.length > 0 && (
                    <div className="absolute inset-0 bg-zinc-900/0 group-hover:bg-zinc-900/5 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <ShoppingBag size={14} className="text-zinc-900" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white border border-zinc-200 p-6 rounded-sm shadow-sm space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900 border-b border-zinc-100 pb-4">
              Status Legend
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Delivered', color: 'bg-green-500' },
                { label: 'Shipped', color: 'bg-blue-500' },
                { label: 'Processing', color: 'bg-orange-500' },
                { label: 'Cancelled', color: 'bg-red-50' },
                { label: 'Others', color: 'bg-zinc-400' }
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${item.color}`} />
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900 text-white p-8 rounded-sm shadow-xl space-y-6">
            <Clock size={24} className="text-zinc-500" />
            <div>
              <h3 className="text-lg font-black uppercase tracking-tighter">Month Summary</h3>
              <p className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em] mt-1">Key Performance Indicators</p>
            </div>
            
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex justify-between items-end">
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Total Orders</span>
                <span className="text-xl font-black">{orders.length}</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Delivered</span>
                <span className="text-xl font-black text-green-500">{orders.filter(o => o.status?.toLowerCase() === 'delivered').length}</span>
              </div>
              <div className="flex justify-between items-end text-orange-500">
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Pending</span>
                <span className="text-xl font-black">{orders.filter(o => o.status?.toLowerCase() === 'processing').length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Day/Order Modal (Simple View) */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-white w-full max-w-lg shadow-2xl rounded-sm overflow-hidden animate-in fade-in zoom-in duration-300">
             <div className="p-8 border-b border-zinc-100 bg-zinc-50 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Order Detail</h2>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">Reference: #{selectedOrder.id.slice(0, 8)}</p>
                </div>
                <div className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest text-white ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </div>
             </div>
             
             <div className="p-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-zinc-100 flex items-center justify-center rounded-full shrink-0"><User size={18} className="text-zinc-400" /></div>
                  <div>
                    <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">Customer Name</p>
                    <p className="text-sm font-black uppercase">{selectedOrder.full_name || 'Anonymous User'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-zinc-100 flex items-center justify-center rounded-full shrink-0"><MapPin size={18} className="text-zinc-400" /></div>
                  <div>
                    <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">Delivery Address</p>
                    <p className="text-xs font-medium text-zinc-600 leading-relaxed uppercase">{selectedOrder.address}, {selectedOrder.city}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-zinc-100 flex items-center justify-center rounded-full shrink-0"><ShoppingBag size={18} className="text-zinc-400" /></div>
                  <div>
                    <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">Order Value</p>
                    <p className="text-xl font-black">₹{selectedOrder.total_amount}</p>
                  </div>
                </div>
             </div>

             <div className="p-8 bg-zinc-50 border-t border-zinc-100 flex justify-end">
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="px-10 py-4 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all"
                >
                  Close View
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCalendar;
