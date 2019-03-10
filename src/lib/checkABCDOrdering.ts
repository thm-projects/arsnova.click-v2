export function checkABCDOrdering(name: string): boolean {
  let ordered = true;
  name = name.trim().toLowerCase();
  if (!name || name.length < 2 || name.charAt(0) !== 'a') {
    return false;
  }
  for (let i = 1; i < name.length; i++) {
    if (name.charCodeAt(i) !== name.charCodeAt(i - 1) + 1) {
      ordered = false;
      break;
    }
  }
  return ordered;
}
