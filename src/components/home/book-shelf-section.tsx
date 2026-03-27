"use client";

import { HomeBookRow } from "./home-book-row";
import { HomeSection } from "./home-section";

export type BookShelfSectionProps = {
  title: string;
  titleId: string;
  seeAllHref?: string;
  seeAllLabel: string;
  children: React.ReactNode;
};

export function BookShelfSection({
  title,
  titleId,
  seeAllHref,
  seeAllLabel,
  children,
}: BookShelfSectionProps) {
  return (
    <HomeSection
      titleId={titleId}
      title={title}
      seeAllHref={seeAllHref}
      seeAllLabel={seeAllLabel}
    >
      <HomeBookRow>{children}</HomeBookRow>
    </HomeSection>
  );
}
