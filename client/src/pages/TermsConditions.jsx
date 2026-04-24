import React from 'react';

const TermsConditions = () => {
  return (
    <div className="pt-48 pb-24 min-h-screen bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-16 space-y-4 text-center">
          <h1 className="text-5xl font-black text-zinc-900 uppercase tracking-tighter italic">Terms & Conditions</h1>
          <p className="text-zinc-400 text-xs uppercase tracking-widest">Last Updated: April 2026</p>
        </div>

        <div className="prose prose-zinc max-w-none space-y-12 text-zinc-600 leading-relaxed font-light">
          <p className="italic">
            Welcome to SKML Fabric Store. By accessing our website and purchasing our premium backdrops and boutique fabrics, you agree to comply with and be bound by the following terms and conditions.
          </p>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-zinc-900 uppercase tracking-widest">1. Products & Pricing</h2>
            <p>
              We strive to display our boutique fabrics and backdrop colors as accurately as possible. However, actual colors may vary slightly depending on your screen settings. 
            </p>
            <p>
              All prices are listed in Indian Rupees (INR) and are subject to change without prior notice. The price at the time of your order is final.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-zinc-900 uppercase tracking-widest">2. Order Acceptance</h2>
            <p>
              We reserve the right to refuse or cancel any order for reasons including product unavailability, errors in pricing or product information, or suspicion of fraudulent activity.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-zinc-900 uppercase tracking-widest">3. Custom Orders & Dimensions</h2>
            <p>
              For products sold with custom dimensions (per meter or custom height/width), customers are responsible for providing accurate measurements. Once a fabric is cut to your specific dimensions, the order cannot be cancelled or modified.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-zinc-900 uppercase tracking-widest">4. Shipping & Delivery</h2>
            <p>
              Delivery times are estimates and not guarantees. We ship via DTDC Courier. While we aim to process all orders within 24-48 hours, we are not responsible for delays caused by shipping partners or unforeseen circumstances.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-zinc-900 uppercase tracking-widest">5. Limitation of Liability</h2>
            <p>
              SKML Fabric Store shall not be liable for any direct, indirect, or incidental damages resulting from the use or inability to use our products or website.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-zinc-900 uppercase tracking-widest">6. Governing Law</h2>
            <p>
              These terms are governed by the laws of India. Any disputes arising from the use of this website shall be subject to the exclusive jurisdiction of the courts in Andhra Pradesh, India.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
