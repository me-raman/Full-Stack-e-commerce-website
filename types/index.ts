export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price: number;
  category: "saree" | "lehenga" | "kurta-set" | "dupatta" | "sherwani" | "kurta-pyjama" | "nehru-jacket" | "indo-western";
  gender: "men" | "women";
  sizes: string[];
  colors: string[];
  images: string[];
  stock: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selected_size: string;
  selected_color: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shipping_charge: number;
  total: number;
  payment_id: string;
  razorpay_order_id: string;
  payment_status: "pending" | "paid" | "failed";
  order_status: "placed" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  product_image: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
}

export interface ShippingAddress {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  pincode: string;
}

export interface AdminStats {
  total_orders: number;
  total_revenue: number;
  pending_orders: number;
  total_products: number;
}
