/**
 * Map a DOM Range to string offsets inside a root element (text + nested marks).
 */
export function rangeOffsetsWithinRoot(
  root: HTMLElement,
  range: Range,
): { start: number; end: number } | null {
  if (!root.contains(range.commonAncestorContainer)) {
    return null;
  }

  function offsetOf(node: Node, off: number): number | null {
    let total = 0;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let cur: Node | null = walker.nextNode();
    while (cur) {
      const len = cur.textContent?.length ?? 0;
      if (cur === node) {
        return total + clamp(off, 0, len);
      }
      total += len;
      cur = walker.nextNode();
    }
    return null;
  }

  const start = offsetOf(range.startContainer, range.startOffset);
  const end = offsetOf(range.endContainer, range.endOffset);
  if (start === null || end === null) {
    return null;
  }
  if (start > end) {
    return { start: end, end: start };
  }
  return { start, end };
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

export function closestReaderTextRoot(node: Node | null): HTMLElement | null {
  let el: Node | null = node;
  while (el) {
    if (
      el instanceof HTMLElement &&
      el.hasAttribute("data-mutolaa-reader-text")
    ) {
      return el;
    }
    el = el.parentNode;
  }
  return null;
}
