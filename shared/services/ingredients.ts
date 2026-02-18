import { axiosInstance } from './axios-instance';
import { ApiRoutes } from './api-constants';
import { IngredientWithImages } from '@/@types/IngredientWithImages';

export const getAll = async (): Promise<IngredientWithImages[]> => {
  return (await axiosInstance.get<IngredientWithImages[]>(ApiRoutes.INGREDIENTS)).data;
};
