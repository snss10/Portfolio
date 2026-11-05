/**
 * Identity, contact links, navigation, the words at the top of the home page,
 * and SEO defaults. Everything visitors read lives in src/data/, so updating
 * the site (new role, new project, new link) never means touching layout code.
 */
import type { SketchFlow } from '../lib/sketch';

export const site = {
  name: 'S Naga Surya',
  /** How people refer to me; also the site's name in search results. */
  shortName: 'Naga Surya',
  role: 'AI / Backend Engineer',
  currentTitle: 'Software Engineer',
  company: 'Ideyalabs Tech LLP',
  companyShort: 'Ideyalabs',
  location: 'Hyderabad, India',
  email: 'nagasaisurya4@gmail.com',

  /** File in /public. Replace it whenever your resume changes (keep the name). */
  resume: '/S-Naga-Surya-Resume.pdf',

  links: {
    github: 'https://github.com/snss10',
    linkedin: 'https://www.linkedin.com/in/naga-surya-s-6020a5267',
    source: 'https://github.com/snss10/Portfolio',
  },

  seo: {
    title: 'S Naga Surya | AI / Backend Engineer in Hyderabad',
    description:
      'S Naga Surya is a backend engineer in Hyderabad building agent systems with LangGraph, MCP, RAG and FastAPI. Case studies, side projects and resume.',
    keywords: [
      'S Naga Surya',
      'Naga Surya',
      'AI Engineer',
      'Backend Engineer',
      'Agentic AI',
      'LangGraph',
      'Model Context Protocol',
      'RAG',
      'FastAPI',
      'Python',
      'Hyderabad',
    ],
  },
} as const;

/** Sections of the home page, in order. The header and footer both use this. */
export const nav = [
  { id: 'work', label: 'Work' },
  { id: 'projects', label: 'Side projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
] as const;

/** The top of the home page. */
export const intro = {
  headline: 'I build agent systems that plan products, ship code and test it against live apps.',
  now: 'Right now I’m building document AI and the backend of a client portal for a logistics business.',
};

/**
 * The drawing at the top of the home page: how the systems I worked on
 * connect. Each box links to its case study and is drawn in its project's ink.
 */
export const lifecycle: SketchFlow = {
  label:
    'How my work connects: Eco Online combines PO Agent, which plans the product, with ITAF, which tests the live app after deployment. Each box links to its case study.',
  steps: [
    {
      title: 'PO Agent',
      sub: 'plans the product',
      tone: 'blue',
      href: '/work/po-agent/',
    },
    {
      title: 'Eco Online',
      sub: 'runs the delivery',
      tone: 'red',
      href: '/work/eco-online/',
    },
    {
      title: 'ITAF',
      sub: 'tests the live app',
      tone: 'purple',
      href: '/work/itaf/',
    },
  ],
  edges: [null, 'after deploy'],
  notes: [
    { at: 0, text: 'I built its LangGraph core' },
    { at: 1, text: 'I owned this backend', side: 'below' },
    { at: 2, text: 'built this as an intern' },
  ],
  seed: 11,
};
