import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['vitest.setup.ts','allure-vitest/setup'],
    exclude:['integration_test', 'node_modules'],
    reporters: [
      'verbose',
      [
        'allure-vitest/reporter',
        {
          resultsDir: 'allure-results',
        },
      ],
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
