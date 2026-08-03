import { type ReactNode } from "react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/home/Footer";

/** Shared editorial shell + prose primitives for the legal pages. Labels are
 *  passed in already-localised, so this stays a plain (sync) component. */
export function LegalLayout({
  title,
  eyebrow,
  updatedLabel,
  children,
}: {
  title: string;
  eyebrow: string;
  updatedLabel: string;
  children: ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="bg-white">
        <div className="wrap pb-[clamp(4rem,10vh,8rem)] pt-[calc(82px+clamp(3rem,8vh,6rem))]">
          <div className="mx-auto max-w-[46rem]">
            <p className="eyebrow text-oxblood">{eyebrow}</p>
            <h1 className="mt-6 font-sans font-bold tracking-[-0.01em] leading-[1.12] text-ink text-[clamp(2rem,4.2vw,2.9rem)]">
              {title}
            </h1>
            <p className="eyebrow mt-5 text-grey">{updatedLabel}</p>
            <div className="mt-14">{children}</div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-14 font-sans font-bold tracking-[-0.01em] leading-tight text-ink text-[clamp(1.3rem,2.3vw,1.75rem)]">
      {children}
    </h2>
  );
}

export function P({ children }: { children: ReactNode }) {
  return (
    <p className="mt-5 font-sans text-[1.0625rem] leading-[1.8] text-grey">
      {children}
    </p>
  );
}

export function UL({ children }: { children: ReactNode }) {
  return (
    <ul className="mt-5 list-disc space-y-2 pl-6 font-sans text-[1.0625rem] leading-[1.8] text-grey">
      {children}
    </ul>
  );
}
