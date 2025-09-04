import { defineConfig } from 'astro/config';

import icon from 'astro-icon';

import mdx from '@astrojs/mdx';


import sitemap from '@astrojs/sitemap';


// https://astro.build/config
export default defineConfig({
  site: "https://portfolio-v2-gules-eta-48.vercel.app/",
  integrations: [icon(), mdx(), sitemap()],
  vite: {
    build: {
      assetsInlineLimit: 4096,
    }
  },
  image: {
    domains: ['https://avatars.githubusercontent.com'],
    responsiveStyles: true, layout: 'constrained',
  }
});