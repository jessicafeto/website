"use client";

import { MotionConfig } from "framer-motion";
import Belief from "./Belief";
import Clients from "./Clients";
import Founder from "./Founder";
import SelectedWork from "./SelectedWork";
import Invitation from "./Invitation";
import Footer from "./Footer";

/**
 * Everything below the hero — read like a printed journal:
 * what we build → the work → who we've worked with → the founder →
 * the invitation.
 */
export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <main>
        <Belief />
        <SelectedWork />
        <Clients />
        <Founder />
        <Invitation />
      </main>
      <Footer />
    </MotionConfig>
  );
}
