import React from 'react';

export default function JSONLD() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "BGX - Bogotá Golf Experience",
    "image": "https://www.bogotagolfexperience.com/favicon.ico",
    "@id": "https://www.bogotagolfexperience.com",
    "url": "https://www.bogotagolfexperience.com",
    "telephone": "+57 317 639 2251",
    "email": "info@bogotagolfexperience.com",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+57 317 639 2251",
      "contactType": "customer service",
      "areaServed": "CO",
      "availableLanguage": ["English", "Spanish"]
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "",
      "addressLocality": "Bogotá",
      "addressRegion": "Cundinamarca",
      "postalCode": "",
      "addressCountry": "CO"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 4.6097,
      "longitude": -74.0817
    },
    "sameAs": [
      "https://www.facebook.com/bogotagolfexperience",
      "https://www.instagram.com/bogotagolfexperience"
    ],
    "priceRange": "$$",
    "description": "Premium golf experiences in Bogotá. 20+ championship golf courses, professional bilingual caddies, and local Andean charm.",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Golf Packages",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Professional Bilingual Caddies",
            "description": "Every round includes a professional, bilingual caddy who knows each course intimately."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "World-Class Golf Courses",
            "description": "Access to over 20+ championship golf courses in and around Bogotá."
          }
        },
        {
          "@type": "Offer",
          "priceCurrency": "USD",
          "price": "1890",
          "itemOffered": {
            "@type": "Product",
            "name": "BGX Smart Pack",
            "description": "A premium golf getaway with three rounds, luxury accommodation, transportation, and concierge support."
          }
        },
        {
          "@type": "Offer",
          "priceCurrency": "USD",
          "price": "2090",
          "itemOffered": {
            "@type": "Product",
            "name": "BGX Elite Pack",
            "description": "An elevated golf experience with four rounds, premium amenities, and expert itinerary planning."
          }
        }
      ]
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
