import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, image, url }) => {
  const siteName = "SKML Fabric Store";
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const siteUrl = "https://skml-fabric-store.vercel.app/"; // Update with custom domain later
  const defaultDescription = "Premium boutique fabrics and event backdrops in Visakhapatnam. Shop high-quality velvet, cotton, and party decoration materials online.";

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || "fabric store, boutique fabrics, visakhapatnam, event backdrops, party decor, velvet cloth, cotton fabric, online fabric shopping"} />
      
      {/* Canonical Link */}
      <link rel="canonical" href={url ? `${siteUrl}${url}` : siteUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url ? `${siteUrl}${url}` : siteUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={image || "/logo.jpeg"} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url ? `${siteUrl}${url}` : siteUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description || defaultDescription} />
      <meta property="twitter:image" content={image || "/logo.jpeg"} />

      {/* Google Search Console Verification Placeholder */}
      <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE_HERE" />
    </Helmet>
  );
};

export default SEO;
