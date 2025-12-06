/**
 * Products API Service
 */
import { httpClient } from "../httpClient";
import { API_ENDPOINTS } from "../config";

export interface ComponentVersion {
  id: string;
  type: "web" | "services" | "mobile" | string;
  currentVersion: string;
  previousVersion: string;
  name?: string;
  componentTypeId?: string;
  componentType?: {
    id: string;
    name: string;
    code?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  components: ComponentVersion[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductDependency {
  id: string;
  productId: string;
  dependencyProductId: string;
  dependencyProductName?: string;
  ownerId?: string;
  ownerName?: string;
  technicalLeadId?: string;
  technicalLeadName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDependencyDto {
  dependencyProductId: string;
  ownerId?: string;
  technicalLeadId?: string;
}

export interface UpdateProductDependencyDto {
  dependencyProductId?: string;
  ownerId?: string;
  technicalLeadId?: string;
}

export interface CreateComponentVersionDto {
  type: "web" | "services" | "mobile";
  currentVersion: string;
  previousVersion: string;
}

export interface CreateProductDto {
  name: string;
  components?: CreateComponentVersionDto[];
}

export interface UpdateComponentVersionDto {
  id?: string;
  name?: string;
  type?: "web" | "services" | "mobile" | string;
  componentTypeId?: string;
  currentVersion?: string;
  previousVersion?: string;
}

export interface UpdateProductDto {
  name?: string;
  components?: UpdateComponentVersionDto[];
  updatedAt?: string; // For optimistic locking
  _partialUpdate?: boolean; // Flag to prevent component deletion in partial updates (e.g., from plan)
}

export const productsService = {
  async getAll(): Promise<Product[]> {
    return httpClient.get<Product[]>(API_ENDPOINTS.PRODUCTS);
  },

  async getById(id: string): Promise<Product> {
    return httpClient.get<Product>(`${API_ENDPOINTS.PRODUCTS}/${id}`);
  },

  async create(data: CreateProductDto): Promise<Product> {
    return httpClient.post<Product>(API_ENDPOINTS.PRODUCTS, data);
  },

  async update(id: string, data: UpdateProductDto): Promise<Product> {
    return httpClient.put<Product>(`${API_ENDPOINTS.PRODUCTS}/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return httpClient.delete<void>(`${API_ENDPOINTS.PRODUCTS}/${id}`);
  },

  // Product Dependencies
  async getProductDependencies(
    productId: string
  ): Promise<ProductDependency[]> {
    return httpClient.get<ProductDependency[]>(
      `${API_ENDPOINTS.PRODUCTS}/${productId}/dependencies`
    );
  },

  async addProductDependency(
    productId: string,
    data: CreateProductDependencyDto
  ): Promise<ProductDependency> {
    return httpClient.post<ProductDependency>(
      `${API_ENDPOINTS.PRODUCTS}/${productId}/dependencies`,
      data
    );
  },

  async updateProductDependency(
    dependencyId: string,
    data: UpdateProductDependencyDto
  ): Promise<ProductDependency> {
    return httpClient.patch<ProductDependency>(
      `${API_ENDPOINTS.PRODUCTS}/dependencies/${dependencyId}`,
      data
    );
  },

  async deleteProductDependency(dependencyId: string): Promise<void> {
    return httpClient.delete<void>(
      `${API_ENDPOINTS.PRODUCTS}/dependencies/${dependencyId}`
    );
  },
};
