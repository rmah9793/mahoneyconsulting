import { useEffect, useRef, type ReactNode } from "react";
import { usePointer } from "../hooks/usePointer";

export function KineticText({
  children,
  className,
  strength = 36,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { pointer, target } = usePointer();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    const tick = () => {
      const p = pointer.current;
      p.tx = target.x;
      p.ty = target.y;
      p.x += (p.tx - p.x) * 0.12;
      p.y += (p.ty - p.y) * 0.12;
      el.style.transform = `translate3d(${p.x * strength}px, ${p.y * (strength * 0.62)}px, 0) rotateX(${-p.y * 12}deg) rotateY(${p.x * 16}deg)`;
      frame = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(frame);
  }, [pointer, strength, target]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
