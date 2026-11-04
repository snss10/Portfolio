# S Naga Surya · Portfolio

Personal site of **S Naga Surya**, AI / Backend Engineer building agentic systems with LangGraph, MCP,
RAG and FastAPI. Live at **https://nagasurya.com**.

![Preview of the portfolio](public/og/home.png)

- **A whiteboard, in colour:** a pure white board, marker black for text, and four marker colours.
  Blue is for actions and links, and every project has its own colour that follows it from the
  home-page diagram to its card, the experience timeline and its case study. Dark mode is a graphite
  board.
- **Hand-drawn system diagrams:** each project is explained with a whiteboard-style diagram that draws
  itself when the page opens. The boxes on the home page are links to the case studies. The drawings
  are generated at build time with [rough.js](https://roughjs.com), so the site ships no drawing code.
- **Everything connected:** a sticky header with the section in view marked, breadcrumbs and an
  "On this page" index on case studies, previous/next links, and a footer that links every page.
- **Static and fast:** built with [Astro](https://astro.build), a few KB of JavaScript, no UI
  framework. Works without JavaScript too.
- **Accessible:** passes an axe-core WCAG 2.2 AA scan on every page, in both themes, on desktop and
  mobile. Respects reduced motion.
- **Found and shared:** canonical URLs, Open Graph and X cards with a preview image for every page,
  JSON-LD (Person, WebSite, ProfilePage, breadcrumbs), sitemap, `robots.txt`, `llms.txt`, a web app
  manifest, and favicons for every browser.

## Run it locally

Needs Node.js 22.23.4 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:4321.

## Update your content

Everything visitors read lives in `src/data/`. You never need to touch layout code to change it.

| What                                   | Where                                                       |
| -------------------------------------- | ----------------------------------------------------------- |
| Name, email, links, page title, nav    | `src/data/site.ts`                                          |
| Intro text and the home-page diagram   | `intro` and `lifecycle` in `src/data/site.ts`               |
| Work case studies (Ideyalabs projects) | `workProjects` in `src/data/projects.ts`                    |
| Side projects (vFABit, DBeast, ...)    | `sideProjects` in `src/data/projects.ts`                    |
| vFABit case study                      | `src/data/vfabit.ts`                                        |
| Roles, education, certifications       | `src/data/experience.ts` (the timeline reads `start`/`end`) |
| Skills                                 | `src/data/skills.ts`                                        |
| Resume PDF                             | Replace `public/S-Naga-Surya-Resume.pdf` (keep the name)    |

**Adding a case study:** add an object to `workProjects`, with a `tone` (`blue`, `green`, `orange` or
`violet`). Its page at `/work/<slug>/` is created automatically, and it appears on the home page, in
the footer and in `llms.txt`. Then run `npm run images` to create its preview image.

**Editing a diagram:** a project's diagram is built from its `flow` steps. `title` and the short
handwritten `sub` go inside each box (keep `sub` under about 20 characters), `edges` labels the arrows
in order (`null` for none), and `notes` are the handwritten comments that point at a step. A step
with an `href` becomes a link. Flows with more than four steps wrap onto two rows automatically, and
phones get a vertical layout.

## Domain and deploys

The site is built for `https://nagasurya.com`, set in `astro.config.mjs`. Link previews, canonical URLs
and the sitemap all use it. A `SITE_URL` environment variable overrides it if you ever need to.

It is hosted on **Vercel**, with the domain registered at **Hostinger**. Build settings, caching and
security headers live in `vercel.json`. Every push to `main` is checked and then deployed by GitHub
Actions.

**Step-by-step guide: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)**. It covers the first deploy, adding
`nagasurya.com`, the Hostinger DNS records, deploys from GitHub Actions, an HTTPS checklist for
"Not secure" warnings, and getting the site into Google Search Console.

## Scripts

| Command           | What it does                                                              |
| ----------------- | ------------------------------------------------------------------------- |
| `npm run dev`     | Local dev server with live reload                                         |
| `npm run build`   | Production build into `dist/`                                             |
| `npm run preview` | Serve the production build locally                                        |
| `npm run check`   | Type-check all Astro and TypeScript files                                 |
| `npm run format`  | Format everything with Prettier                                           |
| `npm run images`  | Regenerate preview images, app icons and `favicon.ico` (needs Playwright) |

`npm run images` renders the cards in `src/pages/og/` with a headless browser. Install it once with
`npm i -D playwright && npx playwright install chromium`. The logo lives in
`src/components/Logo.astro`, and `public/favicon.svg` is the same drawing.

## Project structure

```text
src/
  data/        Content: site.ts, projects.ts, vfabit.ts, experience.ts, skills.ts
  components/  Header, Hero, Glance, WorkCards, SideProjects, Experience, Skills, Contact,
               Footer, case-study parts (CaseHeader, Toc, CasePager), Logo, Icon, Sketch
  lib/         sketch.ts (flow → hand-drawn SVG at build time), schema.ts (JSON-LD)
  layouts/     BaseLayout.astro: <head>, SEO tags, header and footer
  pages/       index.astro, work/[slug].astro, projects/vfabit.astro, 404.astro,
               robots.txt.ts, llms.txt.ts, og/[slug].astro (preview cards, built by `npm run images`)
  styles/      global.css: colours, type scale, shared components and diagram animation
public/        Resume PDF, favicons, app icons, web manifest, preview images
scripts/       generate-images.mjs
```

CI (`.github/workflows/ci.yml`) checks formatting, types and the build on every push and pull request,
then deploys `main` to Vercel.
