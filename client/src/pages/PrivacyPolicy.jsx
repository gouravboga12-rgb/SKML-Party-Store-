import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="pt-48 pb-24 min-h-screen bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-16 space-y-4 text-center">
          <h1 className="text-5xl font-black text-zinc-900 uppercase tracking-tighter italic">Privacy Policy</h1>
          <p className="text-zinc-400 text-xs uppercase tracking-widest">Last Updated: April 2026</p>
        </div>

        <div className="prose prose-zinc max-w-none space-y-12 text-zinc-600 leading-relaxed font-light">
          <section className="space-y-4">
            <h2 className="text-xl font-black text-zinc-900 uppercase tracking-widest">1. Information We Collect</h2>
            <p>
              At SKML Fabric Store, we collect information that is necessary for processing your orders and providing a personalized shopping experience. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Personal identifiers (Name, Email, Phone Number)</li>
              <li>Delivery information (Shipping Address, Pincode)</li>
              <li>Transaction details (Order history, payment status)</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-zinc-900 uppercase tracking-widest">2. How We Use Your Data</h2>
            <p>
              Your data is used strictly for business operations, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Processing and shipping your boutique fabric orders.</li>
              <li>Communicating order updates via SMS or Email.</li>
              <li>Providing customer support and responding to inquiries.</li>
              <li>Preventing fraudulent transactions.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-zinc-900 uppercase tracking-widest">3. Third-Party Sharing</h2>
            <p>
              We do not sell your personal information. However, we share necessary data with trusted partners to fulfill your orders:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Razorpay:</strong> To process secure payments (we do not store your card or bank details).</li>
              <li><strong>DTDC Courier:</strong> To deliver your products to your doorstep.</li>
              <li><strong>Supabase:</strong> For secure database management and authentication.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-zinc-900 uppercase tracking-widest">4. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your data. All payment transactions are encrypted using SSL technology through our payment gateway provider, Razorpay.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-zinc-900 uppercase tracking-widest">5. Contact Us</h2>
            <p>
              If you have any questions regarding this Privacy Policy, you may contact us at:
            </p>
            <p className="font-bold text-zinc-900 uppercase tracking-wider text-sm">
              Email: inmypartystore@gmail.com<br />
              Phone: +91 9398324095
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
