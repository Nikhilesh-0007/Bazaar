export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  mrp: number;
  category: string;
  stock: number;
  image: string;
  badge?: string | null;
  desc: string;
  rating: number;
  reviews: number;
}

export interface CartItem extends Product {
  qty: number;
}

export interface Order {
  id: string;
  total: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  paymentId?: string;
  addressName: string;
  addressPhone: string;
  addressStreet: string;
  addressCity: string;
  addressState: string;
  addressPincode: string;
  items: {
    id: string;
    qty: number;
    price: number;
    product: { name: string; image: string };
  }[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
}
