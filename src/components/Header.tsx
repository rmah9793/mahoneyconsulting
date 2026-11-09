import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { contactHref, nav, site } from "../site";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 ${
        scrolled || open ? "bg-liquid-abyss/90" : "bg-transparent"
      }`}
    >
      <div className="mx-auto grid h-20 w-[min(1440px,calc(100%-2.5rem))] grid-cols-[1fr_auto] items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
        <a href="#top" className="block w-[168px] sm:w-[198px]" onClick={close}>
          <Logo className="h-auto w-full" />
        </a>

        <button
          type="button"
          className="justify-self-end rounded-md border border-white/15 px-3 py-2 text-[12px] uppercase tracking-[0.12em] text-platinum md:hidden"
          aria-expanded={open}
          aria-controls="site-nav"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>

        <nav
          id="site-nav"
          aria-label="Main"
          className={`${
            open
              ? "absolute left-4 right-4 top-[76px] flex flex-col items-stretch gap-5 rounded-[16px] bg-liquid-kelp p-6"
              : "hidden"
          } md:col-start-2 md:flex md:flex-row md:items-center md:gap-4 md:bg-transparent md:p-0`}
        >
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={close}
              className="text-[12px] font-normal uppercase tracking-[0.12em] text-silver-mist transition-colors hover:text-platinum"
            >
              {item.label}
            </a>
          ))}
          <div className="md:hidden">
            <a href={contactHref()} onClick={close} className="aurora-cta">
              {site.cta}
            </a>
          </div>
        </nav>

        <div className="hidden justify-self-end md:block">
          <a href={contactHref()} className="aurora-cta !px-5 !py-3">
            {site.cta}
          </a>
        </div>
      </div>
    </header>
  );
}
