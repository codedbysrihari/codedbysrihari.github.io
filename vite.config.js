import { readdirSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const briefs = readdirSync('research')
  .filter(file => file.endsWith('.html'))
  .map(file => `research/${file}`);

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: { input: ['index.html', ...briefs] },
  },
});
