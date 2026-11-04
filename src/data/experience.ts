/** Roles, education and certifications. */

export interface Role {
  title: string;
  period: string;
  summary: string;
  /** Slugs from workProjects, linked from the timeline. */
  projects: string[];
  current?: boolean;
}

export const employer = {
  name: 'Ideyalabs Tech LLP',
  location: 'Hyderabad',
  period: 'Jun 2024 – Present',
};

export const roles: Role[] = [
  {
    title: 'Software Engineer',
    period: 'Jul 2026 – Present',
    current: true,
    summary:
      'Building a logistics document-intelligence pipeline and the async FastAPI services behind a client portal, while helping move legacy TruckMate/.NET systems to Python.',
    projects: ['apex-mydaylight'],
  },
  {
    title: 'Associate Software Engineer',
    period: 'Jan 2025 – Jun 2026',
    summary:
      'Built the LangGraph orchestration for an agentic product-planning platform, and owned the FastAPI and LangGraph backend of an agent-driven delivery platform using MCP, Claude and OpenAI.',
    projects: ['po-agent', 'eco-online'],
  },
  {
    title: 'Software Engineering Intern',
    period: 'Jun 2024 – Dec 2024',
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
  {
    name: 'Python',
    issuer: 'IBM',
    href: 'https://courses.etrain.skillsnetwork.site/certificates/683ab2e940f74506bb19c97caf78d17f',
  },
];
