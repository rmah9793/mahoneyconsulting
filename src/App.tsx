import { Header } from "./components/Header";
import { KineticText } from "./components/KineticText";
import { Logo } from "./components/Logo";
import { Molecule } from "./components/Molecule";
import { ParticleSphere } from "./components/ParticleSphere";
import { contactHref, services, site, steps } from "./site";

export default function App() {
  return (
    <div id="top" className="min-h-screen bg-liquid-abyss text-silver-mist">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Explore />
        <Approach />
        <Process />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

function ArrowButton() {
  return (
    <span
      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-liquid-kelp text-platinum"
      aria-hidden="true"
    >
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5">
        <path
          d="M4 12 12 4M6 4h6v6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function Hero() {
  return (
    <section className="relative isolate flex min-h-svh items-center overflow-hidden [perspective:1200px]">
      <ParticleSphere />
      <div className="pointer-events-none absolute inset-x-0 top-[62%] flex justify-center">
        <KineticText
          className="font-matter font-medium text-[clamp(6.5rem,28vw,17rem)] leading-none tracking-[-0.046em] text-platinum/12 will-change-transform"
          strength={64}
        >
          LEAD.
        </KineticText>
      </div>
      <div className="relative mx-auto w-[min(1440px,calc(100%-2.5rem))] -translate-y-[12%] py-32">
        <div className="mx-auto max-w-[640px] text-center">
          <p className="mb-8 text-[12px] font-medium uppercase tracking-[0.12em] text-silver-mist">
            Mahoney
          </p>
          <h1 className="mb-7 font-medium text-[clamp(2.5rem,7vw,3.8rem)] leading-none tracking-[-0.04em] text-platinum">
            Strategic Leadership
            <br />
            to Build More Value.
          </h1>
          <p className="mx-auto mb-10 max-w-[520px] text-base leading-[1.4] text-silver-mist">
            {site.description}
          </p>
          <div className="flex justify-center">
            <a href={contactHref()} className="aurora-cta">
              {site.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Explore() {
  return (
    <section id="services" className="scroll-mt-24 py-[68px]">
      <div className="mx-auto grid w-[min(1440px,calc(100%-2.5rem))] items-start gap-16 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div>
          <p className="mb-6 text-[12px] font-medium uppercase tracking-[0.12em] text-silver-mist">
            Explore
          </p>
          <h2 className="mb-12 max-w-[16ch] text-[clamp(2.1rem,4vw,3rem)] leading-none font-medium tracking-[-0.04em] text-platinum">
            Fractional leadership for the next stage.
          </h2>
          <div className="flex flex-col">
            {services.map((service) => (
              <a
                key={service.title}
                href="#contact"
                className="group flex items-start justify-between gap-6 rounded-[16px] px-9 py-12 transition-colors hover:bg-liquid-kelp"
              >
                <div>
                  <h3 className="mb-3 text-[36px] leading-none font-medium text-platinum">
                    {service.title}
                  </h3>
                  <p className="max-w-[42ch] text-base leading-[1.4] text-silver-mist">{service.body}</p>
                </div>
                <ArrowButton />
              </a>
            ))}
          </div>
        </div>
        <div className="hidden min-h-[520px] items-center justify-center [perspective:900px] lg:flex">
          <KineticText className="w-full max-w-[420px] will-change-transform" strength={18}>
            <Molecule className="w-full" />
          </KineticText>
        </div>
      </div>
    </section>
  );
}

function Approach() {
  return (
    <section id="approach" className="scroll-mt-24 py-[68px] [perspective:1200px]">
      <div className="mx-auto grid w-[min(1440px,calc(100%-2.5rem))] items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <KineticText className="font-matter font-medium text-[clamp(4.5rem,14vw,11rem)] leading-none tracking-[-0.046em] text-platinum/20 will-change-transform">
          LEAD.
        </KineticText>
        <div className="rounded-[16px] bg-liquid-kelp p-9 md:p-12">
          <p className="mb-6 text-[12px] font-medium uppercase tracking-[0.12em] text-liquid-mist">
            Approach
          </p>
          <h2 className="mb-6 text-[clamp(2.1rem,4vw,2.25rem)] leading-none font-medium tracking-[-0.02em] text-platinum">
            Hands-On Leadership.
            <br />
            Measurable Impact.
          </h2>
          <p className="mb-8 max-w-[52ch] text-base leading-[1.4] text-silver-mist">{site.approachBody}</p>
          <ul className="flex flex-col gap-3 text-[13px] uppercase tracking-[0.055em] text-liquid-mist">
            {["Embedded leadership", "Practical execution", "Clear accountability"].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section id="process" className="scroll-mt-24 py-[68px]">
      <div className="mx-auto w-[min(1440px,calc(100%-2.5rem))]">
        <p className="mb-6 text-[12px] font-medium uppercase tracking-[0.12em] text-silver-mist">
          How we work
        </p>
        <h2 className="mb-12 max-w-[16ch] text-[clamp(2.1rem,4vw,3rem)] leading-none font-medium tracking-[-0.04em] text-platinum">
          From clarity to execution.
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          {steps.map((step) => (
            <article key={step.number} className="rounded-[16px] bg-liquid-kelp p-9">
              <p className="mb-8 text-[13px] uppercase tracking-[0.055em] text-liquid-mist">
                {step.number} / {step.label}
              </p>
              <h3 className="mb-4 text-[36px] leading-none font-medium text-platinum">{step.title}</h3>
              <p className="text-base leading-[1.4] text-silver-mist">{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="scroll-mt-24 px-[min(2.5rem,calc((100%-1440px)/2+2.5rem))] pb-[68px]">
      <div className="rounded-[16px] bg-liquid-deep px-8 py-[120px] text-center">
        <p className="mb-6 text-[12px] font-medium uppercase tracking-[0.12em] text-silver-mist">
          Begin a conversation
        </p>
        <h2 className="mb-6 text-[clamp(2.1rem,5vw,3.8rem)] leading-none font-medium tracking-[-0.04em] text-platinum">
          Let’s Build What’s Next.
        </h2>
        <p className="mx-auto mb-10 max-w-[520px] text-base leading-[1.4] text-silver-mist">
          Whether you need a fractional CEO or COO, strategic clarity, or operational support, start
          with a conversation about your goals.
        </p>
        <a href={contactHref()} className="aurora-cta">
          {site.cta}
        </a>
        <p className="mt-8 text-[14px] text-silver-mist">
          <a className="hover:text-platinum" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          <span aria-hidden="true"> · </span>
          {site.location}
        </p>
      </div>
    </section>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-liquid-deep py-[120px] text-[14px] text-silver-mist">
      <div className="mx-auto flex w-[min(1440px,calc(100%-2.5rem))] flex-col items-center justify-between gap-10 md:flex-row md:items-end">
        <Logo className="w-[198px]" />
        <p className="uppercase tracking-[0.12em] text-[12px]">
          Strategy · Operations · Executive Leadership
        </p>
        <div className="text-center md:text-right">
          <p>© {year} Mahoney Consulting</p>
          <p className="mt-2 text-slate-deep">
            Privacy — to be added · Terms — to be added
          </p>
        </div>
      </div>
    </footer>
  );
}
