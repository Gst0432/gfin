// Firestore collection schemas and types
export const salesSchema = {
  // Required fields
  id: 'string',
  type: "'sale' | 'premium'",
  amount: 'number',
  date: 'timestamp',
  sellerId: 'string',
  status: "'pending' | 'completed' | 'cancelled'",
  createdAt: 'timestamp',

  // Optional fields
  description: 'string?',
  saleType: "'product' | 'service'?",
  buyerDetails: {
    name: 'string?',
    email: 'string?',
    phone: 'string?'
  },
  paymentMethod: "'cash' | 'mobile' | 'card' | 'transfer'?",
  itemId: 'string?',
  buyerId: 'string?',
  updatedAt: 'timestamp?'
};

// Example document structure
const exampleSale = {
  id: 'auto-generated',
  type: 'sale',
  amount: 50000,
  date: 'timestamp',
  description: 'Vente de produit XYZ',
  saleType: 'product',
  buyerDetails: {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+227 XX XX XX XX'
  },
  paymentMethod: 'mobile',
  itemId: 'product-123',
  sellerId: 'user-123',
  status: 'completed',
  createdAt: 'timestamp',
  updatedAt: 'timestamp'
};