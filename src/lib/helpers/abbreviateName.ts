export function abbreviateName(fullName: string) {
  const nameParts = fullName.split(' ');
  if (nameParts.length < 2) {
    return fullName; // If there's no last name, return the original name
  }

  const lastName = nameParts[nameParts.length - 1];
  const initials = nameParts
    .slice(0, -1)
    .map((name) => name[0].toUpperCase() + '.')
    .join('');

  return `${initials} ${lastName}`;
}
