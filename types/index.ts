// types/index.ts — shared types across app

export interface User {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  category: string;
}

export interface CartItem {
  id: string;
  productId: number;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: string;
  items: CartItem[];
}

export interface ShippingAddress {
  name: string;
  address: string;
  city: string;
  zip: string;
  phone: string;
}

export interface OrderItem {
  id: string;
  productId: number;
  quantity: number;
  price: number;
  product: Product;
}

export interface Order {
  id: string;
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  total: number;
  items: OrderItem[];
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingZip: string;
  shippingPhone: string;
  createdAt: string;
}

// API response wrappers
export type ApiSuccess<T> = { data: T; error: null };
export type ApiError = { data: null; error: string; status?: number };
export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// Auth
export interface LoginRequest {
  email: string;
  password: string;
}
export interface LoginResponse {
  user: User;
  token: string;
}
export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
}

// Products
export interface ProductsQuery {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}
export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

// Orders
export interface CreateOrderRequest {
  items: { productId: number; quantity: number }[];
  shipping: ShippingAddress;
}
