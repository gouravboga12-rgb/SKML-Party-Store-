import React from 'react';

const RefundPolicy = () => {
  return (
    <div className="pt-48 pb-24 min-h-screen bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-16 space-y-4 text-center">
          <h1 className="text-5xl font-black text-zinc-900 uppercase tracking-tighter italic">Refund & Cancellation</h1>
          <p className="text-zinc-400 text-xs uppercase tracking-widest">Last Updated: April 2026</p>
        </div>

        <div className="prose prose-zinc max-w-none space-y-12 text-zinc-600 leading-relaxed font-light">
          <section className="space-y-4">
            <h2 className="text-xl font-black text-zinc-900 uppercase tracking-widest">1. Cancellation Policy</h2>
            <p>
              We understand that plans can change. However, due to the nature of our products:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Orders for standard (non-custom) items can be cancelled within **12 hours** of placement for a full refund.</li>
              <li><strong>Important:</strong> Boutique fabrics and backdrops cut to specific custom dimensions (e.g., custom meters or height/width) **cannot** be cancelled once the cutting process has begun.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <div className="bg-zinc-900 p-8 rounded-sm text-white space-y-6 shadow-2xl border-l-8 border-secondary">
              <h2 className="text-2xl font-black uppercase tracking-widest italic text-secondary underline decoration-secondary/30 underline-offset-8">2. Refund Eligibility: Damage Claims</h2>
              <p className="text-zinc-300 font-medium leading-relaxed">
                Refunds are granted **EXCLUSIVELY** in the case of products received in a physically damaged condition or if the wrong item was delivered.
              </p>
              
              <div className="space-y-4 pt-4 border-t border-white/10">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">The Mandatory Unboxing Rule:</h3>
                <p className="text-zinc-400 text-xs leading-relaxed italic">
                  To protect our small business and ensure a fair resolution, a **continuous, unedited unboxing video** is strictly mandatory to claim a refund.
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-300">
                  <li className="flex items-center gap-3 bg-white/5 p-3 rounded-sm border border-white/10">
                    <span className="w-2 h-2 bg-secondary rounded-full"></span>
                    Video must start before opening the outer seal.
                  </li>
                  <li className="flex items-center gap-3 bg-white/5 p-3 rounded-sm border border-white/10">
                    <span className="w-2 h-2 bg-secondary rounded-full"></span>
                    Show the shipping label clearly.
                  </li>
                  <li className="flex items-center gap-3 bg-white/5 p-3 rounded-sm border border-white/10">
                    <span className="w-2 h-2 bg-secondary rounded-full"></span>
                    Capture the damage in one single shot.
                  </li>
                  <li className="flex items-center gap-3 bg-white/5 p-3 rounded-sm border border-white/10 text-secondary">
                    <span className="w-2 h-2 bg-secondary rounded-full"></span>
                    NO VIDEO = NO REFUND.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-zinc-900 uppercase tracking-widest">3. Manual Refund Process</h2>
            <p>
              For security and verification, all refunds are initiated manually:
            </p>
            <ol className="list-decimal pl-6 space-y-4">
              <li>
                <strong>WhatsApp Verification:</strong> Share your Order ID and the unboxing video proof with the owner on WhatsApp (**+91 9398324095**).
              </li>
              <li>
                <strong>Review:</strong> Our team will review the proof and confirm the damage within 24-48 hours.
              </li>
              <li>
                <strong>Initiation:</strong> Once verified, the refund will be initiated to your original payment account.
              </li>
              <li>
                <strong>Timeline:</strong> The refunded amount will reflect in your bank account within **5-7 working days** after initiation.
              </li>
            </ol>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-zinc-900 uppercase tracking-widest">4. Non-Refundable Items</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Items damaged due to customer mishandling during opening (e.g., using sharp knives carelessly).</li>
              <li>Products that have been used, washed, or altered.</li>
              <li>Sale or discounted items (unless damaged).</li>
            </ul>
          </section>

          <section className="space-y-4 text-center pt-12">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Quality Assured • SKML Fabric Store • Visakhapatnam</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
