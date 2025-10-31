import {
  Product,
  CreateProductDto,
  UpdateProductDto,
  AuthToken,
  ApiError,
  RequestConfig,
  ApiConfig,
} from "./types";

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(config: ApiConfig) {
    this.baseUrl = config.baseUrl;

    // Load token from localStorage if available
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token");
    }
  }

  setAuthToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
  }

  clearAuthToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  }

  private async request<T>(
    endpoint: string,
    config: RequestConfig = { method: "GET" }
  ): Promise<T> {
    // Fix URL construction - ensure endpoint is properly appended to baseUrl
    const fullUrl = endpoint.startsWith("/")
      ? `${this.baseUrl}${endpoint}`
      : `${this.baseUrl}/${endpoint}`;

    const url = new URL(fullUrl);

    // Add query parameters
    if (config.params) {
      Object.entries(config.params).forEach(([key, value]) => {
        url.searchParams.append(key, value.toString());
      });
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...config.headers,
    };

    // Add authorization header if token exists
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const requestConfig: RequestInit = {
      method: config.method,
      headers,
    };

    // Add body for POST, PUT, PATCH requests
    if (config.body && ["POST", "PUT", "PATCH"].includes(config.method)) {
      requestConfig.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url.toString(), requestConfig);

      // Handle non-JSON responses (like 204 No Content)
      if (response.status === 204) {
        return {} as T;
      }

      const data = await response.json();

      if (!response.ok) {
        const error: ApiError = {
          message: data.message || "An error occurred",
          status: response.status,
          details: data.details || [],
        };

        // Clear token if unauthorized
        if (response.status === 401) {
          this.clearAuthToken();
        }

        throw error;
      }

      return data;
    } catch (error) {
      if (error instanceof Error && error.name === "TypeError") {
        // Network error
        throw {
          message: "Network error. Please check your connection.",
          status: 0,
          details: [],
        } as ApiError;
      }
      throw error;
    }
  }

  // Authentication API
  async getAuthToken(): Promise<AuthToken> {
    return this.request<AuthToken>("/auth/token", {
      method: "POST",
    });
  }

  // Products API
  async getProducts(): Promise<Product[]> {
    return this.request<Product[]>("/products");
  }

  async getProduct(id: string): Promise<Product> {
    return this.request<Product>(`/products/${id}`);
  }

  async createProduct(product: CreateProductDto): Promise<Product> {
    return this.request<Product>("/products", {
      method: "POST",
      body: product,
    });
  }

  async updateProduct(id: string, product: UpdateProductDto): Promise<Product> {
    return this.request<Product>(`/products/${id}`, {
      method: "PUT",
      body: product,
    });
  }

  async deleteProduct(id: string): Promise<void> {
    return this.request<void>(`/products/${id}`, {
      method: "DELETE",
    });
  }
}

// Create API client instance
const apiConfig: ApiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  timeout: 10000,
};

export const apiClient = new ApiClient(apiConfig);
export default apiClient;
