import React from 'react';

const RefundPolicy = () => {
  return (
    <div className="pt-48 pb-24 min-h-screen bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-16 space-y-4 text-center">
          <h1 className="text-5xl font-black text-zinc-900 uppercase tracking-tighter italic">Refund Policy</h1>
          <p className="text-zinc-400 text-xs uppercase tracking-widest">Last Updated: April 2026</p>
        </div>

        <div className="prose prose-zinc max-w-none space-y-12 text-zinc-600 leading-relaxed font-light">
          <section className="space-y-4">
            <h2 className="text-xl font-black text-zinc-900 uppercase tracking-widest">1. Eligibility for Refund</h2>
            <p>
              At SKML Fabric Store, we ensure all products are quality-checked before dispatch. Refunds are issued **exclusively** in the following case:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The product is received in a physically damaged condition.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <div className="bg-zinc-900 p-8 rounded-sm text-white space-y-4 shadow-2xl">
              <h2 className="text-xl font-black uppercase tracking-widest italic text-secondary">Mandatory: Unboxing Video Proof</h2>
              <p className="text-zinc-300 font-medium leading-relaxed">
                To protect against fraudulent claims and ensure transparency, we require a **continuous, unedited unboxing video** as proof of damage.
              </p>
              <div className="space-y-2 pt-2 border-t border-white/10">
                <p className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full"></span>
                  The video must show the package seal being broken.
                </p>
                <p className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full"></span>
                  The damage must be clearly visible in the video.
                </p>
                <p className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-secondary">
                  No refund claims will be entertained without a valid unboxing video.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-zinc-900 uppercase tracking-widest">2. Refund Process & Timeline</h2>
            <p>
              Once your unboxing video is shared and the damage is verified by our team:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The refund will be initiated directly to your original payment method (via Razorpay).</li>
              <li>The refunded amount will reflect in your bank account within **5-7 working days**.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-zinc-900 uppercase tracking-widest">3. Custom Orders</h2>
            <p>
              Please note that boutique fabrics cut to specific custom dimensions are not eligible for returns or cancellations unless they arrive damaged (verified by unboxing video).
            </p>
          </section>

          <section className="space-y-4 text-center pt-12">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Integrity & Quality • SKML Fabric Store</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
