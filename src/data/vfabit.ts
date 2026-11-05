/**
 * vFABit: the case study at /projects/vfabit/.
 *
 * Every line here comes from the vFABit project reference. The product has not
 * launched, so the page says so plainly and claims no customers, orders or revenue.
 * It stays at the level of architecture and decisions: no build dates, route or
 * test counts, or micro-benchmarks.
 */
import type { SketchFlow } from '../lib/sketch';

export const vfabit = {
  slug: 'vfabit',
  name: 'vFABit',
  fullName: 'A marketplace for custom machined parts',
  tagline:
    'Customers upload drawings and 3D models, a team routes each request to shops that can make the part, and payment is split 30/70 around the customer’s audit of the finished job.',

  facts: [
    { label: 'Status', value: 'Not launched; running as a hosted test version' },
    { label: 'For', value: 'Companies ordering parts, fabrication shops and an operations team' },
    { label: 'My part', value: 'The architecture and the order flow' },
    {
      label: 'Built with',
      value: 'Python, FastAPI, PostgreSQL, React, TypeScript, three.js, OpenCascade',
    },
  ],

  overview: [
    'vFABit connects companies that need custom machined parts with fabrication shops that can make them. A customer uploads PDF drawings and optional STEP models, the operations team sends the request to shops it picks from those that fit, the shops quote, and the customer pays in two parts, checking the finished job before paying the balance.',
    'I designed its architecture and the order flow. It is made of three services: a FastAPI API, a React site and a separate CAD analysis service, all covered by automated tests.',
    'The first version’s screens and workflows are built and running as a hosted test version. It has not launched, so there are no real customers, orders or money yet, and payments on the test version run through a built-in simulator.',
  ],

  orderFlow: {
    label:
      'An order moves through eleven stages: created, quotes, placement, 30% advance, in queue, in process, inspection, customer audit, 70% balance, shipped and delivered.',
    steps: [
      { title: 'Order created', sub: 'drawings, 3D models' },
      { title: 'Quotes', sub: 'team picks shops' },
      { title: 'Placement', sub: 'customer compares' },
      { title: '30% advance', sub: 'card or UPI link' },
      { title: 'In queue', sub: 'advance releases job' },
      { title: 'In process', sub: 'shop makes the part' },
      { title: 'Inspection', sub: 'job report due' },
      { title: 'Customer audit', sub: 'accept or reject' },
      { title: '70% balance', sub: 'report accepted' },
      { title: 'Shipped', sub: 'balance arrived' },
      { title: 'Delivered', sub: 'rated out of 5' },
    ],
    notes: [
      { at: 0, text: 'no stage moves backwards' },
      { at: 9, text: 'nothing ships unpaid' },
      { at: 10, text: 'only the customer confirms' },
    ],
    perRow: 4,
    seed: 23,
  } satisfies SketchFlow,

  rules: [
    'Nothing ships unpaid, and no stage moves backwards. Only the customer can confirm delivery.',
    'A customer can move a request’s dates or withdraw it until the order is placed.',
    'Customers and shops deal with each other only through the platform. A shop appears by code and rating, and messages show roles, not names.',
    'Contact details are removed from messages between the two sides before they’re stored, and each removal is logged.',
    'A platform fee is added on top of the shop’s price, so the customer sees one price.',
  ],

  matching: [
    'Process and precision must match exactly. Minor operations, material, heat treatment and finishing narrow the list only when the request asks for them.',
    'Matching suggests the shops that fit, and the team decides who receives the request.',
  ],

  /** The design decisions, each with the reason behind it. */
  decisions: [
    {
      title: 'A separate service for CAD analysis',
      why: 'The geometry libraries are too large and slow to live inside the API, so analysis runs as its own Cloud Run Job. It shares only the database and the file store with the API, and no code.',
    },
    {
      title: 'Uploads go straight to storage',
      why: 'Drawings and 3D models can be far larger than Vercel accepts in one request, so the browser uploads directly to private storage with a short-lived token the API signs for one file name. The server checks each file afterwards.',
    },
    {
      title: 'A lock on every order action',
      why: 'A double tap, a second tab or a second shop acting on the same order waits for the lock, then is decided on the new state, so an order can’t move twice.',
    },
    {
      title: 'One way to mark an order paid',
      why: 'Only a signed payment webhook can settle an order, with duplicate-safe handling, amount checks and reconciliation. Nothing else can mark it paid.',
    },
    {
      title: 'Business rules in a pure domain package',
      why: 'The rules import no framework, database or settings code, so they can be tested on their own. The payment gateway, email, storage and notifications are swappable drivers chosen in one place.',
    },
  ],

  scanFlow: {
    label:
      'A STEP file becomes a 3D model first; the exact geometry is then analysed, and every result carries its unit, source and status.',
    steps: [
      { title: 'STEP upload', sub: 'exact geometry' },
      { title: '3D model first', sub: 'ready to view' },
      { title: 'Analyse', sub: 'size, holes, pockets' },
      { title: 'Results', sub: 'unit, source, status' },
    ],
    notes: [
      { at: 1, text: 'turn it while measuring runs', side: 'above' },
      { at: 3, text: 'undetermined, never guessed', side: 'below' },
    ],
    seed: 41,
  } satisfies SketchFlow,

  cad: [
    'STEP files are read as exact geometry with OpenCascade: size, volume, holes, pockets, sheet thickness, and tolerance data when the file carries it.',
    'The 3D model is made first, so people can turn it while measuring continues. Every result carries its unit, source and status, and what the geometry can’t establish is reported as undetermined, never guessed.',
    'A database queue handles recovery: a lost start is picked up again, and a stuck scan is failed with its reason.',
    'PDF drawings are read by rules, with no outside AI or OCR service: title blocks, notes, tables and callouts appear as numbered balloons beside the drawing. This is a beta for the operations team, tested on sample drawings so far.',
  ],

  engineering: [
    {
      title: 'Architecture',
      points: [
        'Three services in three repositories: a JSON API, a React site and the CAD analysis service.',
        'The site’s types are generated from the API’s OpenAPI schema, so the two can’t drift apart.',
      ],
    },
    {
      title: 'Payments and concurrency',
      points: [
        'An order can’t be placed twice and its emails can’t go out twice. Tests send these actions at the same moment.',
      ],
    },
    {
      title: 'Files',
      points: [
        'The server refuses any file that isn’t the format its name claims or is incomplete, checking PDF and STEP end markers and PNG checksums, for example.',
        'Downloads go through an access check, then a signed link that expires.',
      ],
    },
    {
      title: 'Security',
      points: [
        'A three-pass security audit covered all three codebases, dependencies, git history, database exposure, the hosted site and DNS.',
        'It found a sign-in race: wrong passwords sent at the same moment could all be checked before the attempt limit counted any of them. Postgres advisory locks now count each attempt before the next is read, and a test fails if the fix is removed.',
        'Argon2 password hashing, authenticator apps for staff, row-level security on every table, a __Host- session cookie, a Content-Security-Policy, and cross-site writes refused using Sec-Fetch-Site.',
      ],
    },
    {
      title: 'Performance',
      points: [
        'three.js loads only when there is a 3D model to show, so most pages stay light.',
        'The number of SQL statements per request is pinned in tests, so a change that adds queries fails the build.',
      ],
    },
    {
      title: 'Practice',
      points: [
        'Work is driven by a written spec, with every requirement and change recorded.',
        'Undefined requirements fail loudly. Tax invoicing refuses to run until GST is settled, and a test asserts that refusal.',
        'Test-data scripts run through the real API routes, checks and emails, and /health reports a hash of the loaded source to catch a stale server.',
      ],
    },
  ],

  stack: [
    {
      layer: 'API',
      tools: 'Python, FastAPI, Pydantic, async SQLAlchemy, psycopg, Alembic, Argon2, structlog',
    },
    {
      layer: 'Site',
      tools: 'React, TypeScript, Vite, Tailwind CSS, React Router, TanStack Query, Zod, three.js',
    },
    { layer: 'CAD and drawings', tools: 'OpenCascade (OCP), pdfplumber, PDFium, Docker' },
    { layer: 'Data and files', tools: 'PostgreSQL on Supabase, private Vercel Blob' },
    { layer: 'Services', tools: 'Razorpay, ZeptoMail, Google Maps and Places, Web Push' },
    {
      layer: 'Hosting',
      tools:
        'Vercel and Google Cloud Run Jobs, Artifact Registry, Secret Manager, keyless OIDC with Workload Identity Federation',
    },
    {
      layer: 'Quality',
      tools: 'pytest, ruff, mypy, tsc, oxlint, bandit, npm audit, GitHub Actions, Dependabot',
    },
  ],
};
