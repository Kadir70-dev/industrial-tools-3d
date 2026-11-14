export const siteConfig = {
  brand: {
    name: 'AFRAH',
    division: 'Alyasmeen Trading L.L.C',
    // Short prefix used for catalogue indexes and part labels (e.g. "AF-D18").
    code: 'AF',
    logo: {
      markInk: '/brand/afrah-mark-ink.png',
      wordInk: '/brand/afrah-word-ink.png',
      lockupWhite: '/brand/afrah-lockup-white.png',
    },
  },
  // Featured product (by id in lib/products.ts) shown in the hero and 360° viewer.
  featuredProductId: 'd18',
  // Leave a value empty to hide it. WhatsApp: full international number, digits only (e.g. 9715XXXXXXXX).
  contact: {
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
  },
  // Office map. Set exact: true once the real coordinates are known; until then the map
  // shows the city with an "address coming soon" note and no directions link.
  office: {
    lat: 25.2048,
    lng: 55.2708,
    exact: false,
    city: 'Dubai, United Arab Emirates',
  },
  seo: {
    title: 'Engineered for every challenge',
    description: 'Professional tools, considered down to the last detail. Find equipment, compare specifications and request a tailored quotation.',
  },
};
