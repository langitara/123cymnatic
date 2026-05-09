// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/123cymnatic/', // Contoh: '/MarketPulse/' (Huruf besar/kecil harus sama persis!)
})