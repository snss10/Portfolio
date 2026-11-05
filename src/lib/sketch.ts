/**
 * Hand-drawn flow diagrams, rendered at build time.
 *
 * rough.js turns plain boxes and arrows into marker-like strokes. Everything
 * here runs in Node during the build and returns static SVG markup, so the
 * site ships no drawing code. Colours come from CSS classes (see global.css),
 * which keeps both themes correct, and each stroke carries a delay so the
 * figure can "draw itself" when a page opens.
 */
import rough from 'roughjs';

/** Dry-erase marker inks. Each project has one, so it keeps its colour across the site. */
export type Tone = 'blue' | 'red' | 'green' | 'purple';

export interface SketchStep {
  title: string;
  /** Short handwritten line under the title. Keep it under ~22 characters. */
  sub?: string;
  /** Draws the box in this marker colour (default: marker black). */
  tone?: Tone;
  /** Makes the box a link, e.g. to the project's case study. */
  href?: string;
  /** Accessible name for that link. Defaults to the words in the box. */
  linkLabel?: string;
}

export interface SketchNote {
  /** Index into `steps` the note points at. */
  at: number;
  text: string;
  /** Horizontal layout only. Defaults to above for the first row, below for the second. */
  side?: 'above' | 'below';
}

export interface SketchFlow {
  /** Accessible description of what the figure shows. */
  label: string;
  /** Optional free-form starting point, drawn as an ellipse (e.g. "an idea"). */
  start?: string;
  steps: SketchStep[];
  /** Label for each arrow, in order. Arrow 0 leaves the first node. Use null for no label. */
  edges?: (string | null)[];
  notes?: SketchNote[];
  /**
   * Boxes per row on desktop. Defaults to one row for up to four steps and
   * two rows after that; set it for long flows (e.g. 4 gives three rows for 11 steps).
   */
  perRow?: number;
  /** Colour of the notes. Defaults to the colour of the step a note points at, else blue. */
  tone?: Tone;
  /**
   * A small version for lists: titles only (no handwritten lines or arrow
   * labels), smaller boxes, always the wide layout.
   */
  compact?: boolean;
  seed?: number;
}

export interface RenderedSketch {
  h: { svg: string; width: number; height: number };
  v: { svg: string; width: number; height: number };
}

// Type sizes in SVG units, and average glyph widths measured from the real fonts
// (Schibsted Grotesk 700 ≈ 0.54em, Kalam ≈ 0.42em) with a safety margin.
const SIZE = { title: 19, sub: 16, note: 18, noteV: 16, edge: 14 };
const EM = { title: 0.6, hand: 0.47 };
const textW = (s: string, size: number, em: number) => Math.ceil(s.length * size * em);

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

type Gen = ReturnType<typeof rough.generator>;
type Drawable = ReturnType<Gen['line']>;

interface Node {
  kind: 'start' | 'step';
  title: string;
  sub?: string;
  tone?: Tone;
  href?: string;
  linkLabel?: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

class Canvas {
  private gen: Gen = rough.generator();
  private seed: number;
  parts: string[] = [];

  constructor(seed: number) {
    this.seed = seed;
  }

  private stroke(d: Drawable, cls: string, delay: number, dur: number) {
    for (const p of this.gen.toPaths(d)) {
      this.parts.push(
        `<path d="${p.d}" pathLength="1" class="${cls} draw" style="--d:${delay.toFixed(2)}s;--t:${dur.toFixed(2)}s"/>`,
      );
    }
  }

  raw(markup: string) {
    this.parts.push(markup);
  }

  private opts(extra: object = {}) {
    return { seed: this.seed++, strokeWidth: 2, fixedDecimalPlaceDigits: 1, ...extra };
  }

  box(x: number, y: number, w: number, h: number, delay: number, cls = 'k') {
    this.stroke(
      this.gen.rectangle(x, y, w, h, this.opts({ roughness: 1.1, bowing: 1.2 })),
      cls,
      delay,
      0.55,
    );
  }

  ellipse(cx: number, cy: number, w: number, h: number, delay: number) {
    this.stroke(this.gen.ellipse(cx, cy, w, h, this.opts({ roughness: 1.2 })), 'k', delay, 0.55);
  }

  private head(x: number, y: number, angle: number, cls: string, delay: number, size = 12) {
    for (const turn of [Math.PI - 0.45, Math.PI + 0.45]) {
      const a = angle + turn;
      const line = this.gen.line(
        x,
        y,
        x + size * Math.cos(a),
        y + size * Math.sin(a),
        this.opts({ roughness: 0.7, disableMultiStroke: true }),
      );
      this.stroke(line, cls, delay, 0.12);
    }
  }

  arrow(x1: number, y1: number, x2: number, y2: number, delay: number) {
    const line = this.gen.line(
      x1,
      y1,
      x2,
      y2,
      this.opts({ roughness: 0.9, bowing: 1.5, disableMultiStroke: true }),
    );
    this.stroke(line, 'k', delay, 0.28);
    this.head(x2, y2, Math.atan2(y2 - y1, x2 - x1), 'k', delay + 0.24);
  }

  noteArrow(points: [number, number][], delay: number) {
    const curve = this.gen.curve(points, this.opts({ roughness: 0.8, disableMultiStroke: true }));
    this.stroke(curve, 'm', delay, 0.3);
    const [a, b] = [points[points.length - 2], points[points.length - 1]];
    this.head(b[0], b[1], Math.atan2(b[1] - a[1], b[0] - a[0]), 'm', delay + 0.26, 9);
  }

  text(x: number, y: number, s: string, cls: string, delay: number, anchor = 'middle') {
    // `cls` may hold several classes, e.g. "t-title t-sm".
    this.parts.push(
      `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="${anchor}" class="${cls} reveal" style="--d:${delay.toFixed(2)}s">${esc(s)}</text>`,
    );
  }

  note(
    x: number,
    y: number,
    lines: string[],
    lineHeight: number,
    delay: number,
    anchor = 'start',
    extra = '',
  ) {
    const spans = lines
      .map(
        (l, i) => `<tspan x="${x.toFixed(1)}" dy="${i === 0 ? 0 : lineHeight}">${esc(l)}</tspan>`,
      )
      .join('');
    this.parts.push(
      `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="${anchor}" class="t-note${extra} write" style="--d:${delay.toFixed(2)}s;--t:0.6s">${spans}</text>`,
    );
  }
}

const nodesOf = (flow: SketchFlow): Omit<Node, 'x' | 'y' | 'w' | 'h'>[] => [
  ...(flow.start ? [{ kind: 'start' as const, title: flow.start }] : []),
  ...flow.steps.map((s) => ({ kind: 'step' as const, ...s })),
];

/**
 * Opens a box's wrapper: a link with a generous hit area when the step has an
 * href, a colour group when it has a tone. Returns the matching close tag.
 */
const openNode = (c: Canvas, nd: Node) => {
  const tone = nd.tone ? ` tone-${nd.tone}` : '';
  if (nd.href) {
    // Without a linkLabel, the link is named by the words in the box.
    const label = nd.linkLabel ? ` aria-label="${esc(nd.linkLabel)}"` : '';
    c.raw(
      `<a href="${esc(nd.href)}" class="node-link${tone}"${label}>` +
        `<rect class="hit" x="${nd.x - 8}" y="${nd.y - 8}" width="${nd.w + 16}" height="${nd.h + 16}" rx="14"/>`,
    );
    return '</a>';
  }
  if (nd.tone) {
    c.raw(`<g class="${tone.trim()}">`);
    return '</g>';
  }
  return '';
};

/** The colour of a note: the flow's, else the colour of the box it points at. */
const noteTone = (flow: SketchFlow, nd: Node) => flow.tone ?? nd.tone;
const openNote = (c: Canvas, tone?: Tone) => {
  c.raw(tone ? `<g class="tone-${tone}">` : '<g>');
};

/** Wrap text into lines of at most `max` characters, on word boundaries. */
const wrap = (s: string, max: number) => {
  const lines: string[] = [];
  let line = '';
  for (const word of s.split(' ')) {
    if (line && (line + ' ' + word).length > max) {
      lines.push(line);
      line = word;
    } else line = line ? `${line} ${word}` : word;
  }
  if (line) lines.push(line);
  return lines;
};

// Timeline shared by both layouts so the drawing order is identical.
const T0 = 0.15;
/** Seconds between boxes. Long flows draw faster, so every figure finishes in about 3 s. */
const stepFor = (count: number) => Math.min(0.36, 2.6 / count);
const nodeDelay = (i: number, count: number) => T0 + i * stepFor(count);

function renderHorizontal(flow: SketchFlow) {
  const c = new Canvas(flow.seed ?? 7);
  const compact = !!flow.compact;
  // Compact sketches keep only the box titles.
  const base = nodesOf(flow).map((b) => (compact ? { ...b, sub: undefined } : b));
  const offset = flow.start ? 1 : 0;
  const n = base.length;
  const perRow = flow.perRow ?? (n > 4 ? Math.ceil(n / 2) : n);
  const rows = Math.ceil(n / perRow);
  const hasSub = base.some((b) => b.sub);
  const P = compact
    ? { title: 17, note: 16, minBox: 92, pad: 30, boxH: 50, gap: 46, rowGap: 54, noteSpace: 60 }
    : {
        title: SIZE.title,
        note: SIZE.note,
        minBox: 132,
        pad: 40,
        boxH: hasSub ? 82 : 60,
        gap: 68,
        rowGap: 70,
        noteSpace: 76,
      };
  const sm = compact ? ' t-sm' : '';

  const M = 16;
  const boxW = Math.max(
    P.minBox,
    ...base.map(
      (b) =>
        Math.max(textW(b.title, P.title, EM.title), b.sub ? textW(b.sub, SIZE.sub, EM.hand) : 0) +
        P.pad,
    ),
  );
  const boxH = P.boxH;
  const edgeLabels = compact ? [] : (flow.edges ?? []);
  const gap = Math.max(
    P.gap,
    ...edgeLabels.map((e) => (e ? textW(e, SIZE.edge, EM.hand) + 26 : 0)),
  );

  const notes = (flow.notes ?? []).map((note) => {
    const i = note.at + offset;
    const row = Math.floor(i / perRow);
    // With several rows, the space between rows belongs to the arrows, so
    // notes sit above the first row or below the last one.
    if (rows > 1 && row !== 0 && row !== rows - 1) {
      throw new Error(
        `Sketch "${flow.label.slice(0, 40)}…": the note "${note.text}" points at a middle row. ` +
          'Point notes at a step in the first or last row.',
      );
    }
    const side = rows > 1 ? (row === 0 ? 'above' : 'below') : (note.side ?? 'above');
    return { ...note, i, side };
  });
  const top = notes.some((x) => x.side === 'above') ? P.noteSpace : 10;
  const bottom = notes.some((x) => x.side === 'below') ? P.noteSpace : 10;
  const rowGap = P.rowGap;
  const width = 2 * M + perRow * boxW + (perRow - 1) * gap;
  const rowY = (r: number) => top + r * (boxH + rowGap);
  const height = rowY(rows - 1) + boxH + bottom;

  const nodes: Node[] = base.map((b, i) => {
    const row = Math.floor(i / perRow);
    const inRow = i % perRow;
    const col = row % 2 === 0 ? inRow : perRow - 1 - inRow; // second row runs right to left
    return { ...b, x: M + col * (boxW + gap), y: rowY(row), w: boxW, h: boxH };
  });

  nodes.forEach((nd, i) => {
    const d = nodeDelay(i, n);
    const cx = nd.x + nd.w / 2;
    if (nd.kind === 'start') {
      c.ellipse(cx, nd.y + nd.h / 2, nd.w - 10, nd.h - 6, d);
      c.text(cx, nd.y + nd.h / 2 + 6, nd.title, 't-start', d + 0.3);
    } else {
      const close = openNode(c, nd);
      c.box(nd.x, nd.y, nd.w, nd.h, d, nd.tone ? 'm' : 'k');
      const titleY = nd.sub ? 35 : Math.round(nd.h / 2 + P.title * 0.36);
      c.text(cx, nd.y + titleY, nd.title, `t-title${sm}`, d + 0.3);
      if (nd.sub) c.text(cx, nd.y + 62, nd.sub, 't-sub', d + 0.36);
      c.raw(close);
    }

    const next = nodes[i + 1];
    if (!next) return;
    const label = edgeLabels[i];
    const ad = d + 0.42;
    if (next.y === nd.y) {
      const forward = next.x > nd.x;
      const y = nd.y + nd.h / 2;
      const x1 = forward ? nd.x + nd.w + 6 : nd.x - 6;
      const x2 = forward ? next.x - 6 : next.x + next.w + 6;
      c.arrow(x1, y, x2, y, ad);
      if (label) c.text((x1 + x2) / 2, y - 11, label, 't-edge', ad + 0.15);
    } else {
      const x = cx;
      c.arrow(x, nd.y + nd.h + 6, x, next.y - 6, ad);
      if (label)
        c.text(x + 12, (nd.y + nd.h + next.y) / 2 + 5, label, 't-edge', ad + 0.15, 'start');
    }
  });

  const tNotes = nodeDelay(n, n) + 0.15;
  notes.forEach((note, k) => {
    const nd = nodes[note.i];
    const d = tNotes + k * 0.5;
    const tw = textW(note.text, P.note, EM.hand);
    const cx = nd.x + nd.w / 2;
    const left = Math.min(Math.max(M, cx - tw / 2 - 14), width - M - tw);
    const textMid = left + tw / 2;
    openNote(c, noteTone(flow, nd));
    if (note.side === 'above') {
      const y = nd.y - (compact ? 36 : 46);
      c.note(left, y, [note.text], 0, d, 'start', sm);
      c.noteArrow(
        [
          [textMid + 8, y + 9],
          [textMid + 14, y + 24],
          [cx + 6, nd.y - 7],
        ],
        d + 0.45,
      );
    } else {
      const y = nd.y + nd.h + (compact ? 48 : 58);
      c.note(left, y, [note.text], 0, d, 'start', sm);
      c.noteArrow(
        [
          [textMid + 8, y - 22],
          [textMid + 12, y - 34],
          [cx + 6, nd.y + nd.h + 7],
        ],
        d + 0.45,
      );
    }
    c.raw('</g>');
  });

  return { svg: c.parts.join(''), width, height };
}

function renderVertical(flow: SketchFlow) {
  const c = new Canvas((flow.seed ?? 7) + 100);
  const base = nodesOf(flow);
  const offset = flow.start ? 1 : 0;
  const hasSub = flow.steps.some((s) => s.sub);
  const edgeLabels = flow.edges ?? [];

  const width = 380;
  const colX = 10;
  const colW = 214;
  const noteX = colX + colW + 34;
  const noteChars = 15;
  const boxH = hasSub ? 72 : 54;
  const gap = 50;

  let y = 8;
  const nodes: Node[] = base.map((b) => {
    const h = b.kind === 'start' ? 50 : boxH;
    const nd = { ...b, x: colX, y, w: colW, h };
    y += h + gap;
    return nd;
  });
  const height = y - gap + 10;

  nodes.forEach((nd, i) => {
    const d = nodeDelay(i, nodes.length);
    const cx = nd.x + nd.w / 2;
    if (nd.kind === 'start') {
      c.ellipse(cx, nd.y + nd.h / 2, 150, nd.h - 4, d);
      c.text(cx, nd.y + nd.h / 2 + 6, nd.title, 't-start', d + 0.3);
    } else {
      const close = openNode(c, nd);
      c.box(nd.x, nd.y, nd.w, nd.h, d, nd.tone ? 'm' : 'k');
      c.text(cx, nd.y + (nd.sub ? 31 : 34), nd.title, 't-title', d + 0.3);
      if (nd.sub) c.text(cx, nd.y + 56, nd.sub, 't-sub', d + 0.36);
      c.raw(close);
    }
    const next = nodes[i + 1];
    if (!next) return;
    const ad = d + 0.42;
    c.arrow(cx, nd.y + nd.h + 6, cx, next.y - 6, ad);
    const label = edgeLabels[i];
    if (label) c.text(cx + 12, (nd.y + nd.h + next.y) / 2 + 5, label, 't-edge', ad + 0.15, 'start');
  });

  const tNotes = nodeDelay(nodes.length, nodes.length) + 0.15;
  (flow.notes ?? []).forEach((note, k) => {
    const nd = nodes[note.at + offset];
    const d = tNotes + k * 0.5;
    const lines = wrap(note.text, noteChars);
    const y0 = nd.y + 24;
    openNote(c, noteTone(flow, nd));
    c.note(noteX, y0, lines, 20, d);
    // Short arrow from the start of the note, left into the box edge.
    c.noteArrow(
      [
        [noteX - 4, y0 - 6],
        [noteX - 14, y0 - 10],
        [colX + colW + 6, y0 - 6],
      ],
      d + 0.45,
    );
    c.raw('</g>');
  });

  return { svg: c.parts.join(''), width, height };
}

export function renderSketch(flow: SketchFlow): RenderedSketch {
  return { h: renderHorizontal(flow), v: renderVertical(flow) };
}

/* --------------------------------------------------------------------------
   Timeline: each span is a hand-shaded bar on a hand-drawn axis, placed by
   month. Used for the roles on the home page.
   -------------------------------------------------------------------------- */

export interface TimelineSpan {
  /** Short handwritten label above the bar. */
  label: string;
  /** First month, YYYY-MM. */
  start: string;
  /** Last month, YYYY-MM. Leave out for "now". */
  end?: string;
  tone: Tone;
}

const monthIndex = (ym?: string) => {
  if (!ym) {
    const now = new Date();
    return now.getFullYear() * 12 + now.getMonth();
  }
  const [y, m] = ym.split('-').map(Number);
  return y * 12 + (m - 1);
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function renderTimeline(spans: TimelineSpan[], width: number, seed = 5) {
  const gen = rough.generator();
  let s = seed;
  const opts = (extra: object = {}) => ({
    seed: s++,
    strokeWidth: 2,
    fixedDecimalPlaceDigits: 1,
    ...extra,
  });
  const parts: string[] = [];
  const path = (d: Drawable, cls: (stroke: string) => string) => {
    for (const p of gen.toPaths(d)) parts.push(`<path d="${p.d}" class="${cls(p.stroke)}"/>`);
  };
  const label = (x: number, y: number, t: string, cls: string, anchor = 'start') =>
    parts.push(
      `<text x="${x.toFixed(1)}" y="${y}" text-anchor="${anchor}" class="${cls}">${esc(t)}</text>`,
    );

  const L = 8;
  const R = width - 8;
  const first = Math.min(...spans.map((x) => monthIndex(x.start)));
  const last = monthIndex();
  const total = last - first + 1;
  const xOf = (month: number) => L + ((month - first) / total) * (R - L);
  const labelY = 34;
  const barY = 46;
  const barH = 30;
  const axisY = barY + barH + 10;
  const size = width < 500 ? 15 : 16;

  // Bars, shaded with hachure like a marker colouring in a box.
  const placed: { x1: number; x2: number }[] = [];
  spans.forEach((sp) => {
    const x1 = xOf(monthIndex(sp.start)) + 2;
    const x2 = xOf(monthIndex(sp.end) + 1) - 2;
    const bar = gen.rectangle(
      x1,
      barY,
      x2 - x1,
      barH,
      opts({
        roughness: 1,
        fill: 'FILL',
        stroke: 'LINE',
        fillStyle: 'hachure',
        hachureAngle: -41,
        hachureGap: 6,
        fillWeight: 1.4,
      }),
    );
    parts.push(`<g class="tone-${sp.tone}">`);
    path(bar, (stroke) => (stroke === 'FILL' ? 'hf' : 'm'));
    parts.push('</g>');

    // Label above the bar; the last one hangs from the right edge if it would overflow.
    const w = textW(sp.label, size, EM.hand);
    let x = x1;
    let anchor = 'start';
    if (x + w > R) {
      x = R;
      anchor = 'end';
    }
    const left = anchor === 'start' ? x : x - w;
    const clash = placed.some((p) => left < p.x2 + 8 && left + w > p.x1 - 8);
    placed.push({ x1: left, x2: left + w });
    parts.push(`<g class="tone-${sp.tone}">`);
    label(x, clash ? labelY - 18 : labelY, sp.label, `t-span${width < 500 ? ' t-sm' : ''}`, anchor);
    parts.push('</g>');
  });

  // Axis, with a tick and a year at each January.
  path(gen.line(L, axisY, R, axisY, opts({ roughness: 0.8, bowing: 0.6 })), () => 'k');
  const [fy, fm] = [Math.floor(first / 12), first % 12];
  label(L, axisY + 24, `${MONTHS[fm]} ${fy}`, 't-axis');
  for (let y = fy + 1; y * 12 <= last; y++) {
    const x = xOf(y * 12);
    path(gen.line(x, axisY - 5, x, axisY + 6, opts({ roughness: 0.5 })), () => 'k');
    if (x > L + 70 && x < R - 40) label(x, axisY + 24, String(y), 't-axis', 'middle');
  }
  label(R, axisY + 24, 'now', 't-axis', 'end');

  return { svg: parts.join(''), width, height: axisY + 34 };
}

/** A hand-drawn rectangle, for the outline of the main button. */
export function roughFrame(width: number, height: number, seed = 3) {
  const gen = rough.generator();
  const d = gen.rectangle(3, 3, width - 6, height - 6, {
    seed,
    roughness: 1.3,
    bowing: 1.2,
    strokeWidth: 2,
    fixedDecimalPlaceDigits: 1,
  });
  return gen
    .toPaths(d)
    .map((p) => `<path d="${p.d}"/>`)
    .join('');
}

/* --------------------------------------------------------------------------
   Route: a pipeline drawn as one wavy marker line with a stop for each step,
   like a route sketched on a board. Used where a box diagram would repeat:
   the project lists on the home page and second diagrams on a page.
   -------------------------------------------------------------------------- */

export interface RouteSpec {
  steps: string[];
  /** Handwritten notes pointing at a stop. */
  notes?: { at: number; text: string; side?: 'above' | 'below' }[];
  seed?: number;
}

const WOBBLE = [0, -5, 3, -3, 5, -2, 4, -4];

export function renderRoute(spec: RouteSpec, layout: 'h' | 'v') {
  const gen = rough.generator();
  let s = spec.seed ?? 3;
  const opts = (extra: object = {}) => ({
    seed: s++,
    strokeWidth: 2.4,
    fixedDecimalPlaceDigits: 1,
    ...extra,
  });
  const parts: string[] = [];
  const draw = (d: Drawable) => {
    for (const p of gen.toPaths(d)) {
      const filled = p.fill && p.fill !== 'none';
      parts.push(`<path d="${p.d}" class="${filled ? 'dot' : 'm'}"/>`);
    }
  };
  const text = (x: number, y: number, t: string, cls: string, anchor = 'middle') =>
    parts.push(
      `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="${anchor}" class="${cls}">${esc(t)}</text>`,
    );
  const stop = (x: number, y: number) =>
    draw(
      gen.circle(
        x,
        y,
        16,
        opts({ fill: 'FILL', fillStyle: 'solid', roughness: 0.7, strokeWidth: 2.3 }),
      ),
    );
  const head = (x: number, y: number, angle: number, size = 10) => {
    for (const turn of [Math.PI - 0.5, Math.PI + 0.5]) {
      const a = angle + turn;
      draw(
        gen.line(
          x,
          y,
          x + size * Math.cos(a),
          y + size * Math.sin(a),
          opts({ roughness: 0.5, disableMultiStroke: true }),
        ),
      );
    }
  };
  const notes = spec.notes ?? [];
  const n = spec.steps.length;
  const LABEL = 15;
  const NOTE = 16;

  if (layout === 'h') {
    const labelW = spec.steps.map((t) => textW(t, LABEL, EM.title));
    const pad = Math.max(labelW[0], labelW[n - 1]) / 2 + 10;
    const width = Math.max(460, Math.ceil(2 * pad + (n - 1) * (Math.max(...labelW) + 34)));
    const step = (width - 2 * pad - 24) / (n - 1);
    const above = notes.some((x) => (x.side ?? 'above') === 'above');
    const below = notes.some((x) => x.side === 'below');
    const lineY = above ? 52 : 18;
    const labelY = lineY + 34;
    const pts = spec.steps.map((_, i) => [pad + i * step, lineY + WOBBLE[i % WOBBLE.length]]);
    const end: [number, number] = [pts[n - 1][0] + 30, pts[n - 1][1] + 2];
    draw(gen.curve([...pts, end] as [number, number][], opts({ roughness: 0.8, bowing: 0.6 })));
    head(end[0], end[1], Math.atan2(end[1] - pts[n - 1][1], end[0] - pts[n - 1][0]));
    pts.forEach(([x, y], i) => {
      stop(x, y);
      text(x, labelY, spec.steps[i], 't-stop');
    });
    notes.forEach((note) => {
      const [x, y] = pts[note.at];
      const w = textW(note.text, NOTE, EM.hand);
      const cx = Math.min(Math.max(x, 8 + w / 2), width - 8 - w / 2);
      if ((note.side ?? 'above') === 'above') {
        text(cx, y - 32, note.text, 't-rnote');
        draw(gen.line(x + 4, y - 26, x + 1, y - 12, opts({ roughness: 0.5, strokeWidth: 1.8 })));
        head(x + 1, y - 12, Math.PI / 2, 7);
      } else {
        text(cx, labelY + 30, note.text, 't-rnote');
        draw(
          gen.line(
            x + 4,
            labelY + 14,
            x + 1,
            labelY + 5,
            opts({ roughness: 0.5, strokeWidth: 1.8 }),
          ),
        );
      }
    });
    return { svg: parts.join(''), width, height: labelY + (below ? 42 : 12) };
  }

  // Vertical, for phones: stops down the left, names beside them, notes under the names.
  const width = 340;
  const x0 = 22;
  let y = 16;
  const pts: [number, number][] = [];
  const ys: number[] = [];
  spec.steps.forEach((_, i) => {
    pts.push([x0 + WOBBLE[i % WOBBLE.length] * 0.6, y]);
    ys.push(y);
    y += notes.some((x) => x.at === i) ? 54 : 34;
  });
  const end: [number, number] = [pts[n - 1][0] + 1, pts[n - 1][1] + 28];
  draw(gen.curve([...pts, end], opts({ roughness: 0.8, bowing: 0.6 })));
  head(end[0], end[1], Math.PI / 2);
  pts.forEach(([x, py], i) => {
    stop(x, py);
    text(x0 + 24, py + 5, spec.steps[i], 't-stop', 'start');
  });
  notes.forEach((note) => text(x0 + 24, ys[note.at] + 25, note.text, 't-rnote', 'start'));
  return { svg: parts.join(''), width, height: end[1] + 12 };
}
