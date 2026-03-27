"use client";

import { Card, Separator, Text, textVariants } from "@heroui/react";

export type ReviewCardProps = {
  quote: string;
  attribution: string;
  titleId: string;
  title: string;
};

export function ReviewCard({
  quote,
  attribution,
  titleId,
  title,
}: ReviewCardProps) {
  return (
    <section aria-labelledby={titleId} className="w-full">
      <Card variant="default" className="max-w-prose">
        <Card.Header className="pb-0">
          <h2
            id={titleId}
            className={textVariants({ size: "sm", variant: "muted" })}
          >
            {title}
          </h2>
        </Card.Header>
        <Card.Content className="gap-3 pt-2">
          <Text className="text-pretty text-base leading-relaxed">{quote}</Text>
          <Separator />
          <Text size="sm" variant="muted">
            {attribution}
          </Text>
        </Card.Content>
      </Card>
    </section>
  );
}
