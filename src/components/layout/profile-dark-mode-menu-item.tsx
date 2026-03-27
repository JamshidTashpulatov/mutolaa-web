"use client";

import { Dropdown, Switch } from "@heroui/react";
import { useEffect, useState } from "react";
import { applyTheme, documentIsDark } from "@/lib/theme-preference";
import { IconMenuMoon } from "./header-menu-icons";

type ProfileDarkModeMenuItemProps = {
  label: string;
};

export function ProfileDarkModeMenuItem({ label }: ProfileDarkModeMenuItemProps) {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(documentIsDark());
  }, []);

  return (
    <Dropdown.Item
      shouldCloseOnSelect={false}
      textValue={label}
      className="cursor-default"
    >
      <div className="flex w-full min-w-[13rem] items-center justify-between gap-3 py-0.5">
        <span className="flex min-w-0 items-center gap-2.5 text-sm text-foreground">
          <IconMenuMoon />
          <span className="truncate">{label}</span>
        </span>
        {mounted ? (
          <Switch
            size="sm"
            isSelected={isDark}
            onChange={(next) => {
              applyTheme(next ? "dark" : "light");
              setIsDark(next);
            }}
            aria-label={label}
          >
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
          </Switch>
        ) : (
          <span
            className="inline-block h-6 w-10 shrink-0 rounded-full bg-surface-secondary"
            aria-hidden
          />
        )}
      </div>
    </Dropdown.Item>
  );
}
