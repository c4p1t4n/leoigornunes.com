import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import { autolinkHeadings, externalLinks } from './src/lib/markdown-plugins.ts';

export default defineConfig({
  site: 'https://leoigornunes.com', // sem `base`: domínio próprio
  integrations: [sitemap()],
  markdown: {
    // Tema duplo: gera --shiki-light/--shiki-dark; prose.css escolhe via light-dark().
    // (Dentro de satteri() o `themes` é ignorado; precisa ficar aqui.)
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
    },
    processor: satteri({ hastPlugins: [autolinkHeadings, externalLinks] }),
  },
});
