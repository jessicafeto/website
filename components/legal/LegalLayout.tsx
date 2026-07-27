import { type ReactNode } from "react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/home/Footer";

/** Shared editorial shell + prose primitives for the legal pages. */
export function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="bg-white">
        <div className="wrap pb-[clamp(4rem,10vh,8rem)] pt-[calc(82px+clamp(3rem,8vh,6rem))]">
          <div className="mx-auto max-w-[46rem]">
            <p className="eyebrow text-oxblood">Legal</p>
            <h1 className="mt-6 font-serif leading-[1.08] text-ink text-[clamp(2.4rem,5vw,3.5rem)]">
              {title}
            </h1>
            <p className="eyebrow mt-5 text-grey">Last updated {updated}</p>
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
    <h2 className="mt-14 font-serif leading-tight text-ink text-[clamp(1.5rem,2.6vw,2rem)]">
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
