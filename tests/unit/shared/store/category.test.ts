import { describe, expect, it } from 'vitest';
import { useCategoryStore } from '@/shared/store/category';

describe('shared/store/category', () => {
  it('has default activeId and updates it', () => {
    useCategoryStore.setState({ activeId: 1 });

    expect(useCategoryStore.getState().activeId).toBe(1);

    useCategoryStore.getState().setActiveId(12);

    expect(useCategoryStore.getState().activeId).toBe(12);
  });
});
