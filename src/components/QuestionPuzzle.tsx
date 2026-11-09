import { useEffect, useState } from "react";

/** 1 = tab, -1 = socket, 0 = straight edge. */
type Edge = 1 | -1 | 0;

const X = 46;
const Y = 46;
const W = 200;
const H = 168;
const VW = X * 2 + W;
const VH = Y * 2 + H;

function edge(x1: number, y1: number, x2: number, y2: number, kind: Edge) {
  if (kind === 0) return `L ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  // Right-hand normal of a clockwise walk points out of the piece.
  const nx = uy;
  const ny = -ux;
  const depth = len * 0.155 * kind;
  const at = (t: number, o = 0) => {
    const x = x1 + ux * len * t + nx * o;
    const y = y1 + uy * len * t + ny * o;
    return `${x.toFixed(1)} ${y.toFixed(1)}`;
  };
  return [
    `L ${at(0.35)}`,
    `C ${at(0.37, depth * 0.05)} ${at(0.34, depth * 0.72)} ${at(0.42, depth)}`,
    `C ${at(0.46, depth * 1.22)} ${at(0.54, depth * 1.22)} ${at(0.58, depth)}`,
    `C ${at(0.66, depth * 0.72)} ${at(0.63, depth * 0.05)} ${at(0.65)}`,
    `L ${at(1)}`,
  ].join(" ");
}

function piecePath(top: Edge, right: Edge, bottom: Edge, left: Edge) {
  const x = X;
  const y = Y;
  return [
    `M ${x} ${y}`,
    edge(x, y, x + W, y, top),
    edge(x + W, y, x + W, y + H, right),
    edge(x + W, y + H, x, y + H, bottom),
    edge(x, y + H, x, y, left),
    "Z",
  ].join(" ");
}

function edges(index: number, cols: number): [Edge, Edge, Edge, Edge] {
  const col = index % cols;
  const row = Math.floor(index / cols);
  const rows = Math.ceil(6 / cols);
  const right: Edge = col < cols - 1 ? 1 : 0;
  const left: Edge = col > 0 ? -1 : 0;
  const bottom: Edge = row < rows - 1 ? 1 : 0;
  const top: Edge = row > 0 ? -1 : 0;
  return [top, right, bottom, left];
}

function PieceShape({ d, missing }: { d: string; missing?: boolean }) {
  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} aria-hidden className="pointer-events-none absolute overflow-visible" style={{ width: `${(VW / W) * 100}%`, height: `${(VH / H) * 100}%`, left: `${(-X / W) * 100}%`, top: `${(-Y / H) * 100}%` }}>
      <path d={d} fill={missing ? "color-mix(in oklab, var(--primary) 14%, var(--card))" : "var(--card)"} stroke="var(--background)" strokeWidth="8" />
      <path d={d} fill="none" stroke={missing ? "var(--primary)" : "color-mix(in oklab, var(--navy) 28%, transparent)"} strokeWidth={missing ? 2.4 : 1.5} strokeDasharray={missing ? "8 6" : undefined} />
    </svg>
  );
}

export function QuestionPuzzle({ questions, href }: { questions: readonly (readonly string[])[]; href: string }) {
  const [cols, setCols] = useState(3);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setCols(mq.matches ? 3 : 1);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const slots: Array<{ q: string; s: string } | null> = [...questions.map((row) => ({ q: row[0] ?? "", s: row[1] ?? "" })), null];

  return (
    <ol data-qgrid className="puzzle-board relative z-10 mt-20 grid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {slots.map((slot, i) => {
        const d = piecePath(...edges(i, cols));
        return (
          <li key={slot?.q ?? "missing"} data-piece={i} className="puzzle-cell relative aspect-[6/5]">
            <a href={href} className="absolute inset-0 text-center text-navy">
              <PieceShape d={d} missing={!slot} />
              <span className="relative z-[1] flex h-full flex-col items-center justify-center px-[12%] py-[14%]">
                {slot ? (
                  <>
                    <span className="block max-w-[16ch] text-balance font-serif text-[clamp(1.15rem,1.7vw,1.65rem)] font-medium leading-snug tracking-[-0.02em]">{slot.q}</span>
                    <span className="mt-4 block text-[0.68rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">{slot.s}</span>
                  </>
                ) : (
                  <>
                    <span className="block max-w-[14ch] text-balance font-serif text-[clamp(1.15rem,1.7vw,1.65rem)] font-medium leading-snug tracking-[-0.02em]">The missing piece.</span>
                    <span className="mt-4 block text-[0.68rem] font-medium uppercase tracking-[0.14em] text-primary">Bring us yours</span>
                  </>
                )}
              </span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}
