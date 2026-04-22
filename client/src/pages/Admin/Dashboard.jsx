import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Package, 
  Tags, 
  Users, 
  TrendingUp, 
  Plus,
  ArrowUpRight,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0, // Placeholder
    revenue: 0 // Placeholder
  });
  const [loading, setLoading] = useState(true);
  const [recentProducts, setRecentProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get counts
      const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
      const { count: categoryCount } = await supabase.from('categories').select('*', { count: 'exact', head: true });
      
      // Get real orders and revenue
      const { data: allOrders } = await supabase
        .from('orders')
        .select('total_amount, status, created_at, full_name, id')
        .order('created_at', { ascending: false });

      const realOrders = allOrders || [];
      const totalOrdersCount = realOrders.length;
      
      // Calculate revenue (excluding cancelled orders)
      const totalRevenue = realOrders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

      // Get recent products
      const { data: latestProducts } = await supabase
        .from('products')
        .select('id, name, price, created_at, category')
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        products: productCount || 0,
        categories: categoryCount || 0,
        orders: totalOrdersCount,
        revenue: `₹${totalRevenue.toLocaleString()}`
      });
      setRecentProducts(latestProducts || []);
      setRecentOrders(realOrders.slice(0, 4)); // Get latest 4 orders for activity
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { name: 'Total Products', value: stats.products, icon: <Package className="text-blue-600" />, color: 'bg-blue-50' },
    { name: 'Categories', value: stats.categories, icon: <Tags className="text-purple-600" />, color: 'bg-purple-50' },
    { name: 'Total Orders', value: stats.orders, icon: <Users className="text-green-600" />, color: 'bg-green-50' },
    { name: 'Revenue', value: stats.revenue, icon: <TrendingUp className="text-orange-600" />, color: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-zinc-900 uppercase tracking-tighter">Dashboard</h1>
          <p className="text-zinc-500 text-sm uppercase tracking-widest mt-2">Welcome back to SKML Management</p>
        </div>
        <div className="flex gap-3">
          <Link 
            to="/admin/products" 
            className="flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors"
          >
            <Plus size={16} /> Add Product
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white p-8 border border-zinc-200 rounded-sm group hover:border-zinc-900 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-full ${stat.color}`}>
                {stat.icon}
              </div>
              <ArrowUpRight size={16} className="text-zinc-300 group-hover:text-zinc-900 transition-colors" />
            </div>
            <p className="text-zinc-500 text-xs uppercase tracking-[0.2em] mb-1">{stat.name}</p>
            <p className="text-3xl font-black text-zinc-900 tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Products */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-zinc-900 uppercase tracking-tight">Recently Added Products</h2>
            <Link to="/admin/products" className="text-xs text-zinc-500 hover:text-zinc-900 uppercase tracking-widest font-bold border-b border-zinc-200 pb-1">
              View All
            </Link>
          </div>
          <div className="bg-white border border-zinc-200 overflow-hidden rounded-sm">
            <table className="w-full text-left">
              <thead className="bg-zinc-50 border-b border-zinc-200">
                <tr>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-black text-zinc-500">Product</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-black text-zinc-500">Category</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-black text-zinc-500">Price</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-black text-zinc-500 text-right">Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {recentProducts.length > 0 ? (
                  recentProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-zinc-900 block">{product.name}</span>
                        <span className="text-[10px] text-zinc-400">ID: {product.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] px-2 py-1 bg-zinc-100 text-zinc-600 rounded-sm uppercase font-bold">
                          {product.category || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-zinc-900">₹{product.price}</td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-xs text-zinc-500">
                          {new Date(product.created_at).toLocaleDateString()}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-2 opacity-20">
                        <Package size={48} />
                        <p className="text-xs uppercase tracking-widest font-bold">No products found yet</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Activity */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-zinc-900 uppercase tracking-tight">Recent Activity</h2>
          <div className="bg-white border border-zinc-200 p-8 rounded-sm space-y-6 min-h-[400px]">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order.id} className="flex gap-4 group">
                  <div className="mt-1">
                    <div className={`w-2 h-2 rounded-full ring-4 ring-zinc-100 ${
                      order.status === 'delivered' ? 'bg-green-500' :
                      order.status === 'cancelled' ? 'bg-red-500' : 'bg-zinc-900'
                    }`} />
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm text-zinc-900 font-bold uppercase tracking-tight">New Order Received</p>
                    <p className="text-xs text-zinc-500 mt-1 uppercase">
                      Buyer: <span className="font-black text-zinc-900">{order.full_name}</span>
                    </p>
                    <p className="text-[10px] text-zinc-400 mt-2 flex items-center gap-1 uppercase font-black tracking-widest">
                      <Clock size={10} /> {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Status: {order.status}
                    </p>
                  </div>
                  <ArrowUpRight size={14} className="text-zinc-200 group-hover:text-zinc-900 transition-colors" />
                </div>
              ))
            ) : (
              <div className="py-20 text-center space-y-3 opacity-20">
                 <Clock size={32} className="mx-auto" />
                 <p className="text-[10px] font-black uppercase tracking-widest">No recent activity</p>
              </div>
            )}
          </div>
          
          <div className="bg-zinc-900 p-8 rounded-sm text-white space-y-4">
            <h3 className="font-bold uppercase tracking-tight">Need Support?</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-light">
              For any issues with image uploads or database connectivity, please consult the developer docs.
            </p>
            <button className="text-[10px] font-bold uppercase tracking-widest border-b border-zinc-800 pb-1 hover:text-secondary hover:border-secondary transition-all">
              Contact Developer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
