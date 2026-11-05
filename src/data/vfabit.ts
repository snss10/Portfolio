/**
 * vFABit: the case study at /projects/vfabit/.
 *
 * Every line here comes from the vFABit project reference. The product has not
 * launched, so the page says so plainly and claims no customers or orders. It
 * stays at the level of architecture and decisions, with the same shape and
 * length as the work case studies: no build dates, counts or benchmarks.
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
    'vFABit connects companies that need custom machined parts with fabrication shops that can make them. The customer pays in two parts and checks the finished job before paying the balance.',
    'I designed its architecture and the order flow. It is three services: a FastAPI API, a React site and a separate CAD analysis service. It runs as a hosted test version and hasn’t launched, so there are no real customers or orders yet.',
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

  steps: [
    {
      title: 'Request',
      detail:
        'A customer uploads PDF drawings and optional 3D models, and can change or withdraw the request until the order is placed.',
    },
    {
      title: 'Reading the files',
      detail:
        '3D models are read as exact geometry, and anything uncertain is reported as undetermined, never guessed. Drawings are read by rules, without outside AI or OCR.',
    },
    {
      title: 'Matching',
      detail:
        'Process and precision must match exactly. Matching suggests the shops that fit, and the team decides who receives the request.',
    },
    {
      title: 'Quotes and placement',
      detail:
        'Shops quote, a platform fee is added on top so the customer sees one price, and the customer places the order. The two sides talk only through the platform.',
    },
    {
      title: 'Making and inspection',
      detail:
        'The shop makes the part and files a job report, and the customer audits the finished job and accepts or rejects it.',
    },
    {
      title: 'Delivery',
      detail:
        'Nothing ships unpaid and no stage moves backwards. Only the customer can confirm delivery.',
    },
  ],

  /** The design decisions, each with the reason behind it. */
  decisions: [
    {
      title: 'A separate service for CAD analysis',
      why: 'The geometry libraries are too large and slow for the API, so analysis runs as its own Cloud Run Job.',
    },
    {
      title: 'Uploads go straight to storage',
      why: 'Files can be larger than Vercel accepts in one request, so the browser uploads directly to private storage with a short-lived signed token.',
    },
    {
      title: 'A lock on every order action',
      why: 'Double taps, second tabs and competing shops wait for the lock and are decided on the new state, so an order can’t move twice.',
    },
    {
      title: 'Business rules in a pure domain package',
      why: 'The rules import no framework or database code, so they can be tested on their own.',
    },
    {
      title: 'Sign-in attempts counted under a lock',
      why: 'A security audit found that wrong passwords sent at the same moment could slip past the attempt limit. Postgres advisory locks now count each attempt first.',
    },
  ],
};
