// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/*
 * The live domain. It is used for canonical URLs, the sitemap, and the
 * absolute image URLs that LinkedIn, WhatsApp and X need for link previews.
 * A SITE_URL environment variable, if set, takes precedence.
 */
const SITE_URL = process.env.SITE_URL || 'https://nagasurya.com';

export default defineConfig({
  site: SITE_URL,
  // Treat template whitespace like plain HTML (a line break counts as a space),
  // instead of Astro 7's JSX default that drops line breaks next to tags.
  compressHTML: true,
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/og/'),
    }),
  ],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  devToolbar: { enabled: false },
});
