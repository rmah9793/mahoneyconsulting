import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import Lenis from "lenis";
import { site } from "@/config/site";

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);

const HIDDEN = (y = 0, blur = 8) => ({ opacity: 0, y, filter: `blur(${blur}px)` });
const SHOWN = { opacity: 1, y: 0, filter: "blur(0px)" };
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) =>
  t <= 0 ? 0 : t >= 1 ? 1 : t < 0.5 ? Math.pow(2 * t, 3.5) / 2 : 1 - Math.pow(2 * (1 - t), 3.5) / 2;

/** A reveal target: a plain element, or SplitText output that can re-split on resize. */
type Target = { get: () => Element[]; set: (shown: boolean) => void };

function plain(el: Element | Element[], y: number, blur = 8): Target {
  const list = Array.isArray(el) ? el : [el];
  return {
    get: () => list,
    set: (shown) => gsap.set(list, shown ? { ...SHOWN, clearProps: "filter" } : HIDDEN(y, blur)),
  };
}

function chars(el: HTMLElement, y: number, blur = 8): { target: Target; split: SplitText } {
  const split = SplitText.create(el, { type: "words,chars" });
  return {
    split,
    target: {
      get: () => split.chars,
      set: (shown) => gsap.set(split.chars, shown ? SHOWN : HIDDEN(y, blur)),
    },
  };
}

function lines(el: HTMLElement, y: number, blur = 6): Target {
  let current: Element[] = [];
  let shown = false;
  SplitText.create(el, {
    type: "lines",
    autoSplit: true,
    onSplit(self) {
      current = self.lines;
      gsap.set(current, shown ? SHOWN : HIDDEN(y, blur));
    },
  });
  return {
    get: () => current,
    set: (s) => {
      shown = s;
      gsap.set(current, s ? SHOWN : HIDDEN(y, blur));
    },
  };
}

type Group = {
  target: Target;
  duration?: number;
  stagger?: number;
  /** how much of the previous group must finish before this one starts (0..1) */
  overlap?: number;
  ease?: string;
};

function buildReveal(groups: Group[]) {
  const tl = gsap.timeline();
  let prevEnd = 0;
  groups.forEach((g, i) => {
    const els = g.target.get();
    const dur = g.duration ?? 0.6;
    const stg = g.stagger ?? 0;
    const total = dur + stg * Math.max(0, els.length - 1);
    const at = i === 0 ? 0 : prevEnd - total * (g.overlap ?? 0.5);
    tl.to(
      els,
      { ...SHOWN, duration: dur, stagger: stg, ease: g.ease ?? "power3.out", overwrite: "auto" },
      Math.max(0, at),
    );
    prevEnd = Math.max(0, at) + total;
  });
  return tl;
}

export function useHomeMotion(scope: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = scope.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const html = document.documentElement;
    const ctx = gsap.context(() => {}, root);
    let cancelled = false;
    let lenis: Lenis | null = null;
    const cleanups: Array<() => void> = [];

    const q = <T extends HTMLElement>(s: string) => root.querySelector<T>(s);
    const qa = (s: string) => Array.from(root.querySelectorAll<HTMLElement>(s));

    /* ---------------------------------------------------- smooth scroll */
    if (!reduce) {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        syncTouch: true,
        autoRaf: false,
        anchors: true,
        stopInertiaOnNavigate: true,
      });
      const l = lenis;
      l.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => l.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      cleanups.push(() => {
        gsap.ticker.remove(tick);
        l.destroy();
      });
    }

    /* ---------------------------------------------------- menu (works with or without motion) */
    const menuButton = q<HTMLButtonElement>("#menuButton");
    const overlay = q<HTMLElement>("#menuOverlay");
    const header = q<HTMLElement>("#siteHeader");
    let menuOpen = false;
    let menuTl: gsap.core.Timeline | null = null;
    let menuSplits: SplitText[] = [];

    const setMenuState = (open: boolean) => {
      menuOpen = open;
      if (!menuButton || !overlay || !header) return;
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      header.setAttribute("data-menu", open ? "open" : "closed");
      overlay.setAttribute("aria-hidden", String(!open));
      if (open) overlay.removeAttribute("inert");
      else overlay.setAttribute("inert", "");
      if (open) lenis?.stop();
      else lenis?.start();
      document.body.style.overflow = open ? "hidden" : "";
    };

    const buildMenu = () => {
      if (!menuButton || !overlay) return;
      overlay.setAttribute("inert", "");
      const origin = () => {
        const r = menuButton.getBoundingClientRect();
        return `${r.left + r.width / 2}px ${r.top + r.height / 2}px`;
      };
      const l1 = q(".menu-line-1");
      const l2 = q(".menu-line-2");
      const items = qa("[data-menu-link]");
      if (!reduce) {
        menuSplits = items.map((el) => SplitText.create(el, { type: "words,chars", mask: "chars" }));
        const allChars = menuSplits.flatMap((s) => s.chars);
        const rest = qa("[data-menu-fade]");
        gsap.set(overlay, { clipPath: `circle(0px at ${origin()})` });
        gsap.set(allChars, { yPercent: 110 });
        gsap.set(rest, { opacity: 0, y: 24 });
        menuTl = gsap.timeline({ paused: true });
        menuTl
          .set(overlay, { visibility: "visible" }, 0)
          .to(l1, { y: 3.5, rotation: 45, duration: 0.3, ease: "power2.inOut" }, 0)
          .to(l2, { y: -3.5, rotation: -45, duration: 0.3, ease: "power2.inOut" }, 0)
          .to(
            overlay,
            {
              clipPath: () => `circle(${Math.hypot(innerWidth, innerHeight) * 1.1}px at ${origin()})`,
              duration: 0.7,
              ease: "power3.inOut",
            },
            0,
          )
          .to(allChars, { yPercent: 0, duration: 0.7, ease: "power4.out", stagger: 0.02 }, 0.25)
          .to(rest, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.06 }, 0.45);
      }
      const toggle = () => {
        const next = !menuOpen;
        setMenuState(next);
        if (reduce || !menuTl) {
          gsap.set(overlay, { clipPath: next ? "none" : "circle(0px at 100% 0)", visibility: next ? "visible" : "hidden" });
          return;
        }
        menuTl.timeScale(next ? 1 : 1.5);
        next ? menuTl.play() : menuTl.reverse();
      };
      menuButton.addEventListener("click", toggle);
      const links = overlay.querySelectorAll("a");
      const closeIfOpen = () => menuOpen && toggle();
      links.forEach((a) => a.addEventListener("click", closeIfOpen));
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape" && menuOpen) {
          toggle();
          menuButton.focus();
        }
      };
      const onResize = () => {
        if (innerWidth >= 1024 && menuOpen) toggle();
      };
      window.addEventListener("keydown", onKey);
      window.addEventListener("resize", onResize);
      cleanups.push(() => {
        menuButton.removeEventListener("click", toggle);
        links.forEach((a) => a.removeEventListener("click", closeIfOpen));
        window.removeEventListener("keydown", onKey);
        window.removeEventListener("resize", onResize);
        menuSplits.forEach((s) => s.revert());
        menuTl?.kill();
        document.body.style.overflow = "";
        overlay.removeAttribute("style");
      });
      if (reduce) gsap.set(overlay, { visibility: "hidden" });
    };

    /* ---------------------------------------------------- clocks + scramble (only if offices are configured) */
    const buildClocks = () => {
      if (!site.offices.length) return;
      const fmt = site.offices.map(
        (o) =>
          new Intl.DateTimeFormat("en-GB", { timeZone: o.timeZone, hour: "2-digit", minute: "2-digit", hour12: false }),
      );
      const parts = (i: number) => {
        const [h = 0, m = 0] = fmt[i]!.format(new Date()).split(":").map(Number);
        return { h, m };
      };
      const tickClocks = () => {
        qa("[data-clock]").forEach((el) => {
          const i = Number(el.getAttribute("data-clock"));
          const { h, m } = parts(i);
          const hour = el.querySelector<HTMLElement>("[data-hand=h]");
          const min = el.querySelector<HTMLElement>("[data-hand=m]");
          if (hour) hour.style.transform = `rotate(${(h % 12) * 30 + m * 0.5}deg)`;
          if (min) min.style.transform = `rotate(${m * 6}deg)`;
          const label = el.querySelector<HTMLElement>("[data-time]");
          if (label) label.textContent = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
        });
      };
      tickClocks();
      const id = window.setInterval(tickClocks, 15000);
      cleanups.push(() => clearInterval(id));
      if (!reduce) {
        qa("[data-scramble]").forEach((el) => {
          const finalText = el.getAttribute("data-scramble") ?? "";
          el.addEventListener("mouseenter", () =>
            gsap.to(el, { duration: 0.8, scrambleText: { text: finalText, chars: "0123456789.°NSEW", speed: 0.6 } }),
          );
        });
        const first = qa("[data-scramble]");
        if (first.length && menuButton) {
          menuButton.addEventListener("click", () => {
            if (!menuOpen) return;
            first.forEach((el) =>
              gsap.fromTo(
                el,
                { scrambleText: { text: "", chars: "0123456789.°NSEW" } },
                { duration: 1.1, delay: 0.5, scrambleText: { text: el.getAttribute("data-scramble") ?? "", chars: "0123456789.°NSEW", speed: 0.5 } },
              ),
            );
          });
        }
      }
    };

    buildMenu();
    buildClocks();

    /* ---------------------------------------------------- everything else needs motion */
    if (reduce) {
      html.classList.remove("mo");
      return () => {
        cleanups.forEach((c) => c());
        ctx.revert();
      };
    }

    const fontsReady = Promise.race([
      document.fonts?.ready ?? Promise.resolve(),
      new Promise((r) => setTimeout(r, 2500)),
    ]);

    fontsReady.then(() => {
      if (cancelled) return;
      ctx.add(() => {
        const vh = () => window.innerHeight;

        /* ---- generic scroll reveals: [data-reveal="chars|lines|blur"] -------------------------------- */
        const wire = (
          trigger: Element,
          groups: Group[],
          start = "top 72%",
        ) => {
          groups.forEach((g) => g.target.set(false));
          let tl: gsap.core.Timeline | null = null;
          let shown = false;
          ScrollTrigger.create({
            trigger,
            start,
            onEnter: () => {
              if (shown) return;
              shown = true;
              tl?.kill();
              tl = buildReveal(groups);
            },
            onLeaveBack: () => {
              if (!shown) return;
              shown = false;
              tl?.kill();
              groups.forEach((g) => {
                gsap.to(g.target.get(), { ...HIDDEN(0, 6), duration: 0.25, overwrite: "auto" });
              });
              gsap.delayedCall(0.3, () => !shown && groups.forEach((g) => g.target.set(false)));
            },
          });
        };

        /* ---- header: tone switch + tabs hide on scroll-down ------------------------------------------ */
        const tabs = q("#headerTabs");
        const hero = q<HTMLElement>("#top");
        if (header && hero) {
          ScrollTrigger.create({
            trigger: hero,
            start: "top top",
            end: "bottom 80px",
            onLeave: () => header.setAttribute("data-tone", "light"),
            onEnterBack: () => header.setAttribute("data-tone", "dark"),
          });
        }
        if (tabs) {
          let hidden = false;
          ScrollTrigger.create({
            start: 0,
            end: "max",
            onUpdate: (s) => {
              const y = s.scroll();
              const shouldHide = s.direction === 1 && y > 160;
              const shouldShow = s.direction === -1 || y <= 160;
              if (shouldHide && !hidden) {
                hidden = true;
                gsap.to(tabs, { y: -24, opacity: 0, filter: "blur(6px)", duration: 0.4, ease: "power2.out", pointerEvents: "none" });
              } else if (shouldShow && hidden) {
                hidden = false;
                gsap.to(tabs, { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.4, ease: "power2.out", pointerEvents: "auto" });
              }
            },
          });
        }

        /* ---- hero intro + scroll ------------------------------------------------------------------- */
        const heroTitle = q<HTMLElement>("[data-hero-title]");
        if (heroTitle && hero) {
          const t = chars(heroTitle, 0, 14);
          t.target.set(false);
          const rise = qa("[data-hero-rise]");
          gsap.set(rise, HIDDEN(vh() * 0.08, 8));
          const media = q("[data-hero-still]");
          if (header) gsap.set(header, { y: -vh() * 0.16, opacity: 0 });
          if (media) gsap.set(media, { scale: 1.14 });
          gsap.set(heroTitle, { opacity: 1 });
          html.classList.remove("mo");

          const intro = gsap.timeline({ delay: 0.15 });
          if (media) intro.to(media, { scale: 1, duration: 2.2, ease: "power3.out" }, 0);
          if (header) intro.to(header, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", clearProps: "transform" }, 0);
          intro.to(t.split.chars, { ...SHOWN, duration: 0.55, stagger: 0.035, ease: "power2.out" }, 0.25);
          intro.to(rise, { ...SHOWN, duration: 0.8, stagger: 0.08, ease: "power3.out" }, ">-0.5");

          const heroMedia = q("[data-hero-media]");
          if (heroMedia) {
            gsap.fromTo(
              heroMedia,
              { yPercent: -8 },
              { yPercent: 8, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } },
            );
          }
          gsap.to(hero, {
            opacity: 0.5,
            ease: "none",
            scrollTrigger: { trigger: hero, start: "20% top", end: "bottom top", scrub: true },
          });
          const heroContent = q("[data-hero-content]");
          if (heroContent) {
            gsap.to(heroContent, {
              yPercent: -14,
              ease: "none",
              scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
            });
          }
        }

        /* ---- section headers ----------------------------------------------------------------------- */
        qa("[data-section-head]").forEach((sec) => {
          const label = sec.querySelector<HTMLElement>("[data-head-label]");
          const title = sec.querySelector<HTMLElement>("[data-head-title]");
          const copy = sec.querySelector<HTMLElement>("[data-head-copy]");
          const action = sec.querySelector<HTMLElement>("[data-head-action]");
          const groups: Group[] = [];
          if (label) groups.push({ target: plain(label, vh() * 0.03), duration: 0.5, overlap: 0 });
          if (title) {
            const t = chars(title, 0, 10);
            groups.push({ target: t.target, duration: 0.45, stagger: 0.025, overlap: 0.4 });
          }
          if (copy) groups.push({ target: lines(copy, vh() * 0.025), duration: 0.7, stagger: 0.08, overlap: 0.6 });
          if (action) groups.push({ target: plain(action, vh() * 0.03), duration: 0.6, overlap: 0.5 });
          wire(sec, groups, "top 68%");
        });

        /* ---- service cards: slide up + inner image parallax ---------------------------------------- */
        qa("[data-card]").forEach((card) => {
          const body = card.querySelector<HTMLElement>("[data-card-body]");
          const pan = card.querySelector("[data-pan]");
          gsap.fromTo(
            card,
            { opacity: 0, y: vh() * 0.14, scale: 0.96 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: { trigger: card, start: "top 88%", toggleActions: "play none none reverse" },
            },
          );
          if (pan) {
            gsap.fromTo(
              pan,
              { yPercent: -9 },
              { yPercent: 9, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true } },
            );
          }
          if (body) {
            gsap.fromTo(
              body,
              { opacity: 0, y: 28, filter: "blur(6px)" },
              {
                ...SHOWN,
                duration: 0.8,
                delay: 0.2,
                ease: "power3.out",
                scrollTrigger: { trigger: card, start: "top 75%", toggleActions: "play none none reverse" },
              },
            );
          }
        });

        /* ---- pinned zoom + centre-focus statements ------------------------------------------------- */
        const pin = q<HTMLElement>("#approach");
        if (pin) {
          const media = pin.querySelector<HTMLElement>("[data-belief-media]")!;
          const img = media.querySelector<HTMLElement>("img");
          const content = pin.querySelector<HTMLElement>("[data-belief-content]")!;
          const list = pin.querySelector<HTMLElement>("[data-belief-list]")!;
          const track = pin.querySelector<HTMLElement>("[data-belief-track]")!;
          const items = Array.from(track.children) as HTMLElement[];

          pin.setAttribute("data-pinned", "true");
          cleanups.push(() => pin.removeAttribute("data-pinned"));
          const geo = () => {
            const h = list.clientHeight;
            const ys = items.map((it) => h / 2 - (it.offsetTop + it.offsetHeight / 2));
            return { h, ys };
          };
          let g = geo();

          const place = (progress: number) => {
            // progress 0..1 across the statements only
            const n = items.length - 1;
            const scaled = clamp(progress) * n;
            const i = Math.min(Math.floor(scaled), n - 1);
            const local = n === 0 ? 0 : easeInOut(scaled - i);
            const y = n === 0 ? (g.ys[0] ?? 0) : lerp(g.ys[i] ?? 0, g.ys[i + 1] ?? 0, local);
            gsap.set(track, { y });
            items.forEach((it) => {
              const c = y + it.offsetTop + it.offsetHeight / 2;
              const d = clamp(Math.abs(c - g.h / 2) / (g.h * 0.5));
              const e = 1 - Math.pow(1 - d, 2); // 0 centre → 1 far
              gsap.set(it, {
                opacity: lerp(1, 0.14, Math.pow(d, 0.7)),
                scale: lerp(1, 0.86, e),
                filter: `blur(${lerp(0, 5, e)}px)`,
                rotateX: (c < g.h / 2 ? 1 : -1) * lerp(0, 34, e),
                transformPerspective: 900,
                transformOrigin: "left center",
              });
            });
          };

          const frame = (zoom: number, contentOpacity: number) => {
            const W = innerWidth;
            const cw = Math.min(W - 40, 1216);
            const ix = lerp((W - cw) / 2, 0, zoom);
            const iy = lerp(vh() * 0.1, 0, zoom);
            media.style.clipPath = `inset(${iy}px ${ix}px round ${lerp(10, 0, zoom)}px)`;
            if (img) img.style.transform = `scale(${lerp(1.18, 1, zoom)})`;
            content.style.opacity = String(contentOpacity);
          };

          const apply = (p: number) => {
            const zoomIn = easeInOut(clamp(p / 0.2));
            const zoomOut = easeInOut(clamp((p - 0.82) / 0.18));
            const z = zoomIn * (1 - zoomOut);
            const fadeIn = clamp((p - 0.04) / 0.14);
            const fadeOut = 1 - clamp((p - 0.84) / 0.1);
            frame(z, Math.min(fadeIn, fadeOut));
            place(clamp((p - 0.2) / 0.62));
          };

          const proxy = { p: 0 };
          apply(0);
          gsap.to(proxy, {
            p: 1,
            ease: "none",
            onUpdate: () => apply(proxy.p),
            scrollTrigger: {
              trigger: pin,
              start: "top top",
              end: "+=420%",
              pin: true,
              scrub: 0.5,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onRefresh: () => {
                g = geo();
                apply(proxy.p);
              },
            },
          });
        }

        /* ---- questions: pieces fly in and click together ------------------------------------------ */
        const grid = q("[data-qgrid]");
        const pieces = qa("[data-piece]");
        if (grid && pieces.length) {
          const spot = (el: HTMLElement) => {
            const i = Number(el.getAttribute("data-piece"));
            const cols = getComputedStyle(grid).gridTemplateColumns.split(" ").length;
            const col = i % cols;
            const row = Math.floor(i / cols);
            const rows = Math.ceil(pieces.length / cols);
            return {
              x: (col - (cols - 1) / 2) * Math.min(140, innerWidth * 0.12),
              y: (row - (rows - 1) / 2) * 90 - (i === pieces.length - 1 ? 70 : 0),
              rotation: (col - (cols - 1) / 2) * 8 + (i === pieces.length - 1 ? -12 : 0),
            };
          };
          const scatter = () => pieces.forEach((el) => gsap.set(el, { ...spot(el), opacity: 0, scale: 0.92 }));
          scatter();
          let locked = false;
          let played: gsap.core.Tween | null = null;
          const lift = (el: HTMLElement) => {
            if (!locked) return;
            const i = Number(el.getAttribute("data-piece"));
            const cols = getComputedStyle(grid).gridTemplateColumns.split(" ").length;
            pieces.forEach((other) => {
              const j = Number(other.getAttribute("data-piece"));
              if (other === el) {
                gsap.to(other, { y: -26, x: 0, scale: 1.045, rotation: i % 2 ? -2.5 : 2.5, duration: 0.45, ease: "back.out(2)", zIndex: 6 });
              } else {
                const dc = (j % cols) - (i % cols);
                const dr = Math.floor(j / cols) - Math.floor(i / cols);
                gsap.to(other, { x: Math.sign(dc) * 14, y: Math.sign(dr) * 12, scale: 1, rotation: 0, duration: 0.45, ease: "power3.out", zIndex: 1 });
              }
            });
          };
          const drop = () => {
            if (!locked) return;
            gsap.to(pieces, { x: 0, y: 0, scale: 1, rotation: 0, duration: 0.55, ease: "power3.out", zIndex: 1 });
          };
          const offs = pieces.map((el) => {
            const enter = () => lift(el);
            el.addEventListener("mouseenter", enter);
            el.addEventListener("mouseleave", drop);
            return () => {
              el.removeEventListener("mouseenter", enter);
              el.removeEventListener("mouseleave", drop);
            };
          });
          cleanups.push(() => offs.forEach((off) => off()));
          ScrollTrigger.create({
            trigger: grid,
            start: "top 78%",
            onEnter: () => {
              played?.kill();
              locked = false;
              played = gsap.to(pieces, {
                x: 0, y: 0, rotation: 0, opacity: 1, scale: 1,
                duration: 1.05,
                ease: "back.out(1.7)",
                stagger: { each: 0.08, from: "edges" },
                onComplete: () => { locked = true; },
              });
            },
            onLeaveBack: () => {
              locked = false;
              played?.kill();
              pieces.forEach((el) => gsap.to(el, { ...spot(el), opacity: 0, scale: 0.92, duration: 0.4, ease: "power2.in" }));
            },
          });
        }

        /* ---- approach details ---------------------------------------------------------------------- */
        const aside = q("[data-approach-details]");
        if (aside) {
          const items = Array.from(aside.querySelectorAll<HTMLElement>("[data-aitem]"));
          const intro = aside.querySelector<HTMLElement>("[data-aintro]");
          const groups: Group[] = [];
          if (intro) groups.push({ target: lines(intro, vh() * 0.02), duration: 0.7, stagger: 0.08, overlap: 0 });
          groups.push({ target: plain(items, vh() * 0.04), duration: 0.8, stagger: 0.12, overlap: 0.6 });
          wire(aside, groups, "top 75%");
        }

        /* ---- how we work: stat-style counters ------------------------------------------------------ */
        const how = q("#how-we-work");
        if (how) {
          const cols = qa("[data-step]");
          cols.forEach((col, i) => {
            const num = col.querySelector<HTMLElement>("[data-count]");
            const rest = Array.from(col.querySelectorAll<HTMLElement>("[data-step-rest]"));
            const target = Number(num?.getAttribute("data-count") ?? i + 1);
            const set = (v: number) => num && (num.textContent = String(Math.round(v)).padStart(2, "0"));
            set(0);
            gsap.set(col, { opacity: 0, y: vh() * 0.06, scale: 0.9 });
            gsap.set(rest, HIDDEN(18, 6));
            const counter = { v: 0 };
            let tl: gsap.core.Timeline | null = null;
            ScrollTrigger.create({
              trigger: col,
              start: "top 82%",
              onEnter: () => {
                tl?.kill();
                counter.v = 0;
                tl = gsap
                  .timeline({ delay: i * 0.12 })
                  .to(col, { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "power3.out" }, 0)
                  .to(counter, { v: target, duration: 1.4, ease: "power2.out", onUpdate: () => set(counter.v) }, 0.1)
                  .to(rest, { ...SHOWN, duration: 0.7, stagger: 0.1, ease: "power3.out" }, 0.4);
              },
              onLeaveBack: () => {
                tl?.kill();
                gsap.to(col, { opacity: 0, y: vh() * 0.06, scale: 0.9, duration: 0.3 });
                gsap.set(rest, HIDDEN(18, 6));
                counter.v = 0;
                set(0);
              },
            });
          });
        }

        /* ---- contact ------------------------------------------------------------------------------- */
        const contact = q("#contact");
        if (contact) {
          const label = contact.querySelector<HTMLElement>("[data-c-label]");
          const title = contact.querySelector<HTMLElement>("[data-c-title]");
          const copy = contact.querySelector<HTMLElement>("[data-c-copy]");
          const actions = Array.from(contact.querySelectorAll<HTMLElement>("[data-c-action]"));
          const groups: Group[] = [];
          if (label) groups.push({ target: plain(label, 16), duration: 0.5, overlap: 0 });
          if (title) groups.push({ target: chars(title, 0, 10).target, duration: 0.45, stagger: 0.022, overlap: 0.4 });
          if (copy) groups.push({ target: lines(copy, 16), duration: 0.7, stagger: 0.08, overlap: 0.6 });
          if (actions.length) groups.push({ target: plain(actions, 24), duration: 0.6, stagger: 0.08, overlap: 0.5 });
          wire(contact, groups, "top 65%");
        }

        /* ---- footer: slide + fade in, giant tagline ------------------------------------------------- */
        const footer = q("#footer");
        if (footer) {
          const inner = footer.querySelector<HTMLElement>("[data-footer-inner]");
          const tag = footer.querySelector<HTMLElement>("[data-footer-tag]");
          const cols = Array.from(footer.querySelectorAll<HTMLElement>("[data-footer-col]"));
          if (inner) {
            gsap.fromTo(
              inner,
              { y: vh() * 0.18, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                ease: "none",
                scrollTrigger: { trigger: footer, start: "top bottom", end: "top 35%", scrub: true },
              },
            );
          }
          const groups: Group[] = [];
          if (tag) groups.push({ target: chars(tag, 0, 12).target, duration: 0.5, stagger: 0.02, overlap: 0 });
          if (cols.length) groups.push({ target: plain(cols, 18), duration: 0.6, stagger: 0.08, overlap: 0.6 });
          wire(footer, groups, "top 60%");
        }

        ScrollTrigger.refresh();
      });
    });

    return () => {
      cancelled = true;
      cleanups.forEach((c) => c());
      ctx.revert();
      html.classList.remove("mo");
    };
  }, [scope]);
}
