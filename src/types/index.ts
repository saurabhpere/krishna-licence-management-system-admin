// User types
export interface User {
  id: number;
  email: string;
  role: 'admin' | 'customer';
  created_at: string;
  updated_at: string;
}

// Customer types
export interface Customer {
  id: number;
  user_id: number;
  name: string;
  phone?: string;
  api_key: string;
  created_at: string;
  updated_at: string;
  user: User;
}

// Subscription Pack types
export interface SubscriptionPack {
  id: number;
  name: string;
  description?: string;
  sku: string;
  price: number;
  validity_months: number;
  created_at: string;
  updated_at: string;
}

// Subscription types
export interface Subscription {
  id: number;
  customer_id: number;
  pack_id: number;
  status: 'requested' | 'approved' | 'active' | 'inactive' | 'expired';
  requested_at: string;
  approved_at?: string;
  assigned_at?: string;
  expires_at?: string;
  deactivated_at?: string;
  created_at: string;
  updated_at: string;
  customer: Customer;
  pack: SubscriptionPack;
}

// Request types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface SubscriptionPackRequest {
  name: string;
  description?: string;
  sku: string;
  price: number;
  validity_months: number;
}

export interface CustomerRequest {
  name: string;
  phone?: string;
}

export interface SubscriptionRequest {
  pack_id: number;
}

// Response types
export interface AuthResponse {
  token: string;
  api_key?: string;
  user: User;
  customer?: Customer;
}

export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  pagination?: PaginationResponse;
  message?: string;
  error?: string;
}

export interface PaginationRequest {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_dir?: 'asc' | 'desc';
}

// Dashboard stats
export interface DashboardStats {
  totalCustomers: number;
  totalPacks: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  pendingRequests: number;
  recentSubscriptions: Subscription[];
}
