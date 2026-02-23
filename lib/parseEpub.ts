// Client-side EPUB parsing
export async function parseEpub(arrayBuffer: ArrayBuffer): Promise<string> {
  // Dynamic import to avoid SSR issues
  const ePub = (await import('epubjs')).default;

  const book = ePub(arrayBuffer);
  await book.ready;

  const spine = book.spine as any;
  const textParts: string[] = [];

  // Iterate through spine items (chapters)
  for (const item of spine.items) {
    try {
      const doc = await book.load(item.href);
      if (doc && typeof doc === 'object' && 'body' in doc) {
        const body = (doc as Document).body;
        if (body) {
          // Extract text content, preserving paragraph structure
          const text = extractTextFromElement(body);
          if (text.trim()) {
            textParts.push(text.trim());
          }
        }
      }
    } catch (e) {
      // Skip items that can't be loaded
      console.warn('Failed to load EPUB item:', item.href);
    }
  }

  book.destroy();
  return textParts.join('\n\n');
}

function extractTextFromElement(element: Element): string {
  const blocks: string[] = [];

  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text) {
        blocks.push(text);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      const tagName = el.tagName.toLowerCase();

      // Skip script, style, and hidden elements
      if (['script', 'style', 'noscript'].includes(tagName)) {
        return;
      }

      // Add line breaks for block elements
      const isBlock = ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'br'].includes(tagName);

      for (const child of Array.from(node.childNodes)) {
        walk(child);
      }

      if (isBlock && blocks.length > 0) {
        blocks.push('\n');
      }
    }
  };

  walk(element);

  return blocks.join(' ')
    .replace(/\n\s+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
