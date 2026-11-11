import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useRef, useState } from "react";
import { ArrowUpRight, Play } from "lucide-react";
import heroImg from "@/assets/hero-working-room.jpg";
import workshopImg from "@/assets/approach-workshop.jpg";
import directionImg from "@/assets/tile-direction.jpg";
import opsImg from "@/assets/tile-operations.jpg";
import sessionImg from "@/assets/tile-session.jpg";
import { Logo } from "@/components/Logo";
import { FilmOverlay } from "@/components/FilmOverlay";
import { QuestionPuzzle } from "@/components/QuestionPuzzle";
import { useHomeMotion } from "@/components/useHomeMotion.tsx";
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
  { img: directionImg, w: 864, h: 1152, alt: "Someone at a work table, seen from behind", tag: "Fractional CEO", title: "Direction, decisions and a team pulling the same way", body: "Senior leadership to set strategy and lead the business into its next stage — without a full-time executive hire." },
  { img: opsImg, w: 864, h: 1152, alt: "A machinist at a bench in a small workshop", tag: "Fractional COO", title: "Operations that keep up with the ambition", body: "Process, structure and cadence for businesses that have outgrown how they run." },
  { img: sessionImg, w: 864, h: 1152, alt: "Two people working at a table in a plain meeting room", tag: "Strategy & Execution", title: "A plan you can actually run on Monday", body: "Fewer priorities, clear owners, a weekly rhythm — and someone accountable for keeping it moving." },
  { img: workshopImg, w: 1280, h: 720, alt: "A brick workshop at dusk, roller door open", tag: "Growth & Value", title: "Building a business that's worth more", body: "Focus on the levers that matter for revenue, margin and long-term enterprise value." },
];

const questions = [
  ["We've grown fast. Why does everything feel harder?", "Fractional COO"],
  ["We have a strategy. Why isn't anything changing?", "Strategy & Execution"],
  ["The founder is the bottleneck. What now?", "Fractional CEO"],
  ["How do we get the business ready for investment or sale?", "Growth & Value"],
  ["We need senior leadership — but not a full-time hire yet.", "Fractional CEO / COO"],
];

const beliefs = [
  "We don't hand over a deck and leave.",
  "We sit in the leadership meetings.",
  "We take on real responsibilities.",
  "We stay close enough to the work to see whether it's actually changing.",
  "Success is not needing us.",
];

const steps = [
  { n: 1, title: "Understand", body: "Conversations with leadership and the team, a hard look at the numbers, and an honest read of where things stand." },
  { n: 2, title: "Lead", body: "We take on agreed responsibilities inside the business and work alongside your people, week in, week out." },
  { n: 3, title: "Deliver", body: "Routines, ownership and capability that hold up after we step back. Success is not needing us." },
];

const principles = [
  ["Embedded", "Part of your leadership team, inside the business day to day."],
  ["Practical", "Decisions, owners and dates. Nothing that only works on a slide."],
  ["Accountable", "Agreed measures of progress, reviewed openly and often."],
];

function Header() {
  return (
    <>
      <header id="siteHeader" data-tone="dark" data-menu="closed" className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto flex max-w-[96rem] items-center gap-2 px-5 py-4 sm:px-8 lg:py-5">
          <a href="#top" aria-label="Mahoney.consulting — home" className="relative block shrink-0">
            <span id="headerLogo" className="relative block">
              <span className="logo-on-dark block"><Logo tone="dark" /></span>
              <span className="logo-on-light block" aria-hidden><Logo tone="light" /></span>
            </span>
          </a>
          <nav id="headerTabs" aria-label="Primary" className="ml-auto hidden items-center gap-1 lg:flex">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-current/10">{n.label}</a>
            ))}
          </nav>
          <a href={contactHref()} className="header-cta pill pill-glass ml-3 hidden lg:inline-flex">Schedule a conversation</a>
          <button id="menuButton" type="button" aria-expanded="false" aria-controls="menuOverlay" aria-label="Open menu" className="relative ml-auto grid h-11 w-11 place-items-center rounded-full lg:hidden">
            <span className="menu-line menu-line-1" />
            <span className="menu-line menu-line-2" />
          </button>
        </div>
      </header>

      <div id="menuOverlay" role="dialog" aria-label="Menu" aria-hidden="true" data-lenis-prevent className="fixed inset-0 z-40 flex flex-col justify-between overflow-y-auto bg-navy-deep px-5 pb-8 pt-28 text-navy-foreground sm:px-8 lg:hidden">
        <nav aria-label="Menu">
          <ul>
            {[...nav, { href: "#contact", label: "Contact" }].map((n) => (
              <li key={n.href} className="overflow-hidden">
                <a href={n.href} data-menu-link className="block pb-1 font-serif text-[clamp(2.4rem,11vw,4.5rem)] font-medium leading-[1.08] tracking-[-0.03em]">{n.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-10 grid gap-8">
          <div data-menu-fade><a href={contactHref()} className="pill pill-blue">Schedule a conversation</a></div>
          {site.offices.length > 0 && (
            <ul data-menu-fade className="grid gap-4 border-t border-navy-foreground/20 pt-6">
              {site.offices.map((o, i) => (
                <li key={o.city} data-clock={i} className="flex items-center gap-3">
                  <span className="relative h-9 w-9 rounded-full border border-navy-foreground/40" aria-hidden>
                    <span data-hand="h" className="clock-hand h-2.5" />
                    <span data-hand="m" className="clock-hand h-3.5" />
                  </span>
                  <span className="text-sm">{o.city}, {o.country}<span data-time className="block text-xs tabular-nums text-navy-foreground/60" /></span>
                  <span data-scramble={o.coords} className="ml-auto text-xs tabular-nums text-navy-foreground/60">{o.coords}</span>
                </li>
              ))}
            </ul>
          )}
          <div data-menu-fade className="flex flex-wrap gap-x-6 gap-y-2 border-t border-navy-foreground/20 pt-6 text-sm text-navy-foreground/75">
            {site.email && <a href={`mailto:${site.email}`}>{site.email}</a>}
            {site.linkedinUrl && <a href={site.linkedinUrl}>LinkedIn</a>}
            <a href={site.privacyUrl}>Privacy</a>
            <a href={site.termsUrl}>Terms</a>
          </div>
        </div>
      </div>
    </>
  );
}

function Hero({ onFilm }: { onFilm: () => void }) {
  return (
    <section id="top" className="relative h-[100svh] min-h-[38rem] overflow-hidden bg-navy-deep text-navy-foreground">
      <div data-hero-media className="absolute inset-x-0 -top-[14%] h-[128%]">
        <img data-hero-still src={heroImg} alt="A meeting room with someone standing at the window" width={1280} height={720} fetchPriority="high" className="h-full w-full object-cover object-[70%_center]" />
      </div>
      <div className="absolute inset-0 bg-hero-overlay opacity-80" aria-hidden />
      <div className="absolute inset-0 bg-hero-fade" aria-hidden />
      <div data-hero-content className="relative z-10 mx-auto flex h-full max-w-[96rem] flex-col justify-end px-5 pb-10 sm:px-8 sm:pb-14">
        <h1 data-hero-title className="max-w-[15ch] text-balance font-serif text-[clamp(3rem,8.4vw,8.5rem)] font-medium leading-[0.95] tracking-[-0.04em]">
          Strategic leadership to build more value.
        </h1>
        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <p data-hero-rise className="max-w-xl text-lg leading-relaxed text-navy-foreground/85">
            Fractional CEO &amp; COO leadership for businesses ready to grow, scale and perform. We step inside, take ownership, and get it done.
          </p>
          <div data-hero-rise className="flex flex-wrap items-center gap-3">
            <a href={contactHref()} className="pill pill-white">Schedule a conversation</a>
            {site.filmUrl && (
              <button type="button" onClick={onFilm} className="pill pill-glass gap-2"><Play className="h-3.5 w-3.5 fill-current" />Watch the film</button>
            )}
            <a href="#questions" className="pill pill-glass">Where we help</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHead({ title, copy, children, className = "" }: { title: string; copy?: string; children?: React.ReactNode; className?: string }) {
  return (
    <div data-section-head className={className}>
      <h2 data-head-title className="max-w-[16ch] text-balance font-serif text-[clamp(2.4rem,5.6vw,5.2rem)] font-medium leading-[1] tracking-[-0.035em]">{title}</h2>
      {copy && <p data-head-copy className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">{copy}</p>}
      {children && <div data-head-action className="mt-8">{children}</div>}
    </div>
  );
}

function Services() {
  return (
    <section id="services" className="bg-card">
      <div className="mx-auto max-w-[76rem] px-5 py-24 sm:px-8 sm:py-32">
        <SectionHead title="The work we take on." copy="Fractional leadership and hands-on execution, shaped around your business." />
        <ol className="mt-16 grid gap-5 md:grid-cols-2 md:gap-6">
          {services.map((s, i) => (
            <li key={s.tag} className={i % 2 === 1 ? "md:mt-24" : ""}>
              <a data-card href={contactHref()} className="group relative block aspect-[4/5] overflow-hidden rounded-[10px] bg-navy-deep text-navy-foreground">
                <img data-pan src={s.img} alt={s.alt} width={s.w} height={s.h} loading="lazy" className="absolute inset-x-0 -top-[10%] h-[120%] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]" />
                <span className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/45 to-transparent" aria-hidden />
                <span data-card-body className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 sm:p-8">
                  <span>
                    <span className="block text-xs font-medium uppercase tracking-[0.14em] text-navy-foreground/70">{s.tag}</span>
                    <span className="mt-4 block font-serif text-[clamp(1.6rem,2.4vw,2.2rem)] font-medium leading-[1.1] tracking-[-0.02em]">{s.title}</span>
                    <span className="mt-3 block max-w-md text-sm leading-relaxed text-navy-foreground/80">{s.body}</span>
                  </span>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/40 bg-white/10 backdrop-blur transition-colors group-hover:bg-white group-hover:text-navy-deep" aria-hidden>
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Questions() {
  return (
    <section id="questions" className="bg-background">
      <div className="mx-auto max-w-[76rem] px-5 py-24 sm:px-8 sm:py-32">
        <SectionHead title="The questions that keep leaders up at night." copy="Most engagements start with one of these. The last piece is yours." />
        <QuestionPuzzle questions={questions} href={contactHref()} />
      </div>
    </section>
  );
}

function Approach() {
  return (
    <>
      <section id="approach" className="belief-section relative min-h-[100svh] overflow-hidden bg-background">
        <div data-belief-media className="belief-media absolute inset-0 bg-navy-deep">
          <img src={workshopImg} alt="A brick workshop at dusk, roller door open" width={1280} height={720} loading="lazy" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-navy-deep/70" aria-hidden />
        </div>
        <div data-belief-content className="relative z-10 mx-auto grid min-h-[100svh] max-w-[96rem] content-center gap-10 px-8 py-24 text-navy-foreground sm:px-14 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <h2 className="text-balance font-serif text-[clamp(2.2rem,4.4vw,4.2rem)] font-medium leading-[1.02] tracking-[-0.035em]">Hands-on leadership. Measurable impact.</h2>
            <a href="#how-we-work" className="pill pill-glass mt-8 hidden lg:inline-flex">See how we work</a>
          </div>
          <div data-belief-list className="lg:col-span-7">
            <ul data-belief-track className="grid gap-6">
              {beliefs.map((b) => (
                <li key={b} className="font-serif text-[clamp(1.6rem,3.4vw,3rem)] font-medium leading-[1.12] tracking-[-0.025em]">{b}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className="bg-background">
        <dl data-approach-details className="mx-auto grid max-w-[76rem] gap-0 border-t border-border px-5 sm:px-8 md:grid-cols-3">
          {principles.map(([t, b]) => (
            <div key={t} data-aitem className="border-b border-border py-10 md:border-b-0 md:border-l md:px-8 md:first:border-l-0 md:first:pl-0">
              <dt className="font-serif text-3xl font-medium tracking-[-0.02em]">{t}</dt>
              <dd className="mt-3 max-w-xs leading-relaxed text-muted-foreground">{b}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}

function HowWeWork() {
  return (
    <section id="how-we-work" className="bg-card">
      <div className="mx-auto max-w-[76rem] px-5 py-24 sm:px-8 sm:py-32">
        <SectionHead title="Three stages, no mystery." copy="Every engagement is shaped around your business — the rhythm stays the same." />
        <ol className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((s) => (
            <li key={s.n} data-step className="border-t border-navy/20 pt-6">
              <span data-count={s.n} className="block font-serif text-[clamp(4.5rem,9vw,8rem)] font-medium leading-[0.85] tracking-[-0.05em] tabular-nums text-primary">0{s.n}</span>
              <h3 data-step-rest className="mt-8 font-serif text-3xl font-medium tracking-[-0.02em]">{s.title}</h3>
              <p data-step-rest className="mt-4 max-w-sm leading-relaxed text-muted-foreground">{s.body}</p>
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
    <section id="contact" className="bg-background">
      <div className="mx-auto max-w-[76rem] px-5 py-28 sm:px-8 sm:py-40">
        <h2 data-c-title className="max-w-[12ch] text-balance font-serif text-[clamp(3rem,8vw,7.5rem)] font-medium leading-[0.96] tracking-[-0.04em]">Let's build what's next.</h2>
        <p data-c-copy className="mt-8 max-w-lg text-lg leading-relaxed text-navy/80">
          Fractional CEO or COO, sorting out operations, or a partner for the next stage of growth — it starts with a straightforward conversation.
        </p>
        <div data-c-action className="mt-8">
          {ready ? (
            <a href={contactHref()} className="pill pill-blue">Schedule a conversation</a>
          ) : (
            <p className="text-sm text-muted-foreground">Online booking opens soon.</p>
          )}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="footer" className="overflow-hidden bg-navy-deep text-navy-foreground">
      <div data-footer-inner className="mx-auto max-w-[96rem] px-5 pb-8 pt-24 sm:px-8 sm:pt-32">
        <p data-footer-tag className="max-w-[14ch] text-balance font-serif text-[clamp(2.8rem,9vw,9rem)] font-medium leading-[0.95] tracking-[-0.04em]">Clarity to lead. Capability to deliver.</p>
        <div className="mt-20 grid gap-10 border-t border-navy-foreground/15 pt-10 md:grid-cols-12">
          <div data-footer-col className="md:col-span-5">
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-navy-foreground/70">Strategy consulting and fractional CEO &amp; COO advisory.</p>
          </div>
          <nav data-footer-col aria-label="Footer" className="grid grid-cols-2 content-start gap-3 text-sm text-navy-foreground/80 md:col-span-4">
            {[...nav, { href: "#contact", label: "Contact" }].map((n) => <a key={n.href} href={n.href} className="hover:text-navy-foreground">{n.label}</a>)}
          </nav>
          <div data-footer-col className="flex flex-col gap-3 text-sm text-navy-foreground/80 md:col-span-3 md:items-end">
            {site.email && <a href={`mailto:${site.email}`} className="hover:text-navy-foreground">{site.email}</a>}
            {site.linkedinUrl && <a href={site.linkedinUrl} className="hover:text-navy-foreground">LinkedIn</a>}
            <a href={site.privacyUrl} className="hover:text-navy-foreground">Privacy</a>
            <a href={site.termsUrl} className="hover:text-navy-foreground">Terms</a>
            <Link to="/brand" className="hover:text-navy-foreground">Brand</Link>
          </div>
        </div>
        <p className="mt-12 text-xs text-navy-foreground/65">© {new Date().getFullYear()} Mahoney Consulting · Mahoney.consulting</p>
      </div>
    </footer>
  );
}

function Index() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [film, setFilm] = useState(false);
  const closeFilm = useCallback(() => setFilm(false), []);
  useHomeMotion(rootRef);
  return (
    <div ref={rootRef}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:bg-primary focus:px-4 focus:py-2 focus:text-navy-deep">Skip to content</a>
      <Header />
      <main id="main">
        <Hero onFilm={() => setFilm(true)} />
        <Services />
        <Questions />
        <Approach />
        <HowWeWork />
        <Contact />
      </main>
      <Footer />
      {site.filmUrl && <FilmOverlay src={site.filmUrl} open={film} onClose={closeFilm} />}
    </div>
  );
}
