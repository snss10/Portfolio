/**
 * vFABit: the case study at /projects/vfabit/.
 *
 * Every line here comes from the vFABit project reference. The product has not
 * launched, so the page says so plainly and claims no customers, orders or revenue.
 */
import type { SketchFlow } from '../lib/sketch';

export const vfabit = {
  slug: 'vfabit',
  name: 'vFABit',
  fullName: 'A marketplace for custom machined parts',
  tagline:
    'Customers upload drawings and 3D models, a team routes each request to shops that can make the part, and payment is split 30/70 around the customer’s audit of the finished job.',

  facts: [
    { label: 'When', value: '8 Sep – 27 Oct 2026, about seven weeks' },
    { label: 'Status', value: 'Not launched; running as a hosted test version' },
    { label: 'For', value: 'Companies ordering parts, fabrication shops and an operations team' },
    {
      label: 'Built with',
      value: 'Python, FastAPI, PostgreSQL, React, TypeScript, three.js, OpenCascade, Kotlin',
      wide: true,
    },
  ],

  overview: [
    'vFABit connects companies that need custom machined parts with fabrication shops that can make them. A customer uploads PDF drawings and optional STEP models, the operations team sends the request to shops it picks from those that fit, the shops quote, and the customer pays in two parts, checking the finished job before paying the balance.',
    'It is a React and TypeScript site, a FastAPI API with about 120 routes, a CAD analysis service and an Android app, covered by 915 automated tests.',
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
    'The catalogue has 11 processes, 3 precision bands, 35 size bands, 56 materials and 7 heat-treatment methods.',
  ],

  scanFlow: {
    label:
      'A STEP file becomes a 3D model first; the exact geometry is then analysed, and every result carries its unit, source and status.',
    steps: [
      { title: 'STEP upload', sub: 'exact geometry' },
      { title: '3D model first', sub: 'GLB in seconds' },
      { title: 'Analyse', sub: 'size, holes, pockets' },
      { title: 'Results', sub: 'unit, source, status' },
    ],
    notes: [
      { at: 1, text: 'turn it while measuring runs', side: 'above' },
      { at: 3, text: 'undetermined, never guessed', side: 'below' },
    ],
    seed: 41,
  } satisfies SketchFlow,

  scan: [
    'Reads STEP files as exact geometry with OpenCascade and reports bounding box, volume, surface area, validity and assembly structure.',
    'Finds through and blind holes, closed pockets, sheet thickness and bends, plus tolerance data when the file carries it (AP242 PMI).',
    'Every value carries its unit, source and status. What the geometry can’t establish is reported as undetermined, never guessed.',
    'The 3D model (GLB) is made first, in seconds, so people can turn it while measuring continues. Scans have taken over an hour.',
    'The geometry libraries come to about 575 MB, so the scan runs as a separate Cloud Run Job that shares only database tables and the file store with the API, and no code.',
    'A database queue handles recovery: a lost start is picked up again, and a stuck scan is failed with its reason. Results carry an engine version, so older ones can be redone.',
    'In the three.js viewer, a clicked triangle finds its CAD face by binary search.',
  ],

  drawings: [
    'Reads engineering drawings by rules, with no outside AI or OCR service.',
    'Sorts each page as real text, AutoCAD’s hidden text, a scanned picture or text drawn as lines. This version reads the first two kinds.',
    'Extracts title blocks, numbered notes, tables and callouts: sizes, tolerances, fits, threads, holes, radii, chamfers, angles, roughness and feature control frames.',
    'Works out limits from ISO 286 (fits), ISO 2768 (general tolerances) and ISO 965 (threads).',
    'Shows numbered balloons on the page beside a filterable list. It has been tested on sample drawings, not yet on real customers’ drawings.',
  ],

  engineering: [
    {
      title: 'Architecture',
      points: [
        'Three services in three repositories (a JSON API, a React site and a CAD analysis service), plus an Android app.',
        'Business rules live in a pure domain package (2,607 lines, strict typing) that imports no framework, database or settings code.',
        'The payment gateway, email, storage and notifications are swappable drivers, chosen in one place. Site types are generated from the API’s OpenAPI schema.',
      ],
    },
    {
      title: 'Payments and concurrency',
      points: [
        'A signed webhook is the only way to settle an order, with duplicate-safe handling, amount checks and reconciliation.',
        'Every action on an order holds a row lock. A double tap, a second tab or a second shop waits, then is decided on the new state.',
        'An order can’t be placed twice and its emails can’t go out twice. Tests send these actions at the same moment.',
      ],
    },
    {
      title: 'Files',
      points: [
        'Files run to 50 MB but Vercel allows 4.5 MB per request, so the browser uploads directly to private storage with a short-lived token the API signs for one file name.',
        'The server then refuses any file that isn’t the format its name claims or is incomplete, checking PDF and STEP end markers and PNG checksums, for example.',
        'Downloads go through an access check, then a signed link that lasts an hour.',
      ],
    },
    {
      title: 'Security',
      points: [
        'A three-pass audit in October 2026 covered all three codebases, dependencies, git history, database exposure, the hosted site and DNS: 42 findings, 3 of them high.',
        'One was a race: 12 wrong passwords sent at once were all checked against a limit of 5. Postgres advisory locks now count each guess before the next is read, and the tests fail if the fix is removed.',
        'Argon2 password hashing, authenticator apps for staff, row-level security on every table, a __Host- session cookie, a Content-Security-Policy, and cross-site writes refused using Sec-Fetch-Site.',
      ],
    },
    {
      title: 'Performance',
      points: [
        'First load is about 132 kB of gzipped JavaScript and 15 kB of CSS. three.js (156 kB) loads only when there is a 3D model.',
        'The 3D view draws 69,000 triangles at 2200×1120 in 1.4 to 2.2 ms a frame on an Intel Iris Xe.',
        'A part’s drawing reads in about 1 s, and a 33-sheet set in about 75 s. Memoizing took hover on a 2,171-callout drawing from over 100 ms to about 23 ms.',
        'SQL statement counts are pinned in tests: the order tracker runs 10 to 12 statements depending on role.',
      ],
    },
    {
      title: 'Phone',
      points: [
        'The site installs as an app, with a service worker and Web Push.',
        'The Android app (1.3.0) is a 669-line Kotlin WebView that signs in through the browser with PKCE, saves downloads, takes photos for uploads and receives Firebase notifications. It ships as a signed APK from the site.',
      ],
    },
    {
      title: 'Practice',
      points: [
        'Work is driven by a spec: 74 normalized requirements and 116 recorded changes.',
        'Undefined requirements fail loudly. Tax invoicing refuses to run until GST is settled, and a test asserts that refusal.',
        'Test-data scripts run through the real API routes, checks and emails, and /health reports a hash of the loaded source to catch a stale server.',
      ],
    },
  ],

  stack: [
    {
      layer: 'API',
      tools:
        'Python 3.13, FastAPI, Pydantic 2, async SQLAlchemy 2, psycopg 3, Alembic, Argon2, structlog',
    },
    {
      layer: 'Site',
      tools:
        'React 19, TypeScript 6, Vite 8, Tailwind CSS 4, React Router 7, TanStack Query 5, React Hook Form, Zod 4, three.js',
    },
    { layer: 'CAD and drawings', tools: 'OCP (OpenCascade), pdfplumber, PDFium, Docker' },
    { layer: 'Android', tools: 'Kotlin, WebView, Gradle, Firebase Cloud Messaging' },
    { layer: 'Data and files', tools: 'PostgreSQL on Supabase, private Vercel Blob' },
    { layer: 'Services', tools: 'Razorpay, ZeptoMail, Google Maps and Places, Web Push' },
    {
      layer: 'Hosting',
      tools:
        'Vercel and Google Cloud Run Jobs (both in Mumbai), Artifact Registry, Secret Manager, keyless OIDC with Workload Identity Federation',
    },
    {
      layer: 'Quality',
      tools: 'pytest, ruff, mypy, tsc, oxlint, bandit, npm audit, GitHub Actions, Dependabot',
    },
  ],
};
