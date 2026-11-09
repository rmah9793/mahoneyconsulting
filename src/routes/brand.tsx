import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Logo, Monogram } from "@/components/Logo";

export const Route = createFileRoute("/brand")({
  head: () => ({
    meta: [
      { title: "Brand & Logo — Mahoney.consulting" },
      { name: "description", content: "The Mahoney.consulting logo, monogram, colours and loading animation." },
      { property: "og:title", content: "Brand & Logo — Mahoney.consulting" },
      { property: "og:description", content: "The Mahoney.consulting logo, monogram, colours and loading animation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Brand,
});

const colours = [
  ["Midnight navy", "#061A31", "bg-navy-deep text-navy-foreground"],
  ["Executive navy", "#0A1F44", "bg-navy text-navy-foreground"],
  ["Electric blue", "#208BFF", "bg-primary text-primary-foreground"],
  ["Sky", "#87D8FF", "bg-sky text-navy"],
  ["Off-white", "#F8FAFC", "bg-background text-navy border"],
];

function Brand() {
  const [run, setRun] = useState(0);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-card">
        <div className="mx-auto flex h-[4.75rem] max-w-[100rem] items-center justify-between px-5 sm:px-10">
          <Link to="/" className="link-line inline-flex items-center gap-2 text-sm"><ArrowLeft className="h-4 w-4" /> Back to site</Link>
          <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Brand · v1</span>
        </div>
      </header>

      {/* Loader */}
      <section className="relative grid min-h-[80vh] place-items-center overflow-hidden bg-navy-deep text-navy-foreground">
        <div key={run} className="flex flex-col items-center">
          <Logo size="xl" animate />
          <div className="loader-bar mt-14 h-px w-48 bg-navy-foreground/15"><span /></div>
        </div>
        <button onClick={() => setRun((r) => r + 1)} className="absolute bottom-6 right-6 inline-flex items-center gap-2 text-sm text-navy-foreground/70 hover:text-navy-foreground">
          <RotateCcw className="h-4 w-4" /> Replay
        </button>
        <p className="absolute bottom-6 left-6 text-xs uppercase tracking-[0.16em] text-navy-foreground/50">Loading sequence</p>
      </section>

      <main className="mx-auto max-w-[100rem] px-5 py-20 sm:px-10">
        <h1 className="text-[clamp(2.4rem,5vw,4.5rem)] font-semibold leading-none tracking-[-0.02em]">The Mahoney identity<span className="text-primary">.</span></h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          A split serif M — one half solid, one half electric blue — beside the name. The blue dot after "Mahoney" comes from the address, Mahoney.consulting. "CONSULTING" is spaced to sit exactly under the name.
        </p>

        <div className="mt-14 grid gap-4 lg:grid-cols-2">
          <figure className="grid min-h-[22rem] place-items-center bg-navy-deep p-10"><Logo size="lg" /></figure>
          <figure className="grid min-h-[22rem] place-items-center border bg-card p-10"><Logo size="lg" tone="light" /></figure>
          <figure className="grid min-h-[22rem] place-items-center bg-primary p-10 text-primary-foreground">
            <span className="inline-grid leading-none">
              <span className="font-serif text-[3.4rem] font-semibold tracking-[-0.015em]">Mahoney<span className="brand-dot brand-dot-white" /></span>
              <span className="mt-2 flex justify-between pr-[0.28em] text-base font-medium">{"CONSULTING".split("").map((c, i) => <span key={i}>{c}</span>)}</span>
            </span>
          </figure>
          <div className="grid grid-cols-3 gap-4">
            <figure className="grid aspect-square place-items-center rounded-[22%] bg-navy-deep"><Monogram className="w-1/2" /></figure>
            <figure className="grid aspect-square place-items-center rounded-[22%] border bg-card"><Monogram tone="light" className="w-1/2" /></figure>
            <figure className="grid aspect-square place-items-center rounded-full bg-paper"><Monogram tone="light" className="w-1/2" /></figure>
            <figure className="col-span-3 flex items-center justify-around border bg-card p-6">
              {[64, 40, 24, 16].map((px) => <Monogram key={px} tone="light" className="h-full w-auto" />).map((el, i) => <span key={i} style={{ height: [64, 40, 24, 16][i] }} className="flex">{el}</span>)}
            </figure>
          </div>
        </div>

        <h2 className="mt-24 text-3xl font-semibold">Colour</h2>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-5">
          {colours.map(([n, hex, cls]) => (
            <div key={hex} className={`flex aspect-[4/5] flex-col justify-end p-5 ${cls}`}>
              <p className="font-serif text-xl">{n}</p>
              <p className="mt-1 text-sm opacity-75">{hex}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-24 text-3xl font-semibold">Type</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="border bg-card p-8"><p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Headlines — Playfair Display</p><p className="mt-6 font-serif text-6xl font-semibold">Aa Bb Mm</p></div>
          <div className="border bg-card p-8"><p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Text — DM Sans</p><p className="mt-6 text-6xl font-medium">Aa Bb Mm</p></div>
        </div>
      </main>
    </div>
  );
}
