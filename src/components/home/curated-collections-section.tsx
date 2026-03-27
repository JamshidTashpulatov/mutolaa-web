"use client";

import { Card, Link, Text } from "@heroui/react";
import type { CuratedCollectionId } from "@/i18n/types";
import { HomeSection } from "./home-section";

export type CuratedCollectionItem = {
  id: CuratedCollectionId;
  title: string;
  description: string;
  href: string;
};

export type CuratedCollectionsSectionProps = {
  heading: string;
  titleId: string;
  items: CuratedCollectionItem[];
  detailsLabel: string;
};

export function CuratedCollectionsSection({
  heading,
  titleId,
  items,
  detailsLabel,
}: CuratedCollectionsSectionProps) {
  return (
    <HomeSection titleId={titleId} title={heading}>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.id}>
            <Link href={item.href} className="block h-full rounded-xl outline-offset-2">
              <Card
                variant="secondary"
                className="h-full border border-border bg-background transition-colors hover:bg-surface-secondary"
              >
                <Card.Header className="pb-2">
                  <Card.Title className="text-base font-semibold leading-snug">
                    {item.title}
                  </Card.Title>
                </Card.Header>
                <Card.Content className="pt-0">
                  <Text size="sm" variant="muted" className="text-pretty leading-relaxed">
                    {item.description}
                  </Text>
                </Card.Content>
                <Card.Footer className="pt-2">
                  <Text size="sm" className="font-medium text-muted">
                    {detailsLabel}
                  </Text>
                </Card.Footer>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </HomeSection>
  );
}
