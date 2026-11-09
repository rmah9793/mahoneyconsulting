import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Pause, Play, RotateCcw, Volume2, VolumeX, X } from "lucide-react";

const fmt = (s: number) => {
  if (!Number.isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};

/** Full-screen film player. Only rendered when `site.filmUrl` is set. */
export function FilmOverlay({ src, open, onClose }: { src: string; open: boolean; onClose: () => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);

  useEffect(() => {
    const el = wrap.current;
    const v = video.current;
    if (!el || !v) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (open) {
      el.removeAttribute("inert");
      gsap.set(el, { visibility: "visible" });
      gsap.fromTo(el, { opacity: 0, y: reduce ? 0 : innerHeight * 0.08 }, { opacity: 1, y: 0, duration: reduce ? 0 : 0.5, ease: "power3.out" });
      v.currentTime = 0;
      v.play().catch(() => setPlaying(false));
      document.body.style.overflow = "hidden";
    } else {
      el.setAttribute("inert", "");
      v.pause();
      gsap.to(el, { opacity: 0, y: reduce ? 0 : innerHeight * 0.04, duration: reduce ? 0 : 0.35, ease: "power2.in", onComplete: () => { gsap.set(el, { visibility: "hidden" }); } });
      document.body.style.overflow = "";
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const v = video.current;
    if (!v) return;
    let raf = 0;
    const loop = () => {
      setTime(v.currentTime);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === " " || e.key === "k") { e.preventDefault(); v.paused ? v.play() : v.pause(); }
      else if (e.key === "ArrowRight") v.currentTime = Math.min(v.duration || 0, v.currentTime + 5);
      else if (e.key === "ArrowLeft") v.currentTime = Math.max(0, v.currentTime - 5);
      else if (e.key.toLowerCase() === "m") v.muted = !v.muted;
      else if (e.key.toLowerCase() === "r") { v.currentTime = 0; v.play(); }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const btn = "grid h-10 w-10 place-items-center rounded-full hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white";
  return (
    <div ref={wrap} id="filmOverlay" role="dialog" aria-modal="true" aria-label="Mahoney Consulting film" inert data-lenis-prevent className="invisible fixed inset-0 z-[70] bg-navy-deep opacity-0">
      <video
        ref={video}
        src={src}
        playsInline
        muted={muted}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
        onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
        onEnded={onClose}
        onClick={() => (video.current?.paused ? video.current.play() : video.current?.pause())}
        className="h-full w-full object-contain"
      />
      <div className="pill-glass absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full px-2 py-1.5 text-white">
        <button type="button" className={btn} aria-label="Restart" onClick={() => { if (video.current) { video.current.currentTime = 0; video.current.play(); } }}><RotateCcw className="h-4 w-4" /></button>
        <button type="button" className={btn} aria-label={playing ? "Pause" : "Play"} onClick={() => (video.current?.paused ? video.current.play() : video.current?.pause())}>
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
        <button type="button" className={btn} aria-label={muted ? "Unmute" : "Mute"} onClick={() => video.current && (video.current.muted = !video.current.muted)}>
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
        <span className="min-w-[5.5rem] px-2 text-center text-xs tabular-nums">{fmt(time)} / {fmt(dur)}</span>
        <button type="button" className={btn} aria-label="Close film" onClick={onClose}><X className="h-4 w-4" /></button>
      </div>
    </div>
  );
}
