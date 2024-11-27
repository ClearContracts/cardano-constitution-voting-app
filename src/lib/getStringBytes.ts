/**
 * Gets the byte size of a string
 * @param str - The string to get the byte size of
 * @returns Number of bytes
 */
export function getStringBytes(str: string): number {
  const byteSize = new Blob([str]).size;
  return byteSize;
}
