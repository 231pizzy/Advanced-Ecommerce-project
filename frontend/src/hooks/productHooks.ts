import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import apiClient from "../apiClient";
import { Product } from "../types/Product";

export const useGetProductsQuery = () =>
  useQuery({
    queryKey: ["products"],
    queryFn: async () => (await apiClient.get<Product[]>(`api/products`)).data,
  });

export const useGetSingleProductQuery = (productId: string) =>
  useQuery({
    queryKey: ["products", productId], // Use the product ID in the query key
    queryFn: async () =>
      (await apiClient.get<Product>(`api/products/${productId}`)).data,
  });

export const useGetAllCategoriesQuery = (category: string) =>
  useQuery({
    queryKey: ["products", category], // Use the product ID in the query key
    queryFn: async () =>
      (await apiClient.get<[]>(`/api/products/category/${category}`)).data,
  });

export const useGetProductDetailsBySlugQuery = (slug: string) =>
  useQuery({
    queryKey: ["products", slug],
    queryFn: async () =>
      (await apiClient.get<Product>(`api/products/slug/${slug}`)).data,
  });

export const useGetCategoriesQuery = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: async () =>
      (await apiClient.get<[]>(`/api/products/categories`)).data,
  });

export const useCreateProductMutation = () =>
  useMutation({
    mutationFn: async ({
      name,
      slug,
      image,
      category,
      brand,
      price,
      countInStock,
      description,
      rating,
      numReviews,
    }: {
      name: string;
      slug: string;
      image: string[];
      category: string;
      brand: string;
      price: number;
      countInStock: number;
      description: string;
      rating: number;
      numReviews: number;
    }) =>
      (
        await apiClient.post<Product>(`api/listings/create`, {
          name,
          slug,
          image,
          category,
          brand,
          price,
          countInStock,
          description,
          rating,
          numReviews,
        })
      ).data,
  });

export const useDeleteProductMutation = () =>
  useMutation<Product, Error, string>({
    mutationFn: async (productId) => {
      const response = await apiClient.delete<Product>(
        `/api/products/delete/${productId}`
      );
      console.log(response);
      return response.data;
    },
  });

export const useUpdateProductMutation = () =>
  useMutation<
    void,
    Error,
    {
      name: string;
      slug: string;
      image: string[];
      category: string;
      brand: string;
      price: number;
      countInStock: number;
      description: string;
      rating: number;
      numReviews: number;
      productId: string; // Add productId to the mutation function argument type
    }
  >({
    mutationFn: async (updatedProductData) => {
      const {
        name,
        slug,
        image,
        category,
        brand,
        price,
        countInStock,
        description,
        rating,
        numReviews,
        productId,
      } = updatedProductData;
      await apiClient.post<void>(`api/products/update/${productId}`, {
        name,
        slug,
        image,
        category,
        brand,
        price,
        countInStock,
        description,
        rating,
        numReviews,
      });
    },
  });
