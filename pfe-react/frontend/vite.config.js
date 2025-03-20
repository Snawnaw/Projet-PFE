import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.css'],
    mainFields: ['module', 'main', 'browser'],
    dedupe: ['react', 'react-dom'],
  },
  server: {
    port: 5173,
    open: true
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020'
    },
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'formik',
      'yup',
      'axios',
      'styled-components'
    ]
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  }
})
