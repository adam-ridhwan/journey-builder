/** Turn a field key like `multi_select` into a friendly label: "Multi Select". */
export function getFriendlyLabel(key: string): string {
  return key
    .replace(/[_-]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
