import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  base: '/TestPictureRefexctor/',  // ✅ 关键修复
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') }
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    outDir: 'dist'
  },
  server: { port: 5173, open: true }
})