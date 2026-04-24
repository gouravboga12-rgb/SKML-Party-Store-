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
              Orders for standard stock items can be cancelled within **12 hours** of placement for a full refund. 
            </p>
            <p className="font-bold text-zinc-900">
              Note: Custom-cut boutique fabrics and backdrops with specific dimensions cannot be cancelled once the fabric has been cut.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-zinc-900 uppercase tracking-widest">2. Return & Exchange Policy</h2>
            <p>
              We want you to be delighted with your purchase. You may request a return or exchange within **7 days** of delivery under the following conditions:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The fabric must be uncut, unused, and in its original packaging.</li>
              <li>Returns are only accepted for manufacturing defects or if the wrong product was shipped.</li>
              <li>Change of mind returns are not accepted for cut-to-order fabrics.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-zinc-900 uppercase tracking-widest">3. Refund Process</h2>
            <p>
              Once your return is received and inspected, we will notify you of the approval or rejection of your refund. 
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>If approved, your refund will be processed to your original method of payment (via Razorpay).</li>
              <li>Refunds typically take **5-7 business days** to reflect in your account.</li>
              <li>Shipping costs are non-refundable unless the return is due to our error.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-zinc-900 uppercase tracking-widest">4. Damaged Goods</h2>
            <p>
              If you receive a damaged package, please take photos/videos of the damage before opening and contact us immediately at **+91 9398324095**. We will work with the courier partner to resolve the issue and replace your item.
            </p>
          </section>

          <section className="space-y-4 text-center pt-8">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Thank you for choosing SKML Fabric Store</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
