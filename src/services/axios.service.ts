import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { API_URL } from "../app/config/constants";

class AxiosService {
  private static instance: AxiosService;
  private axiosInstance: AxiosInstance;
  private publicEndpoints: string[] = [
    "/v3/user/client/verify",
    "/v3/user/client/register",
    "/v3/auth/login",
    "/v3/user/otp/generate",
    "/v3/user/otp/verify",
    "/v3/user/get-token",
    "/v3/user/client/login",
    // Ajoutez ici tous vos endpoints publics
  ];

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  public static getInstance(): AxiosService {
    if (!AxiosService.instance) {
      AxiosService.instance = new AxiosService();
    }
    return AxiosService.instance;
  }

  private isPublicEndpoint(url: string): boolean {
    return this.publicEndpoints.some((endpoint) => url.includes(endpoint));
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const url = config.url || "";

        if (this.isPublicEndpoint(url)) {
          // Utiliser le token public pour les endpoints publics
          const publicToken = localStorage.getItem("api_token");
          if (publicToken && config.headers) {
            config.headers.Authorization = `Bearer ${publicToken}`;
          }
        } else {
          // Utiliser le token privé pour les autres endpoints
          const privateToken = localStorage.getItem("token");
          if (privateToken && config.headers) {
            config.headers.Authorization = `Bearer ${privateToken}`;
          }
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        if (error.response) {
          switch (error.response.status) {
            case 403:
              // Handle forbidden access
              console.error("Access forbidden");
              break;
            case 404:
              // Handle not found
              console.error("Resource not found");
              break;
            case 500:
              // Handle server error
              console.error("Server error");
              break;
            default:
              console.error("An error occurred");
          }
        }
        return Promise.reject(error);
      }
    );
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  public async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }

  public async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.patch<T>(url, data, config);
    return response.data;
  }
}

export const axiosService = AxiosService.getInstance();
