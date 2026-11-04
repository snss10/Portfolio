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

export interface SketchStep {
  title: string;
  /** Short handwritten line under the title. Keep it under ~22 characters. */
  sub?: string;
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

  private opts(extra: object = {}) {
    return { seed: this.seed++, strokeWidth: 2, fixedDecimalPlaceDigits: 1, ...extra };
  }

  box(x: number, y: number, w: number, h: number, delay: number) {
    this.stroke(
      this.gen.rectangle(x, y, w, h, this.opts({ roughness: 1.1, bowing: 1.2 })),
      'k',
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
    this.parts.push(
      `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="${anchor}" class="${cls} reveal" style="--d:${delay.toFixed(2)}s">${esc(s)}</text>`,
    );
  }

  note(x: number, y: number, lines: string[], lineHeight: number, delay: number, anchor = 'start') {
    const spans = lines
      .map(
        (l, i) => `<tspan x="${x.toFixed(1)}" dy="${i === 0 ? 0 : lineHeight}">${esc(l)}</tspan>`,
      )
      .join('');
    this.parts.push(
      `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="${anchor}" class="t-note write" style="--d:${delay.toFixed(2)}s;--t:0.6s">${spans}</text>`,
    );
  }
}

const nodesOf = (flow: SketchFlow): Omit<Node, 'x' | 'y' | 'w' | 'h'>[] => [
  ...(flow.start ? [{ kind: 'start' as const, title: flow.start }] : []),
  ...flow.steps.map((s) => ({ kind: 'step' as const, title: s.title, sub: s.sub })),
];

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
  const base = nodesOf(flow);
  const offset = flow.start ? 1 : 0;
  const n = base.length;
  const perRow = flow.perRow ?? (n > 4 ? Math.ceil(n / 2) : n);
  const rows = Math.ceil(n / perRow);
  const hasSub = flow.steps.some((s) => s.sub);

  const M = 16;
  const boxW = Math.max(
    132,
    ...base.map(
      (b) =>
        Math.max(
          textW(b.title, SIZE.title, EM.title),
          b.sub ? textW(b.sub, SIZE.sub, EM.hand) : 0,
        ) + 40,
    ),
  );
  const boxH = hasSub ? 82 : 60;
  const edgeLabels = flow.edges ?? [];
  const gap = Math.max(68, ...edgeLabels.map((e) => (e ? textW(e, SIZE.edge, EM.hand) + 26 : 0)));

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
  const NOTE_SPACE = 76;
  const top = notes.some((x) => x.side === 'above') ? NOTE_SPACE : 10;
  const bottom = notes.some((x) => x.side === 'below') ? NOTE_SPACE : 10;
  const rowGap = 70;
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
      c.box(nd.x, nd.y, nd.w, nd.h, d);
      c.text(cx, nd.y + (nd.sub ? 35 : 37), nd.title, 't-title', d + 0.3);
      if (nd.sub) c.text(cx, nd.y + 62, nd.sub, 't-sub', d + 0.36);
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
    const tw = textW(note.text, SIZE.note, EM.hand);
    const cx = nd.x + nd.w / 2;
    const left = Math.min(Math.max(M, cx - tw / 2 - 14), width - M - tw);
    const textMid = left + tw / 2;
    if (note.side === 'above') {
      const y = nd.y - 46;
      c.note(left, y, [note.text], 0, d);
      c.noteArrow(
        [
          [textMid + 8, y + 9],
          [textMid + 14, y + 24],
          [cx + 6, nd.y - 7],
        ],
        d + 0.45,
      );
    } else {
      const y = nd.y + nd.h + 58;
      c.note(left, y, [note.text], 0, d);
      c.noteArrow(
        [
          [textMid + 8, y - 22],
          [textMid + 12, y - 34],
          [cx + 6, nd.y + nd.h + 7],
        ],
        d + 0.45,
      );
    }
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
      c.box(nd.x, nd.y, nd.w, nd.h, d);
      c.text(cx, nd.y + (nd.sub ? 31 : 34), nd.title, 't-title', d + 0.3);
      if (nd.sub) c.text(cx, nd.y + 56, nd.sub, 't-sub', d + 0.36);
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
  });

  return { svg: c.parts.join(''), width, height };
}

export function renderSketch(flow: SketchFlow): RenderedSketch {
  return { h: renderHorizontal(flow), v: renderVertical(flow) };
}
