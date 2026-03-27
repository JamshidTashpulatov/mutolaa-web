"use client";

import { createContext, useContext } from "react";

/** Pixel width for each book card in a home horizontal shelf (null = use fixed sizes). */
export const HomeShelfSlotContext = createContext<number | null>(null);

export function useHomeShelfSlot(): number | null {
  return useContext(HomeShelfSlotContext);
}
