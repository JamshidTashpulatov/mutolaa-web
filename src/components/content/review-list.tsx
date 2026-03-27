"use client";

import { Card, Separator, Text, textVariants } from "@heroui/react";

export type ReviewListItem = {
  quote: string;
  attribution: string;
};

export type ReviewListProps = {
  title: string;
  titleId: string;
  items: ReviewListItem[];
};

export function ReviewList({ title, titleId, items }: ReviewListProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby={titleId} className="w-full">
      <h2
        id={titleId}
        className={textVariants({ size: "sm", variant: "muted", className: "mb-6" })}
      >
        {title}
      </h2>
      <ul className="flex list-none flex-col gap-6 p-0">
        {items.map((item, index) => (
          <li key={`${item.attribution}-${index}`}>
            <Card variant="secondary">
              <Card.Content className="gap-4">
                <Text className="text-pretty text-base leading-relaxed">
                  {item.quote}
                </Text>
                <Separator />
                <Text size="sm" variant="muted">
                  {item.attribution}
                </Text>
              </Card.Content>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
