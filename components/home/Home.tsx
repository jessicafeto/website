"use client";

import { MotionConfig } from "framer-motion";
import Belief from "./Belief";
import Clients from "./Clients";
import Founder from "./Founder";
import WhatWeBuild from "./WhatWeBuild";
import SelectedWork from "./SelectedWork";
import Invitation from "./Invitation";
import Footer from "./Footer";

/**
 * Everything below the hero — read like a printed journal:
 * belief → the problem → the founder → what we build → proof →
 * (the wax-seal opening) → the Journal → the invitation.
 */
export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <main>
        <Belief />
        <Clients />
        <Founder />
        <WhatWeBuild />
        <SelectedWork />
        <Invitation />
      </main>
      <Footer />
    </MotionConfig>
  );
}
