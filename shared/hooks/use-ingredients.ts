import { Api } from '@/shared/services/api-client';
import { IngredientWithImages } from '@/@types/IngredientWithImages';
import React from 'react';
import { createClientLogger } from '../lib/client-logger';

const log = createClientLogger('useIngredients');

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
        log.error('Failed to load ingredients', error);
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
