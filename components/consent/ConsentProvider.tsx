"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  readConsent,
  writeConsent,
  DENIED,
  GRANTED,
  type ConsentCategories,
  type ConsentRecord,
} from "@/lib/consent";

type ConsentContextValue = {
  /** True once we've checked storage on the client — guards against SSR flashes. */
  ready: boolean;
  /** The stored choice, or null if the visitor hasn't decided yet. */
  consent: ConsentRecord | null;
  bannerVisible: boolean;
  prefsOpen: boolean;
  openPreferences: () => void;
  closePreferences: () => void;
  acceptAll: () => void;
  rejectNonEssential: () => void;
  /** Persist a granular choice from the preferences modal. */
  save: (categories: ConsentCategories) => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

/** Consume consent state anywhere inside the provider (banner, modal, footer, scripts). */
export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    throw new Error("useConsent must be used within <ConsentProvider>.");
  }
  return ctx;
}

export default function ConsentProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [consent, setConsent] = useState<ConsentRecord | null>(null);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);

  // Read the stored choice once, on the client only.
  useEffect(() => {
    const existing = readConsent();
    setConsent(existing);
    setBannerVisible(!existing);
    setReady(true);
  }, []);

  const apply = useCallback((categories: ConsentCategories) => {
    setConsent(writeConsent(categories));
    setBannerVisible(false);
    setPrefsOpen(false);
  }, []);

  const value: ConsentContextValue = {
    ready,
    consent,
    bannerVisible,
    prefsOpen,
    openPreferences: () => setPrefsOpen(true),
    closePreferences: () => setPrefsOpen(false),
    acceptAll: () => apply(GRANTED),
    rejectNonEssential: () => apply(DENIED),
    save: apply,
  };

  return (
    <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
  );
}
