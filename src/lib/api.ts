import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  AuthResponse, 
  LoginRequest, 
  SignupRequest, 
  SubscriptionPack, 
  SubscriptionPackRequest,
  Customer,
  CustomerRequest,
  Subscription,
  APIResponse,
  PaginationRequest
} from '../types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: 'http://localhost:8080',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('admin_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('admin_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication
  async adminLogin(credentials: LoginRequest): Promise<AuthResponse> {
    const response: AxiosResponse<APIResponse<AuthResponse>> = await this.client.post(
      '/api/admin/login',
      credentials
    );
    return response.data.data!;
  }

  async customerSignup(data: SignupRequest): Promise<AuthResponse> {
    const response: AxiosResponse<APIResponse<AuthResponse>> = await this.client.post(
      '/api/customer/signup',
      data
    );
    return response.data.data!;
  }

  async getProfile(): Promise<AuthResponse> {
    const response: AxiosResponse<APIResponse<AuthResponse>> = await this.client.get(
      '/api/v1/profile'
    );
    return response.data.data!;
  }

  // Subscription Packs
  async getSubscriptionPacks(params?: PaginationRequest): Promise<APIResponse<SubscriptionPack[]>> {
    const response: AxiosResponse<APIResponse<SubscriptionPack[]>> = await this.client.get(
      '/api/v1/packs',
      { params }
    );
    return response.data;
  }

  async getSubscriptionPack(id: number): Promise<APIResponse<SubscriptionPack>> {
    const response: AxiosResponse<APIResponse<SubscriptionPack>> = await this.client.get(
      `/api/v1/packs/${id}`
    );
    return response.data;
  }

  async createSubscriptionPack(data: SubscriptionPackRequest): Promise<APIResponse<SubscriptionPack>> {
    console.log('🔍 API Client method called with data:', data);
    console.log('🔍 API Client instance:', this);
    console.log('🔍 API Client client:', this.client);
    
    const response: AxiosResponse<APIResponse<SubscriptionPack>> = await this.client.post(
      '/api/v1/packs',
      data
    );
    return response.data;
  }

  async updateSubscriptionPack(id: number, data: SubscriptionPackRequest): Promise<APIResponse<SubscriptionPack>> {
    const response: AxiosResponse<APIResponse<SubscriptionPack>> = await this.client.put(
      `/api/v1/packs/${id}`,
      data
    );
    return response.data;
  }

  async deleteSubscriptionPack(id: number): Promise<APIResponse> {
    const response: AxiosResponse<APIResponse> = await this.client.delete(
      `/api/v1/packs/${id}`
    );
    return response.data;
  }

  // Customers
  async getCustomers(params?: PaginationRequest): Promise<APIResponse<Customer[]>> {
    const response: AxiosResponse<APIResponse<Customer[]>> = await this.client.get(
      '/api/v1/customers',
      { params }
    );
    return response.data;
  }

  async getCustomer(id: number): Promise<APIResponse<Customer>> {
    const response: AxiosResponse<APIResponse<Customer>> = await this.client.get(
      `/api/v1/customers/${id}`
    );
    return response.data;
  }

  async createCustomer(data: SignupRequest): Promise<APIResponse<Customer>> {
    console.log('🔍 API Client createCustomer method called with data:', data);
    console.log('🔍 API Client instance:', this);
    console.log('🔍 API Client client:', this.client);
    
    const response: AxiosResponse<APIResponse<Customer>> = await this.client.post(
      '/api/v1/customers',
      data
    );
    return response.data;
  }

  async updateCustomer(id: number, data: CustomerRequest): Promise<APIResponse<Customer>> {
    const response: AxiosResponse<APIResponse<Customer>> = await this.client.put(
      `/api/v1/customers/${id}`,
      data
    );
    return response.data;
  }

  async deleteCustomer(id: number): Promise<APIResponse> {
    const response: AxiosResponse<APIResponse> = await this.client.delete(
      `/api/v1/customers/${id}`
    );
    return response.data;
  }

  // Subscriptions
  async getSubscriptions(params?: PaginationRequest): Promise<APIResponse<Subscription[]>> {
    const response: AxiosResponse<APIResponse<Subscription[]>> = await this.client.get(
      '/api/v1/subscriptions',
      { params }
    );
    return response.data;
  }

  async getSubscription(id: number): Promise<APIResponse<Subscription>> {
    const response: AxiosResponse<APIResponse<Subscription>> = await this.client.get(
      `/api/v1/subscriptions/${id}`
    );
    return response.data;
  }

  async approveSubscription(id: number): Promise<APIResponse<Subscription>> {
    const response: AxiosResponse<APIResponse<Subscription>> = await this.client.put(
      `/api/v1/subscriptions/${id}/approve`
    );
    return response.data;
  }

  async assignSubscription(id: number): Promise<APIResponse<Subscription>> {
    const response: AxiosResponse<APIResponse<Subscription>> = await this.client.put(
      `/api/v1/subscriptions/${id}/assign`
    );
    return response.data;
  }

  async unassignSubscription(id: number): Promise<APIResponse<Subscription>> {
    const response: AxiosResponse<APIResponse<Subscription>> = await this.client.put(
      `/api/v1/subscriptions/${id}/unassign`
    );
    return response.data;
  }
}

export const apiClient = new ApiClient();
