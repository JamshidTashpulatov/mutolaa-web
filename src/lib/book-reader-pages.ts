/** Split plain text into short “pages” for the flip reader (EPUB yo‘q paytda API tavsifi). */
export function splitIntoReaderPages(text: string, maxLen = 400): string[] {
  const t = text.replace(/\s+/g, " ").trim();
  if (!t) {
    return [];
  }

  const sentences = t.split(/(?<=[.!?…])\s+/);
  const pages: string[] = [];
  let buf = "";

  const flush = () => {
    const s = buf.trim();
    if (s) {
      pages.push(s);
    }
    buf = "";
  };

  for (const sent of sentences) {
    const next = buf ? `${buf} ${sent}` : sent;
    if (next.length <= maxLen) {
      buf = next;
    } else {
      flush();
      if (sent.length <= maxLen) {
        buf = sent;
      } else {
        for (let i = 0; i < sent.length; i += maxLen) {
          pages.push(sent.slice(i, i + maxLen).trim());
        }
      }
    }
  }
  flush();

  return pages.length ? pages : [t];
}

/** StPageFlip ko‘pincha juft sahifalar bilan yaxshi ishlaydi. */
export function padReaderPagesForFlip(pages: string[], minPages = 4): string[] {
  const out = [...pages];
  while (out.length < minPages) {
    out.push("\u00A0");
  }
  if (out.length % 2 === 1) {
    out.push("\u00A0");
  }
  return out;
}
