"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * The one reveal primitive. Fades content up on first entry, once, using the
 * single brand easing. A whisper, not a performance — and it stays whole when
 * reduced motion is preferred (the CSS neutralises the transform there).
 */
export default function Reveal({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section";
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-in", "true");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref as never} className={`reveal ${className ?? ""}`}>
      {children}
    </Tag>
  );
}
