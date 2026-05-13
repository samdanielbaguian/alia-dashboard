// ─── Mock Data — buyer dashboard (no backend required) ────────────────────────

export const mockOrders = [
  {
    _id: 'ord001',
    id:  'ord001',
    created_at: '2026-04-15T10:32:00Z',
    status: 'delivered',
    total_amount: 45500,
    items: [
      { product_id: 'p1', product_name: 'Boubou brodé premium', quantity: 1, unit_price: 28000, image_url: null },
      { product_id: 'p2', product_name: 'Ceinture en cuir', quantity: 2, unit_price: 8750, image_url: null },
    ],
    shipping_address: { full_address: '12 Rue des Jardins', city: 'Abidjan', country: "Côte d'Ivoire" },
    payment_method: 'mobile_money',
    merchant_name: 'Boutique Koné',
    tracking_number: 'TRK-2026-00142',
  },
  {
    _id: 'ord002',
    id:  'ord002',
    created_at: '2026-05-02T08:15:00Z',
    status: 'shipped',
    total_amount: 18900,
    items: [
      { product_id: 'p3', product_name: 'Tissu wax 6 yards', quantity: 3, unit_price: 6300, image_url: null },
    ],
    shipping_address: { full_address: 'Quartier Deux Plateaux', city: 'Abidjan', country: "Côte d'Ivoire" },
    payment_method: 'card',
    merchant_name: 'Wax & Style',
    tracking_number: 'TRK-2026-00198',
  },
  {
    _id: 'ord003',
    id:  'ord003',
    created_at: '2026-05-08T14:00:00Z',
    status: 'confirmed',
    total_amount: 12400,
    items: [
      { product_id: 'p4', product_name: 'Sandales artisanales', quantity: 1, unit_price: 12400, image_url: null },
    ],
    shipping_address: { full_address: '5 Avenue Chardy', city: 'Abidjan', country: "Côte d'Ivoire" },
    payment_method: 'cash_on_delivery',
    merchant_name: 'Artisan Plus',
    tracking_number: null,
  },
  {
    _id: 'ord004',
    id:  'ord004',
    created_at: '2026-03-20T11:10:00Z',
    status: 'cancelled',
    total_amount: 9800,
    items: [
      { product_id: 'p5', product_name: 'Chapeau paille traditionnel', quantity: 2, unit_price: 4900, image_url: null },
    ],
    shipping_address: { full_address: 'Cocody Riviera', city: 'Abidjan', country: "Côte d'Ivoire" },
    payment_method: 'mobile_money',
    merchant_name: 'Artisan Plus',
    tracking_number: null,
  },
];

export const mockWishlist = [
  {
    _id: 'w1',
    id:  'w1',
    name: 'Robe bogolan tie-dye',
    title: 'Robe bogolan tie-dye',
    price: 24500,
    base_price: 24500,
    category: 'Vêtements',
    merchant_name: 'Boutique Koné',
    image_url: null,
    rating: 4.7,
  },
  {
    _id: 'w2',
    id:  'w2',
    name: 'Collier perles de verre',
    title: 'Collier perles de verre',
    price: 7800,
    base_price: 7800,
    category: 'Bijoux',
    merchant_name: 'Bijoux Lafia',
    image_url: null,
    rating: 4.5,
  },
  {
    _id: 'w3',
    id:  'w3',
    name: 'Sac en raphia naturel',
    title: 'Sac en raphia naturel',
    price: 15200,
    base_price: 15200,
    category: 'Accessoires',
    merchant_name: 'Wax & Style',
    image_url: null,
    rating: 4.8,
  },
];

export const mockProfile = {
  first_name: 'Awa',
  last_name: 'Coulibaly',
  email: 'awa.coulibaly@example.com',
  phone: '+225 07 00 11 22 33',
  birth_date: '1995-06-12',
  bio: 'Passionnée de mode africaine et d\'artisanat local.',
  address: {
    street: '12 Rue des Jardins',
    city: 'Abidjan',
    zip: '00225',
    country: "Côte d'Ivoire",
  },
  preferences: {
    newsletter: true,
    sms_notif: false,
    push_notif: true,
  },
};

export const mockCart = {
  items: [
    {
      _id: 'ci1',
      id:  'ci1',
      product_name: 'Boubou brodé premium',
      unit_price: 28000,
      quantity: 1,
      image_url: null,
    },
    {
      _id: 'ci2',
      id:  'ci2',
      product_name: 'Tissu wax 6 yards',
      unit_price: 6300,
      quantity: 2,
      image_url: null,
    },
  ],
  subtotal: 40600,
  delivery_fee: 0,
  total: 40600,
};

export const mockPayments = [
  {
    _id: 'pay001',
    id:  'pay001',
    reference: 'PAY-2026-001',
    created_at: '2026-04-15T10:45:00Z',
    amount: 45500,
    payment_method: 'mobile_money',
    status: 'completed',
    order_id: 'ord001',
  },
  {
    _id: 'pay002',
    id:  'pay002',
    reference: 'PAY-2026-002',
    created_at: '2026-05-02T08:30:00Z',
    amount: 18900,
    payment_method: 'card',
    status: 'completed',
    order_id: 'ord002',
  },
  {
    _id: 'pay003',
    id:  'pay003',
    reference: 'PAY-2026-003',
    created_at: '2026-05-08T14:10:00Z',
    amount: 12400,
    payment_method: 'cash_on_delivery',
    status: 'pending',
    order_id: 'ord003',
  },
];

export const mockProducts = [
  { _id: 'mp1', name: 'Boubou brodé premium', price: 28000, category: 'Vêtements', image_url: null },
  { _id: 'mp2', name: 'Tissu wax 6 yards', price: 6300, category: 'Tissus', image_url: null },
  { _id: 'mp3', name: 'Sandales artisanales', price: 12400, category: 'Chaussures', image_url: null },
  { _id: 'mp4', name: 'Sac en raphia naturel', price: 15200, category: 'Accessoires', image_url: null },
  { _id: 'mp5', name: 'Collier perles de verre', price: 7800, category: 'Bijoux', image_url: null },
  { _id: 'mp6', name: 'Chapeau paille traditionnel', price: 4900, category: 'Accessoires', image_url: null },
];
