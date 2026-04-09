export function normalizeText(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/ {2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export async function parseTextFile(file: File): Promise<string> {
  const text = await file.text()
  return normalizeText(text)
}
