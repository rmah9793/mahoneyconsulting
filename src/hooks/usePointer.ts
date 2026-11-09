import { useEffect, useRef } from "react";

type Pointer = { x: number; y: number; tx: number; ty: number };

const target = { x: 0, y: 0 };
let listening = false;

function onMove(event: PointerEvent | MouseEvent) {
  target.x = (event.clientX / window.innerWidth) * 2 - 1;
  target.y = (event.clientY / window.innerHeight) * 2 - 1;
}

function listen() {
  if (listening) return;
  listening = true;
  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("mousemove", onMove, { passive: true });
}

export function usePointer() {
  const pointer = useRef<Pointer>({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    listen();
  }, []);

  return { pointer, target };
}
