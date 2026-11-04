/** Skills, grouped like the resume, plus what the side projects use. */

export const skillGroups = [
  {
    name: 'Agentic AI & LLMs',
    skills: [
      'LangGraph',
      'LangChain',
      'MCP (FastMCP)',
      'Anthropic Claude API',
      'OpenAI API',
      'Multi-agent orchestration',
      'Tool calling',
      'Multi-turn agent loops',
      'Prompt engineering',
      'Prompt caching',
      'Guardrails',
      'Local LLMs (LLamaSharp, GGUF)',
    ],
  },
  {
    name: 'Backend',
    skills: [
      'Python',
      'SQL',
      'FastAPI',
      'Async services',
      'REST APIs',
      'Pydantic',
      'SQLAlchemy',
      'Socket.IO / WebSockets',
    ],
  },
  {
    name: 'Retrieval & data',
    skills: ['RAG', 'Pinecone', 'FAISS', 'PostgreSQL', 'MongoDB', 'Supabase'],
  },
  {
    name: 'Frontend',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'three.js', 'TanStack Query'],
  },
  {
    name: 'Documents & CAD',
    skills: ['Azure Document Intelligence', 'OpenCascade (OCP)', 'pdfplumber', 'PDFium'],
  },
  {
    name: 'Automation & testing',
    skills: ['Playwright', 'Tavily', 'pytest'],
  },
  {
    name: 'Cloud & delivery',
    skills: [
      'Docker',
      'Git',
      'GitHub Actions (CI/CD)',
      'Google Cloud Run Jobs',
      'AWS (RDS, S3, CloudWatch)',
      'Vercel',
    ],
  },
  {
    name: 'Mobile & desktop',
    skills: ['Kotlin (Android)', 'C# / .NET', 'WPF'],
  },
] as const;
