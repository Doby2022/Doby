
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // 'base: "./"' este secretul. Spune browserului: "caută fișierele lângă index.html, nu în rădăcina domeniului".
  base: './',
  server: {
    port: 3000,
  },
});
