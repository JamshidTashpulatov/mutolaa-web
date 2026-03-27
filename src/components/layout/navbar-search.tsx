"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { SearchField, cn } from "@heroui/react";

export function NavbarSearch({
  locale,
  placeholder,
  className,
}: {
  locale: string;
  placeholder: string;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");

  const submit = useCallback(() => {
    const q = query.trim();
    const onCatalog = pathname.includes("/catalog");
    const params = onCatalog
      ? new URLSearchParams(searchParams.toString())
      : new URLSearchParams();
    if (q) {
      params.set("q", q);
    } else {
      params.delete("q");
    }
    const qs = params.toString();
    router.push(`/${locale}/catalog${qs ? `?${qs}` : ""}`);
  }, [locale, pathname, query, router, searchParams]);

  return (
    <form
      className={cn(
        "w-full max-w-[11rem] sm:max-w-[14rem] md:max-w-[16rem] lg:max-w-xs",
        className,
      )}
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <SearchField value={query} onChange={setQuery} aria-label={placeholder}>
        <SearchField.Group>
          <SearchField.SearchIcon />
          <SearchField.Input placeholder={placeholder} name="q" />
          <SearchField.ClearButton />
        </SearchField.Group>
      </SearchField>
    </form>
  );
}
