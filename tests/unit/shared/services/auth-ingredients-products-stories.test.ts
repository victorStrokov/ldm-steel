import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/services/axios-instance', () => ({
  axiosInstance: {
    get: vi.fn(),
  },
}));

import { axiosInstance } from '@/shared/services/axios-instance';
import * as authService from '@/shared/services/auth';
import * as ingredientsService from '@/shared/services/ingredients';
import * as productsService from '@/shared/services/products';
import * as storiesService from '@/shared/services/stories';
import { ApiRoutes } from '@/shared/services/api-constants';

describe('shared/services other modules', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('auth.getMe calls /auth/me', async () => {
    const payload = { id: 1, email: 'test@example.com' };
    vi.mocked(axiosInstance.get).mockResolvedValue({ data: payload } as never);

    const result = await authService.getMe();

    expect(axiosInstance.get).toHaveBeenCalledWith('/auth/me');
    expect(result).toEqual(payload);
  });

  it('ingredients.getAll calls INGREDIENTS route', async () => {
    const payload = [{ id: 1, name: 'A' }];
    vi.mocked(axiosInstance.get).mockResolvedValue({ data: payload } as never);

    const result = await ingredientsService.getAll();

    expect(axiosInstance.get).toHaveBeenCalledWith(ApiRoutes.INGREDIENTS);
    expect(result).toEqual(payload);
  });

  it('products.search sends query params to SEARCH_PRODUCTS route', async () => {
    const payload = [{ id: 1, name: 'Steel profile' }];
    vi.mocked(axiosInstance.get).mockResolvedValue({ data: payload } as never);

    const result = await productsService.search('steel');

    expect(axiosInstance.get).toHaveBeenCalledWith(ApiRoutes.SEARCH_PRODUCTS, {
      params: { query: 'steel' },
    });
    expect(result).toEqual(payload);
  });

  it('stories.getAll calls /stories', async () => {
    const payload = [{ id: 1, title: 'Story 1' }];
    vi.mocked(axiosInstance.get).mockResolvedValue({ data: payload } as never);

    const result = await storiesService.getAll();

    expect(axiosInstance.get).toHaveBeenCalledWith('/stories');
    expect(result).toEqual(payload);
  });
});
