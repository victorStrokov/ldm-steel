import { axiosInstance } from './axios-instance';
import { ApiRoutes } from './api-constants';
import { Ingredient } from '@prisma/client';

export const getAll = async (): Promise<Ingredient[]> => {
  return (await axiosInstance.get<Ingredient[]>(ApiRoutes.INGREDIENTS)).data;
};
