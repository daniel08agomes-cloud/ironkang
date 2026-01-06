import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    // Optimize output with esbuild (faster than terser, no extra dependency)
    minify: 'esbuild',
    // Generate source maps for debugging
    sourcemap: false,
    // Rollup options - inline everything into single HTML file
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  // Don't use a separate public directory - keep everything at root
  publicDir: false,
  // Server configuration for development
  server: {
    port: 3000,
    open: true,
  },
  // Preview server configuration
  preview: {
    port: 4173,
  },
});
