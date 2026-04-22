'use client';

import { Stories as StoriesComponent } from './stories';

/**
 * Thin wrapper kept for compatibility with existing imports.
 */
export const StoriesWrapper: React.FC = () => {
  return <StoriesComponent />;
};
