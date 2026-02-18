import { Api } from '@/shared/services/api-client';
import { IngredientWithImages } from '@/@types/IngredientWithImages';
import React from 'react';

export const useIngredients = () => {
  const [ingredients, setIngredients] = React.useState<IngredientWithImages[]>([]);

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchIngredients() {
      try {
        setLoading(true);
        const ingredients = await Api.ingredients.getAll();
        setIngredients(ingredients);
      } catch (error) {
        console.log('Ошибка при загрузке ингредиентов:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchIngredients();
  }, []);

  return {
    ingredients,
    loading,
  };
};
