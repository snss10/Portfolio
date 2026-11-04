// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/*
 * Your live domain. It is used for canonical URLs, the sitemap, and the
 * absolute image URLs that LinkedIn, WhatsApp and X need for link previews.
 *
 * Set it once, either by replacing the fallback below, e.g.
 *   const SITE_URL = process.env.SITE_URL ?? 'https://nagasurya.dev';
 * or by setting the SITE_URL environment variable on your hosting provider.
 */
const PLACEHOLDER = 'https://example.com';
const SITE_URL = process.env.SITE_URL || PLACEHOLDER;

if (SITE_URL === PLACEHOLDER) {
  console.warn(
    '\n[portfolio] SITE_URL is not set: canonical links, the sitemap and social preview images ' +
      `will point to ${PLACEHOLDER}. Set it in astro.config.mjs or as an env var before deploying.\n`,
  );
}

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
