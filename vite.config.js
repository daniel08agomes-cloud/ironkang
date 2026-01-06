import { defineConfig } from 'vite';

export default defineConfig({
  base: '/ironkang/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Optimize output with esbuild (faster than terser, no extra dependency)
    minify: 'esbuild',
    // Generate source maps for debugging
    sourcemap: false,
    // Copy public assets
    copyPublicDir: true,
    // Rollup options
    rollupOptions: {
      output: {
        manualChunks: undefined, // Single file output for simplicity
        assetFileNames: (assetInfo) => {
          // Keep video files in gifs folder
          if (assetInfo.name.endsWith('.mp4')) {
            return 'gifs/[name][extname]';
          }
          // Keep icons at root
          if (assetInfo.name.match(/icon-\d+\.png/)) {
            return '[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
  // Specify public directory for static assets
  publicDir: 'public',
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
