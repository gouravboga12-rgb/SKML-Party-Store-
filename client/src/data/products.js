export const categories = [
  {
    id: "backdrops",
    name: "Backdrops & Event Decoration",
    description: "Traditional backdrops, party drapes, stage setup materials",
    image: "/images/products/BT1.jpeg"
  },
  {
    id: "fabrics",
    name: "Fancy & Party Wear Fabrics",
    description: "Ladies boutique fabrics, designer materials, occasion wear fabrics",
    image: "/images/products/fabric-1.jpg"
  },
  {
    id: "home-decor",
    name: "Curtains & Home Decoration",
    description: "Door curtains and premium sheer decorative fabrics",
    image: "/images/products/CS1.jpeg"
  },
  {
    id: "velvet-animal",
    name: "Velvet Animal Prints",
    description: "Premium velvet fabrics featuring realistic animal print patterns",
    image: "/images/products/AT12.jpeg"
  }
];

export const products = [
  // --- Backdrops & Event Decoration: Traditional (6 Products) ---
  {
    id: 101,
    name: "Traditional Backdrop - Variant 1",
    category: "backdrops",
    subCategory: "traditional",
    price: 500,
    description: "Vibrant ethnic backdrop featuring classic traditional patterns. Ideal for festive home decorations and ceremonies.",
    image: "/images/products/BT1.jpeg",
    images: ["/images/products/BT1.jpeg"],
    rating: 4.8,
    reviewsCount: 124,
    colors: [{ name: "Red/Gold", value: "#B91C1C", image: "/images/products/BT1.jpeg" }],
    sizes: ["8x8", "10x10", "Custom"],
    reviews: [{ user: "Lakshmi P.", rating: 5, comment: "Beautiful quality! The colors are exactly as shown.", date: "2024-03-15" }]
  },
  {
    id: 102,
    name: "Premium Stage Backdrop - Video Edition",
    category: "backdrops",
    subCategory: "traditional",
    price: 500,
    description: "High-end stage backdrop with a detailed video walkthrough of the setup process.",
    image: "/images/products/BT2.jpeg",
    images: ["/images/products/BT2.jpeg", "/images/products/BTV2.mp4"],
    rating: 4.9,
    reviewsCount: 89,
    colors: [{ name: "Traditional Blue", value: "#1E3A8A", image: "/images/products/BT2.jpeg" }],
    sizes: ["8x10", "12x12", "Custom"],
    reviews: [{ user: "Anjali S.", rating: 5, comment: "The video helped a lot in setting it up. Looks stunning!", date: "2024-03-20" }]
  },
  {
    id: 103,
    name: "Grand Ethnic Backdrop Trio",
    category: "backdrops",
    subCategory: "traditional",
    price: 500,
    description: "A versatile set of three traditional patterns that can be used together or individually for a grand event look.",
    image: "/images/products/BT31.jpeg",
    images: ["/images/products/BT31.jpeg", "/images/products/BT32.jpeg", "/images/products/BT33.jpeg"],
    rating: 4.7,
    reviewsCount: 65,
    colors: [
      { name: "Gold Pattern", value: "#D97706", image: "/images/products/BT31.jpeg" },
      { name: "Deep Saffron", value: "#EA580C", image: "/images/products/BT32.jpeg" },
      { name: "Emerald Mix", value: "#065F46", image: "/images/products/BT33.jpeg" }
    ],
    sizes: ["8x8", "10x10", "Custom"],
    reviews: []
  },
  {
    id: 104,
    name: "Classic Temple Pattern Backdrop",
    category: "backdrops",
    subCategory: "traditional",
    price: 500,
    description: "Elegant floral and temple-inspired patterns for a serene traditional ambiance.",
    image: "/images/products/BT41.jpeg",
    images: ["/images/products/BT41.jpeg"],
    rating: 4.6,
    reviewsCount: 42,
    colors: [{ name: "Classic Orange", value: "#EA580C", image: "/images/products/BT41.jpeg" }],
    sizes: ["8x8", "Normal", "Custom"],
    reviews: []
  },
  {
    id: 105,
    name: "Vibrant Saffron Backdrop",
    category: "backdrops",
    subCategory: "traditional",
    price: 500,
    description: "Rich saffron-colored backdrop, perfect for religious ceremonies and traditional gatherings.",
    image: "/images/products/BT51.jpeg",
    images: ["/images/products/BT51.jpeg"],
    rating: 4.5,
    reviewsCount: 38,
    colors: [{ name: "Saffron", value: "#F59E0B", image: "/images/products/BT51.jpeg" }],
    sizes: ["8x8", "Custom"],
    reviews: []
  },
  {
    id: 106,
    name: "S K M L Signature Traditional Drape",
    category: "backdrops",
    subCategory: "traditional",
    price: 500,
    description: "Our signature double-pattern drape set, providing a rich, layered look for any traditional setup.",
    image: "/images/products/BT61.jpeg",
    images: ["/images/products/BT61.jpeg", "/images/products/BT62.jpeg"],
    rating: 4.8,
    reviewsCount: 52,
    colors: [
      { name: "Maroon", value: "#7F1D1D", image: "/images/products/BT61.jpeg" },
      { name: "Cream", value: "#FEF3C7", image: "/images/products/BT62.jpeg" }
    ],
    sizes: ["8x8", "10x10", "Custom"],
    reviews: []
  },

  // --- Backdrops & Event Decoration: Party (Re-grouped) ---
  {
    id: 201,
    name: "Modern Party Sparkle Backdrop",
    category: "backdrops",
    subCategory: "party",
    price: 500,
    description: "Make your parties shine with this modern sparkle backdrop. Ideal for birthdays, anniversaries, and photo booths.",
    image: "/images/products/BF11.jpeg",
    images: ["/images/products/BF11.jpeg", "/images/products/BF12.jpeg", "/images/products/BF13.jpeg"],
    rating: 4.6,
    reviewsCount: 210,
    colors: [
      { name: "Silver", value: "#D1D5DB", image: "/images/products/BF11.jpeg" },
      { name: "Sky Blue", value: "#0EA5E9", image: "/images/products/BF12.jpeg" },
      { name: "Pink Splash", value: "#EC4899", image: "/images/products/BF13.jpeg" }
    ],
    sizes: ["6x6", "8x8", "Custom"],
    reviews: [
      { user: "Priya M.", rating: 5, comment: "Perfect for my son's birthday! Reusable too.", date: "2024-02-28" }
    ]
  },
  {
    id: 202,
    name: "Designer Boutique Party Backdrop",
    category: "backdrops",
    subCategory: "party",
    price: 500,
    description: "A premium designer backdrop from our boutique collection. Sophisticated patterns for high-end events.",
    image: "/images/products/BF14.jpeg",
    images: ["/images/products/BF14.jpeg", "/images/products/BF15.jpeg", "/images/products/BF16.jpeg", "/images/products/BF17.jpeg"],
    rating: 4.9,
    reviewsCount: 45,
    colors: [
      { name: "Midnight Black", value: "#111827", image: "/images/products/BF14.jpeg" },
      { name: "Champagne", value: "#F3F4F6", image: "/images/products/BF15.jpeg" },
      { name: "Violet Night", value: "#4C1D95", image: "/images/products/BF16.jpeg" }
    ],
    sizes: ["8x8", "10x10", "Custom"],
    reviews: []
  },

  // --- Curtains & Home Decoration: Sheer Curtains ---
  {
    id: 301,
    name: "Ethereal White Sheer Curtain",
    category: "home-decor",
    subCategory: "sheer",
    price: 100,
    description: "Premium white sheer fabric with a soft, ethereal glow. Lightweight and perfectly translucent. Sold per meter.",
    image: "/images/products/CS1.jpeg",
    images: ["/images/products/CS1.jpeg", "/images/products/CSV11.mp4", "/images/products/CS15.jpeg"],
    rating: 4.9,
    reviewsCount: 156,
    colors: [{ name: "Pure White", value: "#ffffff", image: "/images/products/CS1.jpeg" }],
    sizes: ["1 Meter", "5 Meters", "10 Meters", "Custom"],
    specifications: {
      Width: "5 Feet",
      Material: "Premium Sheer Fabric",
      PriceUnit: "Per Meter",
      Care: "Gentle Hand Wash"
    }
  },
  {
    id: 302,
    name: "Baby Pink Whisper Sheer",
    category: "home-decor",
    subCategory: "sheer",
    price: 100,
    description: "Delicate baby pink sheer fabric. Adds a romantic and soft touch to any room. Sold per meter.",
    image: "/images/products/CS21.jpeg",
    images: ["/images/products/CS21.jpeg", "/images/products/CSV2.mp4", "/images/products/CS22.jpeg"],
    rating: 4.8,
    reviewsCount: 42,
    colors: [{ name: "Baby Pink", value: "#FBCFE8", image: "/images/products/CS21.jpeg" }],
    sizes: ["1 Meter", "5 Meters", "10 Meters", "Custom"],
    specifications: {
      Width: "5 Feet",
      Material: "Premium Sheer Fabric",
      PriceUnit: "Per Meter"
    }
  },
  {
    id: 303,
    name: "Classic Cream Elegance Sheer",
    category: "home-decor",
    subCategory: "sheer",
    price: 100,
    description: "Timed-honored cream sheer fabric that coordinates beautifully with any interior palette. Sold per meter.",
    image: "/images/products/CS12.jpeg",
    images: ["/images/products/CS12.jpeg", "/images/products/CSV1.mp4", "/images/products/CS13.jpeg", "/images/products/CS14.jpeg"],
    rating: 4.7,
    reviewsCount: 98,
    colors: [{ name: "Classic Cream", value: "#FEF3C7", image: "/images/products/CS12.jpeg" }],
    sizes: ["1 Meter", "5 Meters", "10 Meters", "Custom"],
    specifications: {
      Width: "5 Feet",
      Material: "Premium Sheer Fabric",
      PriceUnit: "Per Meter"
    }
  },
  {
    id: 304,
    name: "Royal Gold Lustre Sheer",
    category: "home-decor",
    subCategory: "sheer",
    price: 100,
    description: "Luxurious gold-toned sheer fabric with a subtle lustrous finish. Perfect for adding a touch of royalty. Sold per meter.",
    image: "/images/products/CS47.jpeg",
    images: ["/images/products/CS47.jpeg", "/images/products/CSV4.mp4", "/images/products/CS41.jpeg", "/images/products/CS42.jpeg", "/images/products/CS43.jpeg", "/images/products/CS44.jpeg", "/images/products/CS45.jpeg"],
    rating: 5.0,
    reviewsCount: 67,
    colors: [{ name: "Royal Gold", value: "#FBBF24", image: "/images/products/CS47.jpeg" }],
    sizes: ["1 Meter", "5 Meters", "10 Meters", "Custom"],
    specifications: {
      Width: "5 Feet",
      Material: "Premium Sheer Fabric",
      PriceUnit: "Per Meter"
    }
  },
  {
    id: 305,
    name: "Earth Walnut Brown Sheer",
    category: "home-decor",
    subCategory: "sheer",
    price: 100,
    description: "Deep walnut brown sheer fabric for a grounded, sophisticated look. Provides warm light filtering. Sold per meter.",
    image: "/images/products/CS5.jpeg",
    images: ["/images/products/CS5.jpeg", "/images/products/CSV5.mp4"],
    rating: 4.6,
    reviewsCount: 29,
    colors: [{ name: "Walnut Brown", value: "#78350F", image: "/images/products/CS5.jpeg" }],
    sizes: ["1 Meter", "5 Meters", "10 Meters", "Custom"],
    specifications: {
      Width: "5 Feet",
      Material: "Premium Sheer Fabric",
      PriceUnit: "Per Meter"
    }
  },

  // --- Fancy & Party Wear Fabrics ---
  {
    id: 501,
    name: "Premium Chiffon Saree Collection",
    category: "fabrics",
    price: 499,
    description: "Flowery and elegant premium chiffon sarees. Lightweight fabric with a graceful drape, available in a palette of stunning colors for every occasion.",
    image: "/images/products/WhatsApp Image 2026-04-13 at 12.00.13 PM.jpeg",
    images: [
      "/images/products/WhatsApp Image 2026-04-13 at 12.00.13 PM.jpeg",
      "/images/products/WhatsApp Video 2026-04-13 at 12.00.14 PM.mp4",
      "/images/products/WhatsApp Image 2026-04-13 at 12.00.12 PM.jpeg",
      "/images/products/WhatsApp Video 2026-04-13 at 12.00.13 PM (1).mp4",
      "/images/products/WhatsApp Image 2026-04-13 at 12.00.10 PM.jpeg",
      "/images/products/WhatsApp Video 2026-04-13 at 12.00.15 PM (1).mp4",
      "/images/products/WhatsApp Image 2026-04-13 at 12.00.12 PM (2).jpeg",
      "/images/products/WhatsApp Video 2026-04-13 at 12.00.13 PM (2).mp4",
      "/images/products/WhatsApp Image 2026-04-13 at 12.00.11 PM.jpeg",
      "/images/products/WhatsApp Video 2026-04-13 at 12.00.14 PM (1).mp4",
      "/images/products/WhatsApp Video 2026-04-13 at 12.00.11 PM.mp4"
    ],
    rating: 4.8,
    reviewsCount: 42,
    colors: [
      { name: "White", value: "#FAFAF9", image: "/images/products/WhatsApp Image 2026-04-13 at 12.00.13 PM.jpeg" },
      { name: "Red", value: "#B91C1C", image: "/images/products/WhatsApp Image 2026-04-13 at 12.00.12 PM.jpeg" },
      { name: "Black", value: "#18181B", image: "/images/products/WhatsApp Image 2026-04-13 at 12.00.10 PM.jpeg" },
      { name: "Blue", value: "#1E3A8A", image: "/images/products/WhatsApp Image 2026-04-13 at 12.00.12 PM (2).jpeg" },
      { name: "Pink", value: "#DB2777", image: "/images/products/WhatsApp Image 2026-04-13 at 12.00.11 PM.jpeg" },
      { name: "Yellow", value: "#EAB308", image: "/images/products/WhatsApp Image 2026-04-13 at 12.00.13 PM.jpeg" }
    ],
    sizes: ["Standard Saree Length"],
    reviews: []
  },

  // --- Velvet Animal Prints ---
  {
    id: 401,
    name: "Tiger Velvet Cloth",
    category: "velvet-animal",
    price: 500,
    description: "Luxurious velvet fabric with realistic tiger stripe patterns. Available in classic tiger and white tiger variants.",
    image: "/images/products/AT12.jpeg",
    images: ["/images/products/AT12.jpeg", "/images/products/ATV1.mp4", "/images/products/AT11.jpeg", "/images/products/ATV11.mp4"],
    rating: 4.9,
    reviewsCount: 12,
    colors: [
      { name: "Classic Tiger", value: "#F59E0B", image: "/images/products/AT12.jpeg" },
      { name: "White Tiger", value: "#ffffff", image: "/images/products/AT11.jpeg" }
    ],
    sizes: ["1 Meter", "5 Meters", "Custom"]
  },
  {
    id: 402,
    name: "Zebra Velvet Cloth",
    category: "velvet-animal",
    price: 500,
    description: "Premium zebra print velvet fabric. Bold black and white patterns for a striking visual impact.",
    image: "/images/products/AT21.jpeg",
    images: ["/images/products/AT21.jpeg", "/images/products/ATV2.mp4"],
    rating: 4.8,
    reviewsCount: 8,
    colors: [{ name: "Zebra Print", value: "#000000", image: "/images/products/AT21.jpeg" }],
    sizes: ["1 Meter", "5 Meters", "Custom"]
  },
  {
    id: 403,
    name: "Cow Print Velvet Cloth",
    category: "velvet-animal",
    price: 500,
    description: "Trendy cow print velvet fabric. Soft texture with classic dalmatian-style animal spots.",
    image: "/images/products/AT31.jpeg",
    images: ["/images/products/AT31.jpeg", "/images/products/ATV3.mp4"],
    rating: 4.7,
    reviewsCount: 15,
    colors: [{ name: "Cow Print", value: "#ffffff", image: "/images/products/AT31.jpeg" }],
    sizes: ["1 Meter", "5 Meters", "Custom"]
  }
];
