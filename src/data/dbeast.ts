/**
 * DBeast: the case study at /projects/dbeast/.
 *
 * Every line comes from the DBeast repository (README, SETUP.md,
 * server.json, pyproject.toml, the workflows and the source):
 * https://github.com/snss10/DBeast
 * The page keeps the same shape and length as the work case studies.
 */
import type { SketchFlow } from '../lib/sketch';

export const dbeast = {
  slug: 'dbeast',
  name: 'DBeast',
  fullName: 'A PostgreSQL MCP server for AI assistants',
  tagline:
    'Gives AI assistants 21 focused tools to inspect a PostgreSQL database, and previews what a write would do instead of running it.',

  facts: [
    { label: 'Status', value: 'Open source, MIT licence' },
    {
      label: 'Works with',
      value: 'Claude, Cursor, Windsurf and VS Code Copilot, on PostgreSQL 12 and later',
    },
    { label: 'Built with', value: 'Python, MCP, asyncpg, Pydantic, sqlglot, Docker' },
  ],

  links: [
    { label: 'Source on GitHub', href: 'https://github.com/snss10/DBeast' },
    { label: 'Watch the demo', href: 'https://youtu.be/NGfHWBe2CGA' },
  ],

  /** MCP directories with a page for DBeast, checked by hand. */
  listings: [
    { name: 'Glama', href: 'https://glama.ai/mcp/servers/snss10/DBeast' },
    { name: 'PulseMCP', href: 'https://www.pulsemcp.com/servers/snss10-dbeast' },
  ],

  /** My write-ups about DBeast on DEV Community. */
  writing: [
    {
      title: 'I built DBeast: a PostgreSQL MCP server that gives AI assistants DBA-level tools',
      href: 'https://dev.to/snss5312/i-built-dbeast-a-postgresql-mcp-server-that-gives-ai-assistants-dba-level-tools-229d',
    },
    {
      title: 'Preventing context bloat and agent loops in database MCP servers',
      href: 'https://dev.to/snss5312/preventing-context-bloat-and-agent-loops-in-database-mcp-servers-3o43',
    },
    {
      title: 'SQL access gives AI the data. DBeast gives it the investigation.',
      href: 'https://dev.to/snss5312/sql-access-gives-ai-the-data-dbeast-gives-it-the-investigation-gip',
    },
  ],

  overview:
    'DBeast connects AI assistants such as Claude, Cursor, Windsurf and VS Code Copilot to PostgreSQL through the Model Context Protocol. Instead of one broad “execute SQL” escape hatch, it gives them 21 focused tools for schema discovery, safe queries, impact analysis, performance, security, maintenance, replication and data quality.',

  flow: {
    label:
      'An AI assistant calls DBeast over MCP; DBeast checks each query, runs reads against PostgreSQL through asyncpg, and answers writes with an impact preview instead of running them.',
    steps: [
      { title: 'AI assistant', sub: 'Claude, Cursor' },
      { title: 'DBeast', sub: '21 tools' },
      { title: 'Query check', sub: 'reads run, writes don’t' },
      { title: 'PostgreSQL', sub: 'local, RDS, Neon' },
    ],
    edges: ['MCP (stdio)', null, 'asyncpg'],
    notes: [
      { at: 1, text: 'runs locally, nothing to host' },
      { at: 2, text: 'writes get a preview, never run', side: 'below' },
    ],
    seed: 52,
  } satisfies SketchFlow,

  steps: [
    {
      title: 'Connect',
      detail:
        'The assistant starts DBeast as a local subprocess and passes the database credentials through environment variables. It works with local PostgreSQL, AWS RDS and Aurora, Supabase, Neon and other hosts.',
    },
    {
      title: 'Inspect',
      detail:
        'Focused tools return schemas and ERDs, slow queries, security and maintenance reports, replication status and data-quality checks, all in one response shape.',
    },
    {
      title: 'Read',
      detail: 'SELECT queries run with a row limit added automatically.',
    },
    {
      title: 'Preview writes',
      detail:
        'INSERT, UPDATE and DELETE are never run. DBeast returns an impact preview instead: the rows affected, a risk level from safe to critical, and rollback SQL for a DELETE. DROP and TRUNCATE report what they would affect.',
    },
    {
      title: 'Log',
      detail:
        'Every tool call is written to a daily audit log, with passwords, secrets and tokens masked.',
    },
  ],
};
