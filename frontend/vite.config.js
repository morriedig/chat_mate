import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // For GitHub Pages: set base to repo name (e.g., '/chat_mate/')
  // Leave empty for custom domain or root deployment
  base: process.env.GITHUB_PAGES ? '/chat_mate/' : '/',
})
