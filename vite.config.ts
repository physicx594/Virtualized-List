import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solid()],
  server:{
    port: 7788,
    host: '0.0.0.0',
  }
})
