/**
 * /llms.txt: a plain-text summary of the site for AI assistants and
 * AI search (see llmstxt.org). Built from the same data as the pages.
 */
import type { APIRoute } from 'astro';
import { site } from '../data/site';
import { workProjects, sideProjects } from '../data/projects';
import { roles, employer, education, certifications } from '../data/experience';
import { skillGroups } from '../data/skills';

export const GET: APIRoute = ({ site: base }) => {
  const url = (path: string) => new URL(path, base).href;
  const lines = [
    `# ${site.name}`,
    '',
    `> ${site.name} is an ${site.role} in ${site.location}, working as a ${site.currentTitle} at ${site.company} and building agent systems with LangGraph, MCP, RAG and FastAPI.`,
    '',
    '## Case studies (work at Ideyalabs)',
    '',
    ...workProjects.map(
      (p) => `- [${p.name}](${url(`/work/${p.slug}/`)}): ${p.fullName}. ${p.summary}`,
    ),
    '',
    '## Side projects',
    '',
    ...sideProjects.map((p) => {
      const href = p.caseStudy ? url(p.caseStudy) : p.links[0]?.href;
      const label = p.license ? `open source, ${p.license}` : 'private code';
      return `- [${p.name}](${href}): ${p.kind} (${label}). ${p.description}`;
    }),
    '',
    `## Experience at ${employer.name}, ${employer.location}`,
    '',
    ...roles.map((r) => `- ${r.title} (${r.period}): ${r.summary}`),
    '',
    '## Education',
    '',
    `- ${education.degree}, ${education.school} (${education.period}), ${education.grade}`,
    '',
    '## Certifications',
    '',
    ...certifications.map((c) => `- ${c.name}, ${c.issuer}: ${c.href}`),
    '',
    '## Skills',
    '',
    ...skillGroups.map((g) => `- ${g.name}: ${g.skills.join(', ')}`),
    '',
    '## Contact',
    '',
    `- Email: ${site.email}`,
    `- LinkedIn: ${site.links.linkedin}`,
    `- GitHub: ${site.links.github}`,
    `- Resume (PDF): ${url(site.resume)}`,
    '',
  ];
  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
