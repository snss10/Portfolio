/**
 * Skills, taken from the resume's skills list.
 *
 * `coreSkills` are the ones I use most. Each lists the stack names (from
 * projects.ts) that count as using it, and the site links every project that
 * did, so each claim comes with its evidence. `otherSkills` is the rest of
 * the resume's list, shown as one plain line.
 */

export interface CoreSkill {
  name: string;
  /** Names in a project's `stack` that mean the project used this skill. */
  match: string[];
}

export const coreSkills: CoreSkill[] = [
  { name: 'Python', match: ['Python'] },
  { name: 'LangGraph', match: ['LangGraph'] },
  { name: 'MCP', match: ['MCP', 'FastMCP'] },
  { name: 'FastAPI', match: ['FastAPI'] },
  { name: 'RAG', match: ['RAG', 'Pinecone'] },
  { name: 'Claude and OpenAI APIs', match: ['Anthropic Claude', 'OpenAI'] },
  { name: 'PostgreSQL', match: ['PostgreSQL', 'asyncpg'] },
  { name: 'Playwright', match: ['Playwright'] },
  { name: 'Azure Document Intelligence', match: ['Azure Document Intelligence'] },
];

export const otherSkills = [
  'LangChain',
  'prompt caching',
  'guardrails',
  'Pinecone',
  'FAISS',
  'MongoDB',
  'Supabase',
  'SQL',
  'Pydantic',
  'Socket.IO',
  'Tavily',
  'pytest',
  'Docker',
  'Git',
  'GitHub Actions',
  'Google Cloud Run Jobs',
  'AWS (RDS, S3, CloudWatch)',
  'React',
];
