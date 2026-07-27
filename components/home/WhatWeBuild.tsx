"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { FadeUp } from "./Motion";

type Category = { t: string; d: string[] };

export default function WhatWeBuild() {
  const t = useTranslations("services");
  const items = t.raw("categories") as Category[];
  const [active, setActive] = useState(0);

  return (
    <section id="services" className="border-t border-rule bg-white">
      <div className="wrap py-[clamp(5rem,10vh,7rem)]">
        {/* Section Label */}
        <FadeUp>
          <div className="mb-8">
            <p className="eyebrow tracking-[0.22em] text-grey">{t("label")}</p>
          </div>
        </FadeUp>

        {/* Navigation */}
        <FadeUp delay={0.1}>
          <div className="border-y border-rule">
            <div className="flex flex-wrap justify-between gap-8 py-5">
              {items.map((item, index) => (
                <button
                  key={item.t}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => setActive(index)}
                  className="relative pb-2 text-left"
                >
                  <span
                    className={`font-serif text-[1.15rem] transition-colors duration-500 ${
                      active === index
                        ? "text-oxblood"
                        : "text-grey hover:text-ink"
                    }`}
                  >
                    {item.t}
                  </span>

                  <motion.span
                    className="absolute left-0 -bottom-[1px] h-px bg-oxblood"
                    animate={{ width: active === index ? "100%" : "0%" }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  />
                </button>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* Content */}
        <div className="pt-10 min-h-[220px]">
          <AnimatePresence mode="wait">
            <motion.ul
              key={active}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="grid max-w-5xl gap-x-20 gap-y-4 md:grid-cols-2 lg:grid-cols-3"
            >
              {items[active].d.map((service) => (
                <li
                  key={service}
                  className="font-sans text-[1rem] leading-relaxed text-grey"
                >
                  {service}
                </li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
