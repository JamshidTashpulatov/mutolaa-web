"use client";

import { cn } from "@heroui/react";

const sizes = {
  default: "max-w-5xl",
  narrow: "max-w-3xl",
  reading: "max-w-prose",
} as const;

export type AppContainerSize = keyof typeof sizes;

export function AppContainer({
  children,
  size = "default",
  className,
}: {
  children: React.ReactNode;
  size?: AppContainerSize;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6",
        sizes[size],
        className,
      )}
    >
      {children}
    </div>
  );
}
