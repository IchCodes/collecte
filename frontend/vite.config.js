import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://51.75.25.74:8080",  // Cible : API finale
        changeOrigin: true,  // Modifie l'origine pour éviter CORS
        rewrite: (path) => path.replace(/^\/api/, "/api"),  // Garde le chemin intact
      },
    },
  },
})
