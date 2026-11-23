import { readdirSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const projectPages = ['research', 'labs'].flatMap(directory =>
  readdirSync(directory).filter(file => file.endsWith('.html')).map(file => `${directory}/${file}`));

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: { input: ['index.html', ...projectPages] },
  },
});
