/**
 * Identity, contact links, the words at the top of the home page, and SEO defaults.
 * Everything visitors read lives in src/data/, so updating the site (new role,
 * new project, new link) never means touching layout code.
 */
import type { SketchFlow } from '../lib/sketch';

export const site = {
  name: 'S Naga Surya',
  role: 'AI / Backend Engineer',
  currentTitle: 'Software Engineer',
  company: 'Ideyalabs Tech LLP',
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
    title: 'S Naga Surya | AI / Backend Engineer',
    description:
      'Backend engineer in Hyderabad building agent systems that plan products, ship code and test it against live apps, with LangGraph, MCP, RAG and FastAPI.',
    keywords: [
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

/** The top of the home page. */
export const intro = {
  line: 'Backend engineer in Hyderabad. I build agent systems that plan products, ship code and test it against live apps.',
  now: 'Software Engineer at Ideyalabs. Right now I’m building document AI for a logistics client.',
};

/** The diagram under the intro: how the systems I worked on connect. */
export const lifecycle: SketchFlow = {
  label:
    'Eco Online combines PO Agent, which plans the product, with ITAF, which tests the live app after deployment.',
  steps: [
    { title: 'PO Agent', sub: 'plans the product' },
    { title: 'Eco Online', sub: 'runs the delivery' },
    { title: 'ITAF', sub: 'tests the live app' },
  ],
  edges: [null, 'after deploy'],
  notes: [
    { at: 0, text: 'I built its LangGraph core', side: 'above' },
    { at: 1, text: 'I owned this backend', side: 'below' },
    { at: 2, text: 'built this as an intern', side: 'above' },
  ],
  seed: 11,
};
