"use client";

import dynamic from "next/dynamic";

const Agentation = dynamic(
  () => import("agentation").then((m) => m.Agentation),
  { ssr: false },
);

function isAgentationEnabled() {
  return (
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_AGENTATION === "true"
  );
}

export function AgentationDev() {
  if (!isAgentationEnabled()) {
    return null;
  }
  return <Agentation />;
}
