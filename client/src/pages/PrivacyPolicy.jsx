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
            <h2 className="text-xl font-black text-zinc-900 uppercase tracking-widest">1. Information Collection</h2>
            <p>
              SKML Fabric Store ("we", "us", "our") is committed to protecting your privacy. We collect personal information when you visit our site, register an account, or place an order for our boutique fabrics and backdrops. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Personal Identification:</strong> Name, email address, and phone number.</li>
              <li><strong>Shipping Details:</strong> Delivery address, city (Visakhapatnam or others), and pincode.</li>
              <li><strong>Usage Data:</strong> IP address, browser type, and interaction with our products.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-zinc-900 uppercase tracking-widest">2. Use of Information</h2>
            <p>
              The information we collect is used solely to enhance your shopping experience and fulfill our business obligations:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To process and deliver your orders via our shipping partners (DTDC, Rapido, or Uber).</li>
              <li>To send order confirmations and shipping updates via SMS or Email.</li>
              <li>To manage your account and provide personalized customer support.</li>
              <li>To improve our website functionality and boutique collection based on user feedback.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-zinc-900 uppercase tracking-widest">3. Payment Security & Data Sharing</h2>
            <p>
              We prioritize the security of your financial data. We do not store your credit card or bank details on our servers. 
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Payment Processing:</strong> All payments are processed securely through **Razorpay**, an industry-leading payment gateway.</li>
              <li><strong>Logistics Partners:</strong> We share your name, address, and phone number with **DTDC**, **Rapido**, or **Uber** for the sole purpose of delivering your order.</li>
              <li><strong>Legal Compliance:</strong> We may disclose information if required by law to protect our rights or comply with legal proceedings.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-zinc-900 uppercase tracking-widest">4. Cookies and Tracking</h2>
            <p>
              Our website uses cookies to maintain your shopping cart state and provide a seamless login experience. You can choose to disable cookies through your browser settings, though some features of the site (like the "Cart") may not function correctly.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-zinc-900 uppercase tracking-widest">5. Data Retention</h2>
            <p>
              We retain your order information for our internal records as required for tax and accounting purposes. You may request the deletion of your account at any time by contacting our support team.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-zinc-900 uppercase tracking-widest">6. Contact Information</h2>
            <p>
              For any privacy-related concerns or data requests, please contact us:
            </p>
            <p className="font-bold text-zinc-900 uppercase tracking-wider text-sm">
              SKML Fabric Store<br />
              Email: inmypartystore@gmail.com<br />
              WhatsApp/Phone: +91 9398324095<br />
              Address: Visakhapatnam, Andhra Pradesh, India.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
