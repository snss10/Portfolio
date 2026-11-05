/** Roles, education and certifications. */
import type { Tone } from '../lib/sketch';

export interface Role {
  title: string;
  period: string;
  /** First month in the role, as YYYY-MM. Drives the timeline. */
  start: string;
  /** Last month, as YYYY-MM. Leave out for the current role. */
  end?: string;
  /** Colour on the timeline: the colour of the role's main project. */
  tone: Tone;
  summary: string;
  /** Slugs from workProjects, linked from the timeline. */
  projects: string[];
  current?: boolean;
}

export const employer = {
  name: 'Ideyalabs Tech LLP',
  location: 'Hyderabad',
  period: 'Jun 2024 – Present',
  start: '2024-06',
};

/** Whole months from a YYYY-MM month to `to` (default: now, i.e. the build date), counting both ends. */
export const monthsSince = (from: string, to?: string) => {
  const [fy, fm] = from.split('-').map(Number);
  const end = to
    ? to.split('-').map(Number)
    : [new Date().getFullYear(), new Date().getMonth() + 1];
  return (end[0] - fy) * 12 + (end[1] - fm) + 1;
};

export const roles: Role[] = [
  {
    title: 'Software Engineer',
    period: 'Jul 2026 – Present',
    start: '2026-07',
    tone: 'green',
    current: true,
    summary:
      'Building a logistics document-intelligence pipeline and the async FastAPI services behind a client portal, while helping move legacy TruckMate/.NET systems to Python.',
    projects: ['apex-mydaylight'],
  },
  {
    title: 'Associate Software Engineer',
    period: 'Jan 2025 – Jun 2026',
    start: '2025-01',
    end: '2026-06',
    tone: 'blue',
    summary:
      'Built the LangGraph orchestration for an agentic product-planning platform, and owned the FastAPI and LangGraph backend of an agent-driven delivery platform using MCP, Claude and OpenAI.',
    projects: ['po-agent', 'eco-online'],
  },
  {
    title: 'Software Engineering Intern',
    period: 'Jun 2024 – Dec 2024',
    start: '2024-06',
    end: '2024-12',
    tone: 'purple',
    summary:
      'Built an AI testing platform for two enterprise customers that cut manual and automation testing effort by about 60%.',
    projects: ['itaf'],
  },
];

export const education = {
  school: 'KL University',
  location: 'Andhra Pradesh',
  degree: 'B.Tech in Artificial Intelligence & Data Science',
  period: '2021 – 2025',
  grade: 'CGPA 9.62 / 10',
};

export interface Certification {
  name: string;
  issuer: string;
  href: string;
  note?: string;
}

export const certifications: Certification[] = [
  {
    name: 'TensorFlow Developer Certificate',
    issuer: 'Google',
    href: 'https://www.credential.net/d7b4054d-5272-4044-826d-f9240f1c7016',
  },
  {
    name: 'Certified AI Associate',
    issuer: 'Salesforce',
    href: 'https://sforce.co/verifycerts',
    note: 'ID 5591179',
  },
];
