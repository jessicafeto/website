import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import Home from "@/components/home/Home";

export default function Page() {
  return (
    <>
      <span id="top" />
      <SiteHeader />
      <Hero />

      {/* Sentinel: as this passes above the viewport, the header is revealed. */}
      <div id="hero-sentinel" aria-hidden />

      <Home />
    </>
  );
}
