export default function removeAllSpaces(inputStr: string): string {
  return inputStr.replace(/\s/g, '');
}

export function extractPollIdFromUrl(url: string): number {
  return parseInt(url.split('/').pop());
}

export function upperCaseFirstLetter(word: string) {
  const firstLetter = word[0].toUpperCase();
  return firstLetter + word.substring(1);
}
