import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Truck, ShieldCheck, Clock, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/UI/ProductCard';
import SEO from '../components/SEO/SEO';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          // Only select essential columns for speed
          supabase.from('products').select('id, name, price, image, discount_pct, price_type, stock_status, category, lead_time, price_unit').limit(8).order('created_at', { ascending: false }),
          supabase.from('categories').select('id, name, image, description').limit(4)
        ]);

        if (prodRes.data) setProducts(prodRes.data);
        if (catRes.data) setCategories(catRes.data);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const featuredProducts = products.slice(0, 4);

  return (
    <div className="bg-white transition-colors duration-1000">
      <SEO 
        title="Premium Boutique Fabrics & Event Backdrops"
        description="Experience luxury with SKML Fabric Store. We provide high-quality boutique fabrics and exquisite event backdrops in Visakhapatnam. Shop velvet, cotton, and party decor materials online."
        keywords="fabric store vizag, boutique fabrics visakhapatnam, event backdrops india, party decor fabrics, skml fabric store, velvet cloth online"
      />
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero_premium.png" 
            alt="Premium Party Decor" 
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2000&auto=format&fit=crop';
            }}
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        <div className="container mx-auto px-4 z-10 text-center space-y-8" data-aos="fade-up">
          <div className="inline-block px-4 py-2 border border-secondary/30 rounded-full mb-4">
            <span className="text-secondary text-xs uppercase tracking-[0.3em] font-medium">Est. 2026 | S K M L Finest</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-tight max-w-5xl mx-auto drop-shadow-2xl">
            SKML Fabric Store
          </h1>
          <p className="max-w-xl mx-auto text-white/90 text-lg font-light tracking-wide drop-shadow-lg">
            Elevate your events with premium backdrops and exquisite boutique fabrics. Seamlessly designed, gracefully delivered.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link 
              to="/shop" 
              className="px-10 py-4 bg-white text-zinc-900 font-bold uppercase tracking-widest text-xs hover:bg-secondary hover:text-white transition-all w-full sm:w-auto"
            >
              Shop Collection
            </Link>
            <a 
              href="https://wa.me/919398324095" 
              className="px-10 py-4 border border-white text-white font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-zinc-900 transition-all w-full sm:w-auto"
            >
              Consult Now
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-20">
          <div className="w-px h-12 bg-white mx-auto"></div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-24 bg-white relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6" data-aos="fade-right">
            <div>
              <span className="text-secondary text-xs uppercase tracking-[0.3em] mb-4 block">Collections</span>
              <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 uppercase tracking-tight">Browse Categories</h2>
            </div>
            <Link to="/shop" className="group flex items-center gap-2 text-zinc-900 text-xs uppercase tracking-widest border-b border-transparent hover:border-zinc-900 transition-all pb-2">
              View All Products <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {loading ? (
              [1,2,3,4].map(i => (
                <div key={i} className="h-[350px] sm:h-[450px] lg:h-[500px] bg-zinc-100 animate-pulse rounded-sm relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
                </div>
              ))
            ) : (
              categories.map((cat, idx) => (
                <div 
                  key={cat.id} 
                  className="group relative h-[350px] sm:h-[450px] lg:h-[500px] overflow-hidden rounded-sm"
                  data-aos="fade-up"
                  data-aos-duration="600"
                >
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1000&auto=format&fit=crop';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-8 w-full transform transition-transform duration-500">
                    <h3 className="text-2xl font-bold text-white uppercase tracking-tight mb-2">{cat.name}</h3>
                    <p className="text-gray-400 text-sm mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 whitespace-pre-wrap">
                      {cat.description}
                    </p>
                    <Link 
                      to={`/shop?category=${cat.id}`} 
                      className="inline-block py-3 px-6 bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-secondary transition-colors"
                    >
                      Explore
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16" data-aos="fade-up">
            <span className="text-secondary text-xs uppercase tracking-[0.3em] mb-4 block">Handpicked</span>
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 uppercase tracking-tight">Featured Arrivals</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {loading ? (
              [1,2,3,4].map(i => (
                <div key={i} className="space-y-4">
                  <div className="aspect-[3/4] bg-zinc-100 animate-pulse rounded-sm relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-zinc-100 rounded-sm w-3/4 animate-pulse" />
                    <div className="h-3 bg-zinc-100 rounded-sm w-1/2 animate-pulse" />
                  </div>
                </div>
              ))
            ) : (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>

          <div className="mt-16 text-center" data-aos="fade-up">
            <Link 
              to="/shop" 
              className="inline-block py-4 px-12 border border-zinc-200 text-zinc-900 text-xs uppercase tracking-[0.2em] font-bold hover:bg-zinc-900 hover:text-white transition-all"
            >
              See Full Catalog
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white overflow-hidden relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative" data-aos="fade-right">
              <div className="aspect-square bg-zinc-200 rounded-sm overflow-hidden p-2">
                <img 
                  src="/images/story_fabrics.png" 
                  alt="Quality Fabrics" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-zinc-900 p-10 hidden md:block shadow-2xl">
                <p className="text-white font-black text-6xl leading-none">15+</p>
                <p className="text-zinc-400 text-xs uppercase tracking-widest mt-2">Years of Excellence</p>
              </div>
            </div>

            <div className="space-y-8" data-aos="fade-left">
              <span className="text-secondary text-xs uppercase tracking-[0.3em]">Our Story</span>
              <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 uppercase tracking-tight leading-tight">
                SKML Fabric Store: Crafting Elegance for Every Celebration.
              </h2>
              <p className="text-zinc-600 text-lg font-light leading-relaxed">
                We provide high-quality event backdrops and stylish boutique fabrics. 
                We serve both retail and wholesale customers, ensuring every occasion is met with premium quality 
                and sophistication. Our vision is to become the trusted destination for event decorators and fashion creators.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                {[
                  "Quality Assurance",
                  "Fast DTDC Delivery",
                  "Retail & Wholesale",
                  "Expert Consultation",
                  "Trendsetting Designs",
                  "Reliable Service"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-zinc-900" />
                    <span className="text-zinc-600 text-sm tracking-widest uppercase">{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-8">
                <Link to="/#contact" className="px-10 py-4 bg-zinc-900 text-white font-bold uppercase tracking-widest text-xs hover:bg-secondary hover:text-white transition-all">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-white border-y border-stone-100 shadow-inner">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center space-y-4" data-aos="fade-up">
              <div className="h-16 w-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6 text-zinc-900">
                <Truck size={32} />
              </div>
              <h3 className="text-zinc-900 font-bold uppercase tracking-widest">DTDC Shipping</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Fast and reliable online delivery handled by our trusted partner DTDC courier.
              </p>
            </div>
            <div className="text-center space-y-4" data-aos="fade-up" data-aos-delay="100">
              <div className="h-16 w-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6 text-zinc-900">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-zinc-900 font-bold uppercase tracking-widest">Secure Payments</h3>
              <h4 className="text-zinc-400 text-xs uppercase tracking-widest font-bold">Via Razorpay</h4>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Experience seamless and encrypted transactions through the Razorpay gateway.
              </p>
            </div>
            <div className="text-center space-y-4" data-aos="fade-up" data-aos-delay="200">
              <div className="h-16 w-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6 text-zinc-900">
                <Clock size={32} />
              </div>
              <h3 className="text-zinc-900 font-bold uppercase tracking-widest">24/7 Support</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Reach us anytime via WhatsApp for queries, wholesale pricing, or order status.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Contact Section Placeholder */}
      <section id="contact" className="py-24 bg-zinc-50">
        <div className="container mx-auto px-4 text-center space-y-8" data-aos="fade-up">
           <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 uppercase tracking-tight">Visit Our Store</h2>
           <p className="text-zinc-600 max-w-2xl mx-auto font-light">
             Located in the heart of the textile hub, we welcome you to experience our fabrics firsthand. 
             For online orders, our premium DTDC delivery ensures your purchase reaches you safely.
           </p>
           <div className="pt-8">
              <div className="inline-flex flex-col md:flex-row gap-12 text-left">
                <div className="space-y-4">
                  <p className="text-secondary text-xs uppercase tracking-widest font-bold">Store Hours</p>
                  <p className="text-zinc-900 text-sm">Mon - Sat: 10:00 AM - 9:00 PM</p>
                  <p className="text-zinc-900 text-sm">Sun: Closed</p>
                </div>
                <div className="space-y-4">
                  <p className="text-secondary text-xs uppercase tracking-widest font-bold">Location</p>
                  <p className="text-zinc-900 text-sm">Doddi Ramarao (Owner)</p>
                  <p className="text-zinc-900 text-sm">SKML Fabric Store</p>
                  <p className="text-zinc-900 text-sm">Andhra Pradesh, India</p>
                </div>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
