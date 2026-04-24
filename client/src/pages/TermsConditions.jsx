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
          <section className="space-y-4">
            <h2 className="text-xl font-black text-zinc-900 uppercase tracking-widest">1. Introduction</h2>
            <p>
              By accessing and placing an order with **SKML Fabric Store**, you confirm that you are in agreement with and bound by the terms of service contained in the Terms & Conditions outlined below. These terms apply to the entire website and any email or other type of communication between you and SKML Fabric Store.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-zinc-900 uppercase tracking-widest">2. Products & Accuracy</h2>
            <p>
              We specialize in premium boutique fabrics and event backdrops. We aim for 100% accuracy in our product descriptions and photography. However:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Fabric colors may vary slightly due to digital screen settings and lighting.</li>
              <li>Dimensions for custom-cut fabrics are subject to a minor tolerance of +/- 1-2 cm.</li>
              <li>Product availability is subject to change without notice. If an item becomes unavailable after an order is placed, we will notify you for a replacement or refund.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-zinc-900 uppercase tracking-widest">3. Order & Payment</h2>
            <p>
              All orders are processed in Indian Rupees (INR). Payments must be made in full through our integrated payment partner, **Razorpay**, before an order is dispatched. 
            </p>
            <p>
              We reserve the right to cancel orders that appear to be fraudulent or provide incomplete shipping/contact information.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-zinc-900 uppercase tracking-widest">4. Shipping Policy</h2>
            <p>
              We prioritize fast delivery to ensure your celebrations are never delayed:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Local Delivery (Visakhapatnam):</strong> Orders are dispatched via **Rapido or Uber** for same-day delivery (typically 2-6 hours).</li>
              <li><strong>National Shipping:</strong> Orders are shipped via **DTDC** and usually arrive within 3-7 business days depending on the location.</li>
              <li>Shipping charges are calculated based on weight and distance at the time of checkout.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-zinc-900 uppercase tracking-widest">5. User Conduct</h2>
            <p>
              Users are prohibited from using the website for any unlawful purpose, misrepresenting their identity, or attempting to compromise the security of the platform. All content on this site, including images of our boutique fabrics, is the intellectual property of SKML Fabric Store.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-zinc-900 uppercase tracking-widest">6. Modifications</h2>
            <p>
              SKML Fabric Store reserves the right to modify these terms at any time. Your continued use of the site after any changes constitutes your acceptance of the new Terms & Conditions.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-zinc-900 uppercase tracking-widest">7. Governing Law</h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of India. Any disputes will be handled exclusively by the courts in **Visakhapatnam, Andhra Pradesh**.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
