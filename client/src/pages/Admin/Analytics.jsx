import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  PieChart,
  BarChart3,
  Calendar,
  Layers
} from 'lucide-react';

const AdminAnalytics = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    orderCount: 0,
    customerCount: 0,
    avgOrderValue: 0,
    growth: 12.5,
    topCategories: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [ordersRes, usersRes, productsRes] = await Promise.all([
        supabase.from('orders').select('total_amount, created_at, id'),
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('products').select('category, name, price')
      ]);

      const orders = ordersRes.data || [];
      const totalSales = orders.reduce((acc, o) => acc + (parseFloat(o.total_amount) || 0), 0);
      
      // Group by category (Top Categories Simulation)
      const categories = productsRes.data?.reduce((acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
      }, {});

      setStats({
        totalSales,
        orderCount: orders.length,
        customerCount: usersRes.count || 0,
        avgOrderValue: orders.length > 0 ? (totalSales / orders.length).toFixed(0) : 0,
        growth: 15.4,
        topCategories: Object.entries(categories || {}).map(([name, count]) => ({ name, count })).sort((a,b) => b.count - a.count).slice(0, 5)
      });
    } catch (err) {
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, trend, subValue }) => (
    <div className="bg-white p-8 border border-zinc-200 rounded-sm shadow-sm space-y-4 hover:shadow-md transition-all group">
      <div className="flex items-center justify-between">
        <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${trend > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {trend > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {Math.abs(trend)}%
        </div>
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-2">{title}</p>
        <h3 className="text-3xl font-black uppercase tracking-tighter text-zinc-900">{value}</h3>
        {subValue && <p className="text-[9px] font-bold text-zinc-500 mt-2 uppercase tracking-widest italic">{subValue}</p>}
      </div>
    </div>
  );

  return (
    <div className="space-y-12 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tighter text-zinc-900">Market Intelligence</h1>
        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mt-2">Real-time Performance & Insights</p>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard 
          title="Total Revenue" 
          value={`₹${stats.totalSales.toLocaleString()}`} 
          icon={<DollarSign size={24} />} 
          trend={12.4}
          subValue="Gross income this period"
        />
        <StatCard 
          title="Total Orders" 
          value={stats.orderCount} 
          icon={<ShoppingBag size={24} />} 
          trend={8.2}
          subValue="Successful completions"
        />
        <StatCard 
          title="Avg. Order Value" 
          value={`₹${stats.avgOrderValue}`} 
          icon={<TrendingUp size={24} />} 
          trend={-2.1}
          subValue="Revenue per customer"
        />
        <StatCard 
          title="Active Users" 
          value={stats.customerCount} 
          icon={<Users size={24} />} 
          trend={15.4}
          subValue="Registered accounts"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Sales Performance Chart (CSS Simulation) */}
        <div className="lg:col-span-2 bg-white p-10 border border-zinc-200 rounded-sm shadow-sm space-y-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-zinc-900 rounded-sm text-white"><BarChart3 size={20} /></div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-tighter">Sales Performance</h3>
                <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mt-1">Monthly Revenue Comparison</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-zinc-100 text-[9px] font-black uppercase tracking-widest rounded-sm hover:bg-zinc-200 transition-all">Monthly</button>
              <button className="px-4 py-2 bg-zinc-900 text-white text-[9px] font-black uppercase tracking-widest rounded-sm shadow-xl">Yearly</button>
            </div>
          </div>

          <div className="h-64 flex items-end justify-between gap-4 pt-10">
            {[65, 45, 80, 55, 90, 75, 85, 60, 40, 95, 70, 100].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                <div 
                  className="w-full bg-zinc-100 rounded-t-sm group-hover:bg-zinc-900 transition-all relative cursor-pointer"
                  style={{ height: `${h}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[8px] font-black px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-all">
                    {h}%
                  </div>
                </div>
                <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Categories Mix */}
        <div className="bg-zinc-900 text-white p-10 rounded-sm shadow-2xl space-y-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-sm text-white"><PieChart size={20} /></div>
            <div>
              <h3 className="text-lg font-black uppercase tracking-tighter">Product Mix</h3>
              <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mt-1">Inventory Distribution</p>
            </div>
          </div>

          <div className="space-y-6">
            {stats.topCategories.map((cat, i) => (
              <div key={cat.name} className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span>{cat.name || 'Uncategorized'}</span>
                  <span>{cat.count} Units</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                   <div 
                    className="h-full bg-white transition-all duration-1000 ease-out" 
                    style={{ width: `${(cat.count / stats.topCategories[0].count) * 100}%` }}
                   />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-10 border-t border-white/10 space-y-6">
            <div className="flex items-start gap-4">
              <Layers size={16} className="text-zinc-500" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest">Global Reach</p>
                <p className="text-[8px] text-zinc-500 uppercase mt-1 leading-relaxed">Your store is currently serving customers across 24 cities in India.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Calendar size={16} className="text-zinc-500" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest">Busiest Day</p>
                <p className="text-sm font-black uppercase mt-1">Saturday</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
