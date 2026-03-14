import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue' // <--- Make sure it says 'plugin-vue' not just 'vue'

export default defineConfig({
  plugins: [vue()],
  base: '/SE2_LAB6_3/' 
})