const urlRegex =
  /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/gi;
export function extractHyperlinks(text: string) {
  const matches = text.match(urlRegex);
  return (matches as string[]) ?? [];
}

export function createHyperlinkMention() {
  
}