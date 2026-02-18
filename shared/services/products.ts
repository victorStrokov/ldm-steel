import { Product } from '@prisma/client';
import { axiosInstance } from './axios-instance';
import { ApiRoutes } from './api-constants';

export type SearchProduct = Product & {
  images: { url: string }[];
};

export const search = async (query: string): Promise<SearchProduct[]> => {
  return (
    await axiosInstance.get<SearchProduct[]>(ApiRoutes.SEARCH_PRODUCTS, {
      params: { query },
    })
  ).data;
};
