import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use relative paths for assets so it works on both GitHub Pages subpaths and Vercel root
  base: './',
})
