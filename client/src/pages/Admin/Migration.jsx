import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { products, categories } from '../../data/products';
import { Database, AlertTriangle, CheckCircle2, Loader2, Play } from 'lucide-react';

const Migration = () => {
  const [isLocked, setIsLocked] = useState(true);
  const [passInput, setPassInput] = useState('');
  const [error, setError] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, migrating, success, error
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const handleUnlock = (e) => {
    e.preventDefault();
    if (passInput === 'Revanth@11189') {
      setIsLocked(false);
      setError(false);
    } else {
      setError(true);
      setPassInput('');
      setTimeout(() => setError(false), 2000);
    }
  };

  if (isLocked) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-full max-w-md p-10 bg-white border border-zinc-200 shadow-2xl rounded-sm space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto shadow-xl ring-8 ring-zinc-50">
              <Database size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tighter">Secure Migration</h1>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mt-2 italic">Restricted Administrator Area</p>
            </div>
          </div>

          <form onSubmit={handleUnlock} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Master Authorization Password</label>
              <input 
                type="password"
                autoFocus
                className={`w-full p-4 bg-zinc-50 border ${error ? 'border-red-500 shadow-red-50 ring-4 ring-red-50' : 'border-zinc-100'} outline-none text-center font-black tracking-[0.5em] transition-all focus:bg-white focus:border-zinc-900`}
                value={passInput}
                onChange={(e) => setPassInput(e.target.value)}
                placeholder="••••••••"
              />
              {error && <p className="text-[8px] font-black text-red-500 uppercase tracking-widest text-center mt-2 animate-bounce">Access Denied: Invalid Password</p>}
            </div>

            <button 
              type="submit"
              className="w-full py-5 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all shadow-lg active:scale-95"
            >
              Verify Identity
            </button>
          </form>

          <div className="pt-6 border-t border-zinc-100 flex items-center gap-3 justify-center">
             <AlertTriangle size={14} className="text-amber-500" />
             <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Unauthorized access is logged</p>
          </div>
        </div>
      </div>
    );
  }

  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev.slice(-9), { message, type, time: new Date().toLocaleTimeString() }]);
  };

  const startMigration = async () => {
    if (!window.confirm('This will push all local data to Supabase. Are you sure?')) return;

    setStatus('migrating');
    setLogs([]);
    addLog('Starting migration sequence...', 'info');

    try {
      // 1. Migrate Categories
      addLog(`Migrating ${categories.length} categories...`, 'info');
      setProgress({ current: 0, total: categories.length + products.length });

      for (let i = 0; i < categories.length; i++) {
        const cat = categories[i];
        const { error } = await supabase
          .from('categories')
          .upsert({
            id: cat.id,
            name: cat.name,
            description: cat.description,
            image: cat.image
          });

        if (error) throw new Error(`Category ${cat.id} failed: ${error.message}`);
        addLog(`Migrated category: ${cat.name}`, 'success');
        setProgress(prev => ({ ...prev, current: prev.current + 1 }));
      }

      // 2. Migrate Products
      addLog(`Migrating ${products.length} products...`, 'info');
      for (let i = 0; i < products.length; i++) {
        const prod = products[i];
        const { error } = await supabase
          .from('products')
          .upsert({
            name: prod.name,
            category: prod.category,
            sub_category: prod.subCategory,
            price: prod.price,
            description: prod.description,
            image: prod.image,
            images: prod.images || [],
            rating: prod.rating || 0,
            reviews_count: prod.reviewsCount || 0,
            colors: prod.colors || [],
            sizes: prod.sizes || [],
            reviews: prod.reviews || [],
            specifications: prod.specifications || {}
          });

        if (error) throw new Error(`Product ${prod.name} failed: ${error.message}`);
        addLog(`Migrated product: ${prod.name}`, 'success');
        setProgress(prev => ({ ...prev, current: prev.current + 1 }));
      }

      setStatus('success');
      addLog('Migration completed successfully!', 'success');
    } catch (error) {
      console.error('Migration error:', error);
      addLog(error.message, 'error');
      setStatus('error');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-zinc-900 p-10 rounded-sm text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-white/10 rounded-sm">
              <Database size={24} className="text-white" />
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">Data Migration</h1>
          </div>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-xl">
            This tool synchronizes your local <code className="text-white">products.js</code> data with the Supabase database. 
            Use this to initialize your database without losing existing information.
          </p>
        </div>
        <div className="absolute top-0 right-0 p-10 opacity-5">
           <Database size={150} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Control Panel */}
        <div className="bg-white border border-zinc-200 p-8 rounded-sm space-y-6">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Migration Status</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-xs font-bold uppercase text-zinc-400">Total Progress</span>
              <span className="text-2xl font-black text-zinc-900">
                {progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0}%
              </span>
            </div>
            <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-zinc-900 transition-all duration-500" 
                style={{ width: `${progress.total > 0 ? (progress.current / progress.total) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={startMigration}
              disabled={status === 'migrating'}
              className={`w-full py-4 px-6 flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest transition-all ${
                status === 'migrating' 
                  ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                  : 'bg-zinc-900 text-white hover:bg-zinc-800'
              }`}
            >
              {status === 'migrating' ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Migrating...
                </>
              ) : (
                <>
                  <Play size={16} /> Run Migration Sequence
                </>
              )}
            </button>
          </div>

          {status === 'success' && (
            <div className="p-4 bg-green-50 border border-green-100 rounded-sm flex items-start gap-3">
              <CheckCircle2 size={18} className="text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-green-900 uppercase tracking-tight">Success</p>
                <p className="text-xs text-green-700 mt-1">Database is now in sync with local data.</p>
              </div>
            </div>
          )}
        </div>

        {/* Logs */}
        <div className="bg-zinc-50 border border-zinc-200 p-8 rounded-sm font-mono text-[10px]">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-6 font-sans">Execution Logs</h2>
          <div className="space-y-3">
            {logs.length > 0 ? (
              logs.map((log, i) => (
                <div key={i} className={`flex gap-3 ${
                  log.type === 'error' ? 'text-red-500' : 
                  log.type === 'success' ? 'text-green-600' : 'text-zinc-500'
                }`}>
                  <span className="opacity-30">[{log.time}]</span>
                  <span>{log.message}</span>
                </div>
              ))
            ) : (
              <div className="text-zinc-300 italic py-10 text-center">
                Waiting for execution...
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 bg-amber-50 border border-amber-100 rounded-sm flex gap-4">
        <AlertTriangle size={20} className="text-amber-600 shrink-0" />
        <p className="text-xs text-amber-800 leading-relaxed font-medium uppercase tracking-tight">
          Warning: This process uses <code className="bg-amber-100 px-1 rounded">upsert</code>. If a product with the same name exists, it will be updated. Ensure your <code className="bg-amber-100 px-1 rounded">products.js</code> has unique names/IDs to prevent duplicates.
        </p>
      </div>
    </div>
  );
};

export default Migration;
