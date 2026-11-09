import { useId } from "react";

/** Split serif M: left half solid, right half electric blue, with a fine sky hairline on the cut. */
export function Monogram({ className = "", tone = "dark", animate = false }: { className?: string; tone?: "dark" | "light"; animate?: boolean }) {
  const id = useId().replace(/:/g, "");
  const left = tone === "dark" ? "var(--navy-foreground)" : "var(--navy)";
  const glyph = (fill: string, clip: string, cls = "") => (
    <text x="60" y="86" textAnchor="middle" fontFamily="'Playfair Display', Georgia, serif" fontWeight="700" fontSize="114" fill={fill} clipPath={`url(#${clip})`} className={cls}>M</text>
  );
  return (
    <svg viewBox="0 0 120 100" className={className} aria-hidden>
      <defs>
        <clipPath id={`l${id}`}><polygon points="0,0 67,0 53,100 0,100" /></clipPath>
        <clipPath id={`r${id}`}><polygon points="67,0 120,0 120,100 53,100" /></clipPath>
      </defs>
      <g className={animate ? "m-left" : ""}>{glyph(left, `l${id}`)}</g>
      <g className={animate ? "m-right" : ""}>{glyph("var(--primary)", `r${id}`)}</g>
    </svg>
  );
}

/** "CONSULTING" set letter by letter so it spans exactly the width of "Mahoney". */
function Tracked({ word, className = "" }: { word: string; className?: string }) {
  return (
    <span className={`flex justify-between ${className}`} aria-hidden>
      {word.split("").map((c, i) => <span key={i} className="logo-letter" style={{ animationDelay: `${600 + i * 45}ms` }}>{c}</span>)}
    </span>
  );
}

/** Mahoney. / CONSULTING — the dot nods to the Mahoney.consulting domain. */
export function Logo({ tone = "dark", size = "md", mark = true, animate = false, className = "" }: {
  tone?: "dark" | "light"; size?: "md" | "lg" | "xl"; mark?: boolean; animate?: boolean; className?: string;
}) {
  const text = tone === "dark" ? "text-navy-foreground" : "text-navy";
  const s = {
    md: { m: "h-10 sm:h-11", word: "text-[1.6rem] sm:text-[1.8rem]", sub: "text-[0.56rem] mt-[0.3rem]", rule: "h-9", gap: "gap-3.5" },
    lg: { m: "h-20", word: "text-[3.4rem]", sub: "text-[1rem] mt-2", rule: "h-16", gap: "gap-6" },
    xl: { m: "h-24 sm:h-36", word: "text-[3.2rem] sm:text-[5.5rem]", sub: "text-[0.95rem] sm:text-[1.55rem] mt-2 sm:mt-3", rule: "h-20 sm:h-28", gap: "gap-5 sm:gap-9" },
  }[size];
  return (
    <span className={`logo inline-flex items-center ${s.gap} ${text} ${animate ? "logo-animate" : ""} ${className}`}>
      {mark && <Monogram tone={tone} animate={animate} className={`${s.m} w-auto shrink-0`} />}
      {mark && <span className={`logo-rule w-px shrink-0 ${s.rule} ${tone === "dark" ? "bg-navy-foreground/25" : "bg-navy/20"}`} aria-hidden />}
      <span className="inline-grid leading-none" aria-hidden>
        <span className={`logo-word whitespace-nowrap font-serif font-semibold tracking-[-0.015em] ${s.word}`}>
          Mahoney<span className="brand-dot" />
        </span>
        <Tracked word="CONSULTING" className={`pr-[0.28em] font-sans font-medium ${s.sub} opacity-85`} />
      </span>
      <span className="sr-only">Mahoney.consulting</span>
    </span>
  );
}
