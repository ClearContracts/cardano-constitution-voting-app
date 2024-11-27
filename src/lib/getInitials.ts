/**
 * Returns the initials of a voter
 * @param name - The name of the voter
 * @returns The initials of the voter
 */
export function getInitials(name: string): {
  firstInitial: string;
  lastInitial: string;
} {
  const parts = name.split(' ');
  const firstInitial = parts[0]?.[0] || ''; // Safe access to the first element
  let lastInitial = '';
  if (parts.length > 1) {
    lastInitial = parts[parts.length - 1]?.[0] || ''; // Safe access to the second element
  }
  return { firstInitial: firstInitial, lastInitial: lastInitial };
}
