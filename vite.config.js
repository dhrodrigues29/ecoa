// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [react(), dts({ include: ['src/**/*.module.css'] })],
  css: {
    modules: { localsConvention: 'camelCaseOnly', scopeBehaviour: 'local' },
  },
  test: { globals: true, environment: 'jsdom' },
});