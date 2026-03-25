import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      reportsDirectory: './coverage',
      include: ['shared/**/*.ts', 'app/actions/**/*.ts', 'app/api/**/*.ts'],
      exclude: ['**/*.d.ts', '**/index.ts', '**/*.types.ts', '**/@types/**', 'shared/components/**'],
      thresholds: {
        lines: 50,
        functions: 30,
        branches: 45,
        statements: 50,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
