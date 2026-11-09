import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronRight, Menu, Plus, X } from "lucide-react";
import heroImg from "@/assets/hero-mountains.jpg";
import archImg from "@/assets/approach-architecture.jpg";
import chessImg from "@/assets/tile-chess.jpg";
import opsImg from "@/assets/tile-operations.jpg";
import boardImg from "@/assets/tile-boardroom.jpg";
import { Logo, Monogram } from "@/components/Logo";
import { site, contactHref } from "@/config/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mahoney.consulting — Fractional CEO & COO Advisory" },
      { name: "description", content: "Strategic leadership to build more value. Fractional CEO & COO services for businesses ready to grow, scale and perform." },
      { property: "og:title", content: "Mahoney.consulting — Fractional CEO & COO Advisory" },
      { property: "og:description", content: "Fractional CEO & COO services for businesses ready to grow, scale and perform." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const nav = [
  { href: "#services", label: "Services" },
  { href: "#questions", label: "Where we help" },
  { href: "#approach", label: "Approach" },
  { href: "#how-we-work", label: "How we work" },
];

const services = [
  { img: chessImg, w: 1024, h: 1024, tag: "Fractional CEO", title: "Direction, decisions and a team pulling the same way", body: "Senior leadership to set strategy and lead the business into its next stage — without a full-time executive hire." },
  { img: opsImg, w: 1280, h: 1024, tag: "Fractional COO", title: "Operations that keep up with the ambition", body: "Process, structure and cadence for businesses that have outgrown how they run." },
  { img: boardImg, w: 1024, h: 1280, tag: "Strategy & Execution", title: "A plan you can actually run on Monday", body: "Fewer priorities, clear owners, a weekly rhythm — and someone accountable for keeping it moving." },
  { img: archImg, w: 1280, h: 1024, tag: "Growth & Value", title: "Building a business that's worth more", body: "Focus on the levers that matter for revenue, margin and long-term enterprise value." },
];

const questions = [
  ["We've grown fast. Why does everything feel harder?", "Fractional COO"],
  ["We have a strategy. Why isn't anything changing?", "Strategy & Execution"],
  ["The founder is the bottleneck. What now?", "Fractional CEO"],
  ["How do we get the business ready for investment or sale?", "Growth & Value"],
  ["We need senior leadership — but not a full-time hire yet.", "Fractional CEO / COO"],
];

const steps = [
  { n: "01", title: "Understand", body: "Conversations with leadership and the team, a hard look at the numbers, and an honest read of where things stand." },
  { n: "02", title: "Lead", body: "We take on agreed responsibilities inside the business and work alongside your people, week in, week out." },
  { n: "03", title: "Deliver", body: "Routines, ownership and capability that hold up after we step back. Success is not needing us." },
];

function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("is-visible"), io.unobserve(e.target))),
      { threshold: 0.1 },
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function CircleArrow({ href, label, tone = "dark" }: { href: string; label: string; tone?: "dark" | "blue" }) {
  return (
    <a href={href} aria-label={label} className={`circle-arrow ${tone === "blue" ? "circle-arrow-blue" : ""}`}>
      <ArrowRight className="h-7 w-7" strokeWidth={1.75} />
    </a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);
  return (
    <header className="sticky top-0 z-50 border-b bg-card text-navy">
      <div className="mx-auto flex h-[4.75rem] max-w-[100rem] items-center gap-6 px-5 sm:px-10">
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="menu" aria-label={open ? "Close menu" : "Open menu"} className="grid h-10 w-10 shrink-0 place-items-center">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <a href="#top" aria-label="Mahoney.consulting — home" className="min-w-0"><Logo tone="light" /></a>
        <nav aria-label="Primary" className="ml-8 hidden items-center gap-8 xl:flex">
          {nav.map((n) => <a key={n.href} href={n.href} className="link-line text-[0.92rem] text-navy/80 hover:text-navy">{n.label}</a>)}
        </nav>
        <a href={contactHref()} className="link-line ml-auto hidden text-[0.92rem] font-medium text-primary sm:inline">Schedule a conversation</a>
      </div>
      {open && (
        <nav id="menu" aria-label="Menu" className="absolute inset-x-0 top-full border-b bg-card shadow-card">
          <ul className="mx-auto grid max-w-[100rem] gap-x-10 px-5 py-8 sm:grid-cols-2 sm:px-10 lg:grid-cols-4">
            {[...nav, { href: "#contact", label: "Contact" }].map((n) => (
              <li key={n.href}>
                <a href={n.href} onClick={() => setOpen(false)} className="group flex items-center justify-between border-b py-4 font-serif text-2xl">
                  {n.label}<ChevronRight className="h-5 w-5 text-primary transition-transform group-hover:translate-x-1" />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

function Tile({ s, className = "", big }: { s: (typeof services)[number] | { img: string; w: number; h: number; tag: string; title: string; body?: string }; className?: string; big?: boolean }) {
  return (
    <a href="#services" className={`tile group reveal ${className}`}>
      <img src={s.img} alt="" loading="lazy" width={s.w} height={s.h} className="tile-img" />
      <div className="tile-shade" aria-hidden />
      <div className="relative mt-auto p-6 sm:p-7">
        <p className="text-xs uppercase tracking-[0.14em] text-navy-foreground/85">{s.tag}</p>
        <h3 className={`mt-3 font-sans font-semibold leading-snug text-navy-foreground ${big ? "text-2xl sm:text-3xl" : "text-xl sm:text-[1.4rem]"}`}>
          {s.title} <ChevronRight className="inline h-5 w-5 transition-transform group-hover:translate-x-1" />
        </h3>
      </div>
    </a>
  );
}

function Hero() {
  return (
    <section id="top" className="bg-navy-deep text-navy-foreground">
      <div className="mx-auto grid max-w-[100rem] gap-4 px-5 pb-20 pt-14 sm:px-10 sm:pt-20 lg:grid-cols-12">
        <div className="lg:col-span-7 lg:pr-10">
          <h1 className="intro text-[clamp(2.6rem,5.4vw,5.75rem)] font-semibold leading-[0.98] tracking-[-0.025em]">
            Strategic leadership
            <span className="block pl-[0.9em] sm:pl-[1.6em]">to build more value<span className="text-primary">.</span></span>
          </h1>
          <div className="intro mt-10 flex items-end justify-between gap-8" style={{ animationDelay: "150ms" }}>
            <p className="max-w-lg text-lg leading-relaxed text-navy-foreground/80">
              Fractional CEO &amp; COO leadership for businesses ready to grow, scale and perform. We step inside, take ownership, and get it done.
            </p>
            <CircleArrow href={contactHref()} label="Schedule a conversation" tone="blue" />
          </div>

          <div id="services" className="mt-16 grid items-start gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-4">
              <Tile s={services[0]!} className="aspect-[4/5]" />
              <Tile s={services[2]!} className="aspect-[4/3]" />
            </div>
            <div className="flex flex-col gap-4 sm:pt-16">
              <Tile s={services[1]!} className="aspect-[4/3]" />
              <Tile s={services[3]!} className="aspect-[4/5]" />
            </div>
          </div>
        </div>

        <aside className="lg:col-span-5">
          <div className="lg:sticky lg:top-24">
            <a href="#approach" className="tile group intro min-h-[34rem] lg:min-h-[calc(100vh-8rem)]" style={{ animationDelay: "250ms" }}>
              <img src={heroImg} alt="" width={1920} height={1088} className="tile-img object-[75%_center]" />
              <div className="tile-shade-top" aria-hidden />
              <div className="relative p-7 sm:p-9">
                <p className="text-xs uppercase tracking-[0.14em]">Our approach</p>
                <p className="mt-4 text-[clamp(2rem,3.2vw,3rem)] font-light leading-[1.1]">Hands-on leadership. Measurable impact.</p>
              </div>
              <span className="btn-white relative m-7 mt-auto self-start sm:m-9 sm:mt-auto">Read our approach <ArrowRight className="h-4 w-4" /></span>
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Questions() {
  return (
    <section id="questions" className="bg-card py-24 sm:py-32">
      <div className="mx-auto grid max-w-[100rem] gap-12 px-5 sm:px-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary">Where we help</p>
          <h2 className="reveal mt-5 text-[clamp(2.2rem,4vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.02em]">
            The questions that keep leaders up at night<span className="text-primary">.</span>
          </h2>
          <p className="reveal mt-6 max-w-sm leading-relaxed text-muted-foreground">Most engagements start with one of these. Sound familiar?</p>
        </div>
        <ol className="lg:col-span-8">
          {questions.map(([q, s], i) => (
            <li key={q} className="reveal">
              <a href={contactHref()} className="question-row group">
                <span className="text-sm tabular-nums text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-serif text-[clamp(1.4rem,2.6vw,2.25rem)] leading-tight transition-colors group-hover:text-primary">{q}</span>
                <span className="hidden text-sm text-muted-foreground md:block">{s}</span>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-all group-hover:rotate-90 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground"><Plus className="h-4 w-4" /></span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Approach() {
  return (
    <section id="approach" className="bg-paper">
      <div className="mx-auto grid max-w-[100rem] lg:grid-cols-2">
        <img src={archImg} alt="Modern glass office building against a clear sky" loading="lazy" width={1280} height={1024} className="h-full min-h-[22rem] w-full object-cover" />
        <div className="px-5 py-20 sm:px-10 sm:py-28 lg:px-20">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary">The Mahoney approach</p>
          <h2 className="reveal mt-5 text-[clamp(2.4rem,4.6vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.02em]">
            Hands-on leadership.
            <span className="block pl-[1.2em] font-normal italic">Measurable impact.</span>
          </h2>
          <p className="reveal mt-8 max-w-xl text-lg leading-relaxed text-foreground/80">
            We don't hand over a deck and leave. We sit in the leadership meetings, take on real responsibilities, and stay close enough to the work to see whether it's actually changing.
          </p>
          <dl className="mt-12 divide-y border-y border-foreground/20">
            {[
              ["Embedded", "Part of your leadership team, inside the business day to day."],
              ["Practical", "Decisions, owners and dates. Nothing that only works on a slide."],
              ["Accountable", "Agreed measures of progress, reviewed openly and often."],
            ].map(([t, b]) => (
              <div key={t} className="reveal grid gap-2 py-6 sm:grid-cols-[10rem_1fr]">
                <dt className="font-serif text-2xl">{t}</dt>
                <dd className="leading-relaxed text-muted-foreground sm:pt-1">{b}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function HowWeWork() {
  return (
    <section id="how-we-work" className="bg-navy-deep py-24 text-navy-foreground sm:py-32">
      <div className="mx-auto max-w-[100rem] px-5 sm:px-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <h2 className="reveal text-[clamp(2.4rem,5vw,4.5rem)] font-semibold leading-[1] tracking-[-0.02em]">
            How we work<span className="text-primary">.</span>
          </h2>
          <p className="reveal max-w-md text-lg text-navy-foreground/70">Three stages, no mystery. Every engagement is shaped around your business — the rhythm stays the same.</p>
        </div>
        <ol className="mt-16 grid border-t border-navy-foreground/20 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.n} className="reveal step-col" style={{ transitionDelay: `${i * 120}ms` }}>
              <span className="step-num">{s.n}</span>
              <h3 className="mt-8 text-3xl font-semibold">{s.title}</h3>
              <p className="mt-4 max-w-sm leading-relaxed text-navy-foreground/70">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Contact() {
  const ready = Boolean(site.bookingUrl || site.email);
  return (
    <section id="contact" className="relative overflow-hidden bg-primary text-primary-foreground">
      <Monogram tone="dark" className="pointer-events-none absolute -bottom-[12%] -right-[6%] w-[48rem] max-w-[90vw] opacity-[0.12] mix-blend-luminosity" />
      <div className="relative mx-auto max-w-[100rem] px-5 py-24 sm:px-10 sm:py-36">
        <h2 className="reveal text-[clamp(3rem,9vw,9rem)] font-semibold leading-[0.95] tracking-[-0.03em]">
          Let's build
          <span className="block pl-[0.8em] italic font-normal">what's next.</span>
        </h2>
        <div className="mt-14 flex flex-col gap-10 border-t border-primary-foreground/30 pt-10 md:flex-row md:items-center md:justify-between">
          <p className="max-w-lg text-lg leading-relaxed text-primary-foreground/90">
            Fractional CEO or COO, sorting out operations, or a partner for the next stage of growth — it starts with a straightforward conversation.
          </p>
          {ready ? (
            <a href={contactHref()} className="btn-white">Schedule a conversation <ArrowRight className="h-4 w-4" /></a>
          ) : (
            <p className="text-sm text-primary-foreground/85">Online booking opens soon.</p>
          )}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-navy-deep text-navy-foreground">
      <div className="mx-auto grid max-w-[100rem] gap-10 px-5 py-16 sm:px-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-navy-foreground/55">Strategy consulting and fractional CEO &amp; COO advisory.</p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-3 text-sm text-navy-foreground/70 md:col-span-4">
          {[...nav, { href: "#contact", label: "Contact" }].map((n) => <a key={n.href} href={n.href} className="hover:text-navy-foreground">{n.label}</a>)}
        </nav>
        <div className="flex flex-col gap-3 text-sm text-navy-foreground/70 md:col-span-3 md:items-end">
          {site.linkedinUrl && <a href={site.linkedinUrl} className="hover:text-navy-foreground">LinkedIn</a>}
          <a href={site.privacyUrl} className="hover:text-navy-foreground">Privacy</a>
          <a href={site.termsUrl} className="hover:text-navy-foreground">Terms</a>
          <Link to="/brand" className="hover:text-navy-foreground">Brand</Link>
        </div>
      </div>
      <div className="mx-auto max-w-[100rem] border-t border-navy-foreground/10 px-5 py-6 text-xs text-navy-foreground/45 sm:px-10">
        © {new Date().getFullYear()} Mahoney Consulting · Mahoney.consulting
      </div>
    </footer>
  );
}

function Index() {
  useReveal();
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">Skip to content</a>
      <Header />
      <main id="main">
        <Hero />
        <Questions />
        <Approach />
        <HowWeWork />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
