import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages do repositório:
// https://erwinklein94.github.io/Ecossistema/
// Em desenvolvimento local o app roda em '/', mas no build ele usa '/Ecossistema/'.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/Ecossistema/' : '/',
}));
