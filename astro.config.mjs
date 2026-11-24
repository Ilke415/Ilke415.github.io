// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// GitHub Pages user site: repo Ilke415.github.io
export default defineConfig({
  site: 'https://Ilke415.github.io',
  integrations: [sitemap()],
});
