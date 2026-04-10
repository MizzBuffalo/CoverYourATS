/** Strip null bytes, normalize Unicode, collapse excessive whitespace */
export function sanitizeText(text: string): string {
  return text
    .replace(/\0/g, '')           // strip null bytes
    .normalize('NFKC')            // normalize Unicode
    .replace(/\r\n/g, '\n')       // normalize line endings
    .replace(/\r/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/ {3,}/g, '  ')      // collapse excessive spaces
    .replace(/\n{4,}/g, '\n\n\n') // collapse excessive newlines
    .trim()
}
