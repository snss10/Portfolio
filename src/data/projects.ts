/**
 * Projects.
 *
 * `workProjects` are the main showcase: systems built at Ideyalabs Tech LLP,
 * in the same order as the resume (current work first). Their code is
 * private, so every claim here mirrors the resume and goes no further.
 *
 * `sideProjects` are personal, open-source projects on GitHub.
 *
 * `flow`, `edges` and `notes` feed the hand-drawn diagram on each case study:
 * `sub` is the short handwritten line inside a box (keep it under ~20
 * characters), `edges` label the arrows, and `notes` are the blue marker
 * comments that point at a box.
 *
 * `tone` is the project's marker colour. It follows the project everywhere:
 * the home-page diagram, its card, the experience timeline and its case study.
 */
import type { SketchNote, Tone } from '../lib/sketch';

export interface Metric {
  value: string;
  label: string;
}

export interface FlowStep {
  title: string;
  sub: string;
  detail: string;
}

export interface WorkProject {
  slug: string;
  name: string;
  tone: Tone;
  fullName: string;
  /** Shown in the work list. */
  period: string;
  role: string;
  rolePeriod: string;
  context?: string;
  current?: boolean;
  /** One plain sentence for the work list. */
  summary: string;
  /** Opening line of the case study. */
  tagline: string;
  metrics: Metric[];
  overview: string[];
  flow: FlowStep[];
  edges?: (string | null)[];
  notes?: SketchNote[];
  built: string[];
  stack: string[];
}

export interface SideProject {
  name: string;
  tone: Tone;
  kind: string;
  description: string;
  facts: string[];
  stack: string[];
  /** Open-source licence; omit for private code. */
  license?: string;
  /** Status line for projects that aren't public releases. */
  status?: string;
  /** A case study on this site, if there is one. */
  caseStudy?: string;
  /** Key numbers shown on the card. */
  stats?: Metric[];
  links: { label: string; href: string }[];
  sketch: {
    label: string;
    steps: { title: string; sub: string }[];
    edges: (string | null)[];
    notes: SketchNote[];
  };
}

export const workProjects: WorkProject[] = [
  {
    slug: 'apex-mydaylight',
    tone: 'green',
    name: 'Apex MyDaylight',
    fullName: 'Logistics client portal and document intelligence',
    period: 'Now',
    role: 'Software Engineer',
    rolePeriod: 'Jul 2026 – Present',
    context: 'A logistics client',
    current: true,
    summary:
      'Reads invoices, shipping labels and Bills of Lading, and serves the APIs behind a logistics client portal.',
    tagline:
      'Classifies invoices, shipping labels and Bills of Lading, and serves the client portal’s shipment and rate-quote APIs.',
    metrics: [],
    overview: [
      'Apex MyDaylight is a client portal for a logistics business moving from legacy TruckMate/.NET systems to Python services. I designed the document-intelligence pipeline that turns invoices, shipping labels and Bills of Lading into structured operational data.',
      'I also build the asynchronous FastAPI services behind the portal’s shipment visibility, rate quotes, accounts and customer-service workflows.',
    ],
    flow: [
      {
        title: 'Classify',
        sub: 'invoice, label, BoL',
        detail:
          'Azure Document Intelligence classifies invoices, shipping labels, Bills of Lading and related logistics documents.',
      },
      {
        title: 'Route',
        sub: 'to the right model',
        detail:
          'Each document type is routed to the right model: custom extraction, fixed-template or prebuilt read.',
      },
      {
        title: 'Structure',
        sub: 'operational data',
        detail:
          'Extracted fields become structured operational data, which also makes historical documents available to new Python workflows.',
      },
      {
        title: 'Serve',
        sub: 'async FastAPI',
        detail:
          'Asynchronous FastAPI services with Pydantic validation power shipment visibility, rate quotes, accounts and customer-service workflows.',
      },
      {
        title: 'Secure',
        sub: 'access, audit logs',
        detail:
          'Role-based access control and audit logging guard integrations with internal logistics systems, on tuned PostgreSQL and AWS.',
      },
    ],
    edges: ['document type', null, null, null],
    notes: [
      { at: 0, text: 'the pipeline I designed' },
      { at: 1, text: 'custom, template or prebuilt', side: 'below' },
    ],
    built: [
      'Designed an Azure Document Intelligence pipeline to classify invoices, shipping labels, Bills of Lading and related logistics documents.',
      'Routed each document type to custom extraction, fixed-template or prebuilt read models to produce structured operational data.',
      'Build asynchronous FastAPI services with Pydantic validation for shipment visibility, rate quotes, accounts and customer-service workflows.',
      'Develop React and Python modules and secure integrations with internal logistics systems, backed by role-based access control and audit logging.',
      'Support modernization from legacy TruckMate/.NET systems to Python services by making historical document data available to new workflows.',
      'Optimize PostgreSQL queries, indexes and connection pooling while supporting AWS-hosted components across RDS, S3 and CloudWatch.',
    ],
    stack: [
      'Python',
      'FastAPI',
      'Pydantic',
      'PostgreSQL',
      'Azure Document Intelligence',
      'AWS',
      'React',
    ],
  },
  {
    slug: 'po-agent',
    tone: 'blue',
    name: 'PO Agent',
    fullName: 'Agentic product-planning platform',
    period: '2025–26',
    role: 'Associate Software Engineer',
    rolePeriod: 'Jan 2025 – Jun 2026',
    summary:
      'Turns a product idea into market research, user stories, a PRD and a phased release plan.',
    tagline:
      'Turns a raw product idea into market research, user stories, PRDs and a phased release plan.',
    metrics: [],
    overview: [
      'PO Agent turns a product idea into a plan. The idea enters a stateful, multi-stage LangGraph workflow that researches the market on the live web, defines the product’s scope, writes the technical documentation and lays out a phased release plan.',
      'I built the foundational orchestration and stateful workflow, and owned the Tavily-powered research stage.',
    ],
    flow: [
      {
        title: 'Idea',
        sub: 'a product idea',
        detail: 'A product idea starts a stateful, multi-stage LangGraph workflow.',
      },
      {
        title: 'Research',
        sub: 'Tavily web search',
        detail:
          'Tavily gathers current market context and evidence from live web sources, producing competitor analysis, expected product workflows and a SWOT analysis.',
      },
      {
        title: 'Scope',
        sub: 'MVP, user stories',
        detail:
          'Research becomes an MVP feature hierarchy with user stories, sub-features, expected behavior and delivery requirements.',
      },
      {
        title: 'Document',
        sub: 'PRD, flowcharts',
        detail: 'The workflow produces PRDs, architecture flowcharts and feature mind maps.',
      },
      {
        title: 'Release',
        sub: 'phased plan',
        detail:
          'Work is sequenced into phased release plans. State is persisted in MongoDB and supports RAG retrieval.',
      },
    ],
    notes: [
      { at: 1, text: 'the research stage I owned' },
      { at: 4, text: 'orchestration I built, end to end' },
    ],
    built: [
      'Built the foundational LangGraph orchestration and stateful workflow for a multi-stage, agentic product-planning platform.',
      'Converted an initial product idea into structured research, product scope, technical documentation and release-planning stages.',
      'Owned a Tavily-enabled research workflow that gathers current market context and supporting evidence from live web sources.',
      'Generated competitor analysis, expected product workflows and SWOT analysis to establish the opportunity and product direction.',
      'Transformed research into MVP feature hierarchies, user stories, sub-features, expected behavior and delivery requirements.',
      'Orchestrated PRDs, architecture flowcharts, feature mind maps and phased release plans; persisted state in MongoDB and supported RAG retrieval.',
    ],
    stack: ['Python', 'LangGraph', 'Tavily', 'MongoDB', 'RAG'],
  },
  {
    slug: 'eco-online',
    tone: 'red',
    name: 'Eco Online',
    fullName: 'Agent-driven software delivery platform',
    period: '2025–26',
    role: 'Associate Software Engineer',
    rolePeriod: 'Jan 2025 – Jun 2026',
    context: 'A client platform',
    summary:
      'Refines Jira tickets, hands implementation to AI coding agents, tracks pull requests through deployment, then runs live tests.',
    tagline:
      'Refines Jira tickets, hands implementation to AI coding agents, tracks pull requests through deployment, and runs live acceptance tests.',
    metrics: [],
    overview: [
      'Eco Online runs the software delivery lifecycle with agents. It combines PO Agent for planning and ITAF for testing: a ticket’s scope and acceptance criteria are refined, implementation goes to AI coding agents, pull requests are tracked through merge and deployment, and ITAF verifies every acceptance criterion against the live build.',
      'I owned the FastAPI and LangGraph backend, including the MCP integrations and the Anthropic Claude and OpenAI tool-calling loops.',
    ],
    flow: [
      {
        title: 'Ingest',
        sub: 'tickets over MCP',
        detail:
          'MCP integrations fetch Jira tickets, acceptance criteria, repository context, pull-request state and deployment information.',
      },
      {
        title: 'Refine',
        sub: 'acceptance criteria',
        detail:
          'Workflows tighten ticket scope and acceptance criteria before any implementation starts.',
      },
      {
        title: 'Build',
        sub: 'AI coding agents',
        detail: 'Implementation tasks are handed to AI coding agents.',
      },
      {
        title: 'Ship',
        sub: 'PR, merge, deploy',
        detail:
          'The platform opens GitHub pull requests and tracks merge and deployment state, with no manual workflow coordination.',
      },
      {
        title: 'Test',
        sub: 'live tests by ITAF',
        detail:
          'After deployment, ITAF generates and runs live tests mapped to each ticket’s acceptance criteria.',
      },
    ],
    edges: ['ticket', 'tasks', null, 'after deploy'],
    notes: [
      { at: 0, text: 'MCP integrations I built' },
      { at: 3, text: 'no manual hand-offs', side: 'below' },
    ],
    built: [
      'Owned the FastAPI and LangGraph backend for a client platform combining PO Agent and ITAF into an agent-monitored delivery lifecycle.',
      'Built MCP integrations to fetch Jira tickets, acceptance criteria, repository context, pull-request state and deployment information.',
      'Created workflows that refine ticket scope and acceptance criteria before passing implementation tasks to AI coding agents.',
      'Orchestrated GitHub pull-request creation and monitored merge and deployment state without requiring manual workflow coordination.',
      'Triggered ITAF after deployment to generate and execute live tests mapped directly to each ticket’s acceptance criteria.',
      'Integrated Anthropic Claude and OpenAI using tool calling, multi-turn loops and prompt caching; stored workflow data in Supabase.',
    ],
    stack: [
      'Python',
      'FastAPI',
      'LangGraph',
      'MCP',
      'Anthropic Claude',
      'OpenAI',
      'Supabase',
      'GitHub',
    ],
  },
  {
    slug: 'itaf',
    tone: 'purple',
    name: 'ITAF',
    fullName: 'Ideyalabs Testing Automation Framework',
    period: '2024',
    role: 'Software Engineering Intern',
    rolePeriod: 'Jun 2024 – Dec 2024',
    context: 'Two enterprise customers',
    summary:
      'Turns Jira stories into browser tests that repair themselves. Cut testing effort by about 60% for two enterprise customers.',
    tagline:
      'Turns Jira stories into self-healing browser tests that run against live applications.',
    metrics: [
      {
        value: 'About 60%',
        label: 'less manual and automation testing effort than conventional regression cycles',
      },
      { value: '2', label: 'enterprise customers' },
    ],
    overview: [
      'ITAF hands regression testing to agents. It reads the Jira story, explores the live application in a headless browser, runs each case through a reasoning-and-action loop, repairs broken steps on its own and explains failures with evidence.',
      'For two enterprise customers it cut the manual and automation testing effort needed by about 60% compared with conventional regression cycles, shifting testers toward validation and audit.',
    ],
    flow: [
      {
        title: 'Understand',
        sub: 'story to test steps',
        detail:
          'LangChain and LangGraph workflows turn Jira user stories and ticket descriptions into executable plain-English test steps.',
      },
      {
        title: 'Explore',
        sub: 'maps the live UI',
        detail:
          'Playwright headless browsers, rendered-screen context and normalized DOM snapshots reveal features and the current UI state.',
      },
      {
        title: 'Execute',
        sub: 'reason-and-act loop',
        detail:
          'Reasoning-and-action loops generate data for each test and run cases sequentially against the live application.',
      },
      {
        title: 'Self-heal',
        sub: 'fixes only what broke',
        detail:
          'When the UI changes, the model repairs only the affected interactive element and keeps the validated test flow intact.',
      },
      {
        title: 'Reuse',
        sub: 'runs become scripts',
        detail:
          'Successful runs become reusable Playwright scripts or English steps, then expand into positive and negative scenarios.',
      },
      {
        title: 'Diagnose',
        sub: 'drift, defect or error',
        detail:
          'Failure analysis separates ticket drift, application defects and unrecoverable errors, with evidence-backed root causes.',
      },
    ],
    notes: [
      { at: 0, text: 'built as an intern' },
      { at: 3, text: 'about 60% less testing effort' },
    ],
    built: [
      'Built an AI testing platform for two enterprise customers, reducing required manual and automation testing effort by about 60% versus conventional regression cycles and shifting testers toward validation and audit.',
      'Developed LangChain and LangGraph workflows that convert Jira user stories and ticket descriptions into executable plain-English test steps.',
      'Used Playwright headless browsers, rendered-screen context and normalized DOM snapshots to discover features and understand the current UI state.',
      'Built reasoning-and-action execution loops with per-test data generation to run test cases sequentially against live applications.',
      'Implemented LLM-powered self-healing that updates only the affected interactive element while preserving the validated test flow.',
      'Converted successful runs into reusable Playwright scripts or English steps and expanded them into positive and negative scenarios.',
      'Added failure analysis for ticket drift, application defects and unrecoverable errors, returning evidence-backed root-cause information.',
      'Built a guarded RAG assistant for ITAF guidance and testing access, using FastMCP for tools and Socket.IO for real-time updates.',
    ],
    stack: [
      'Python',
      'LangGraph',
      'LangChain',
      'Playwright',
      'FastMCP',
      'Socket.IO',
      'Pinecone',
      'PostgreSQL',
      'MongoDB',
    ],
  },
];

export const sideProjects: SideProject[] = [
  {
    name: 'vFABit',
    tone: 'blue',
    kind: 'Marketplace for custom machined parts',
    status: 'Private code. Not launched yet; running as a hosted test version.',
    description:
      'Customers upload drawings and 3D models, an operations team routes each request to shops that can make the part, and payment is split 30/70 around a customer audit of the finished job. It includes an OpenCascade STEP analyser, a rule-based PDF drawing reader, a three.js viewer and an Android app.',
    facts: [
      'An 11-stage order flow for customers, shops and an operations team, covered by 915 automated tests.',
      'STEP files are measured as exact geometry, and anything the geometry can’t establish is reported as undetermined, never guessed.',
      'A three-pass security audit logged 42 findings, including a sign-in race condition that is now fixed and covered by tests.',
    ],
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'React', 'TypeScript', 'three.js', 'OpenCascade'],
    caseStudy: '/projects/vfabit/',
    stats: [
      { value: '915', label: 'automated tests' },
      { value: '11', label: 'order stages' },
      { value: '~120', label: 'API routes' },
    ],
    links: [],
    sketch: {
      label:
        'A customer sends a request with drawings and 3D models; the operations team routes it to shops that fit; the shops quote, make and inspect the part.',
      steps: [
        { title: 'Customer', sub: 'drawings, 3D models' },
        { title: 'Operations team', sub: 'picks fitting shops' },
        { title: 'Shops', sub: 'quote, make, inspect' },
      ],
      edges: ['request', 'RFQ'],
      notes: [{ at: 0, text: 'pays 30%, audits, then 70%', side: 'below' }],
    },
  },
  {
    name: 'DBeast',
    tone: 'green',
    kind: 'PostgreSQL MCP server, Python',
    description:
      'Gives AI assistants like Claude, Cursor and VS Code Copilot 21 focused tools to inspect a PostgreSQL database: schema, slow queries, security, maintenance, replication and data quality. It never runs a write. INSERT, UPDATE and DELETE get an impact preview instead.',
    facts: [
      'Listed on the official MCP Registry, Glama and PulseMCP, with a Docker image on GHCR.',
      'Works with local PostgreSQL, AWS RDS and Aurora, Supabase and Neon.',
      'Keeps an audit log of tool calls, with parameters masked.',
    ],
    stack: ['Python', 'MCP', 'asyncpg', 'Pydantic', 'sqlglot', 'Docker'],
    license: 'MIT',
    caseStudy: '/projects/dbeast/',
    links: [
      { label: 'Source on GitHub', href: 'https://github.com/snss10/DBeast' },
      { label: 'Watch the demo', href: 'https://youtu.be/NGfHWBe2CGA' },
    ],
    sketch: {
      label:
        'An AI assistant talks to DBeast over MCP, and DBeast queries PostgreSQL through asyncpg. Writes are previewed, never run.',
      steps: [
        { title: 'AI assistant', sub: 'Claude, Cursor' },
        { title: 'DBeast', sub: '21 tools' },
        { title: 'PostgreSQL', sub: 'RDS, Supabase, Neon' },
      ],
      edges: ['MCP (stdio)', 'asyncpg'],
      notes: [{ at: 1, text: 'writes get a preview, never run', side: 'below' }],
    },
  },
];

export const getWorkProject = (slug: string) => workProjects.find((p) => p.slug === slug);
