import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Compatível com GitHub Pages em repositórios do tipo:
// https://usuario.github.io/nome-do-repositorio/
// O base './' evita tela branca causada por caminhos absolutos de assets.
export default defineConfig({
  plugins: [react()],
  base: './'
});
