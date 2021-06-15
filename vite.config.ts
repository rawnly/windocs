import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import dotenv from 'dotenv'

dotenv.config()

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  define: {
    'process.cwd': process.cwd,
    'process.env': process.env
  }
})
