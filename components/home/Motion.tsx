"use client";

import { motion, type Variants } from "framer-motion";
import { type ReactNode } from "react";

/** One easing language across the whole site — a whisper, never a performance. */
export const EASE = [0.2, 0.6, 0.2, 1] as [number, number, number, number];

/** Fade + rise on first entry. The default reveal for editorial content. */
export function FadeUp({
  children,
  className,
  delay = 0,
  y = 26,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "section" | "li";
}) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 1.2, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}

/** Stagger container + child, for lists that settle in one after another. */
export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 1.1, ease: EASE } },
};
