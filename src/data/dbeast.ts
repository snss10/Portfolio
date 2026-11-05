/**
 * DBeast: the case study at /projects/dbeast/.
 *
 * Every line comes from the DBeast repository (README, SETUP.md,
 * server.json, pyproject.toml, the workflows and the source):
 * https://github.com/snss10/DBeast
 */
import type { SketchFlow } from '../lib/sketch';

export const dbeast = {
  slug: 'dbeast',
  name: 'DBeast',
  fullName: 'A PostgreSQL MCP server for AI assistants',
  tagline:
    'Gives AI assistants 21 focused tools to inspect a PostgreSQL database, and previews what a write would do instead of running it.',

  facts: [
    { label: 'When', value: '2 – 10 June 2026' },
    { label: 'Status', value: 'Open source, MIT licence' },
    {
      label: 'Works with',
      value: 'Claude, Cursor, Windsurf and VS Code Copilot, on PostgreSQL 12 and later',
    },
    {
      label: 'Built with',
      value: 'Python, MCP, asyncpg, Pydantic, sqlglot, Docker',
    },
  ],

  links: [
    { label: 'Source on GitHub', href: 'https://github.com/snss10/DBeast' },
    { label: 'Watch the demo', href: 'https://youtu.be/NGfHWBe2CGA' },
  ],

  /** MCP directories with a page for DBeast, checked by hand. */
  listings: [
    { name: 'Glama', href: 'https://glama.ai/mcp/servers/snss10/DBeast' },
    { name: 'PulseMCP', href: 'https://www.pulsemcp.com/servers/snss10-dbeast' },
    { name: 'MCP Servers', href: 'https://mcpservers.org/servers/snss10/dbeast' },
    { name: 'Claude Marketplaces', href: 'https://claudemarketplaces.com/mcp/snss10/dbeast' },
    { name: 'Claude Plugin Hub', href: 'https://www.claudepluginhub.com/plugins/snss10-dbeast' },
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

  overview: [
    'DBeast connects AI assistants such as Claude, Cursor, Windsurf and VS Code Copilot to PostgreSQL through the Model Context Protocol. Instead of one broad “execute SQL” escape hatch, it gives them 21 focused tools for schema discovery, safe queries, impact analysis, performance, security, maintenance, replication and data quality.',
    'It runs as a local stdio MCP server: the assistant starts it as a subprocess and passes the database credentials through environment variables. There is no HTTP service and nothing extra to host.',
    'In the demo, Claude uses DBeast to audit a PostgreSQL database, find security and maintenance risks, and preview the impact of a cleanup without running any destructive SQL.',
  ],

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

  safety: [
    'SELECT queries run with a row limit added automatically (100 rows by default).',
    'INSERT, UPDATE and DELETE are never run. DBeast returns an impact preview instead.',
    'DROP and TRUNCATE are never run either. DBeast reports the objects they would affect and the risk.',
    'When a plan needs EXPLAIN ANALYZE on a write, it runs inside a transaction that is always rolled back.',
  ],

  impact: [
    'Counts the rows a write would touch, and what share of the table that is.',
    'Scores the risk from 0 to 100: no WHERE clause, a large share of the table (50% and 90% thresholds), mass deletes (100 rows or more) and updates (1,000 rows or more), and rows that ON DELETE CASCADE would reach in other tables.',
    'Labels the result safe, cautious, dangerous or critical. The thresholds are settings.',
    'For a DELETE, it also drafts rollback SQL from a sample of the rows.',
  ],

  audit: [
    'Every tool call is logged to a daily Markdown file: time, tool, duration, parameters, the response (truncated) and any error.',
    'Passwords, secrets, tokens, API keys and passwords inside connection strings are masked before anything is written.',
  ],

  connecting: [
    'A DATABASE_URL, separate DB_* variables, or AWS Secrets Manager, set in the client’s config or at runtime with connect().',
    'Local PostgreSQL and Docker (with discovery), AWS RDS and Aurora (directly, over an SSH tunnel or through Secrets Manager), Supabase, Neon, Railway, Render, Fly.io, or any standard PostgreSQL URL.',
    'Schema lookups are cached for 60 seconds by default, and query timeouts are configurable.',
  ],

  engineering: [
    '147 tests with pytest and pytest-asyncio, plus Ruff linting and formatting and mypy type checks in CI.',
    'CodeQL security analysis every week, pre-commit hooks and Dependabot updates.',
    'Published as a Docker image on GHCR and listed on the official MCP Registry as io.github.snss10/dbeast, with plugin manifests for Claude Code and Cursor.',
    'Responses share one shape (success, data and meta), so an assistant can rely on the format.',
  ],

  stack: [
    { layer: 'Server', tools: 'Python 3.11+, MCP Python SDK (stdio), asyncpg' },
    { layer: 'Models', tools: 'Pydantic 2, pydantic-settings' },
    { layer: 'SQL analysis', tools: 'sqlglot (PostgreSQL dialect)' },
    { layer: 'AWS', tools: 'boto3 for Secrets Manager' },
    { layer: 'Delivery', tools: 'Docker, GHCR, MCP Registry, GitHub Actions' },
    { layer: 'Quality', tools: 'pytest, Ruff, mypy, bandit, pre-commit, CodeQL, Dependabot' },
  ],
};
