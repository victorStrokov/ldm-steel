import { describe, expect, it } from 'vitest';
import { useSortStore } from '@/shared/store/sort-popup';

describe('shared/store/sort-popup', () => {
  it('uses asc by default and switches to desc', () => {
    useSortStore.setState({ order: 'asc' });

    expect(useSortStore.getState().order).toBe('asc');

    useSortStore.getState().setOrder('desc');

    expect(useSortStore.getState().order).toBe('desc');
  });
});
