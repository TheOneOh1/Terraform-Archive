import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  root: '.',
  publicDir: 'public',
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
  },
  assetsInclude: ['**/*.md'],
});
