/**
 * Fisher-Yates shuffle. Returns a new array with elements in random order.
 */
export function shuffleArray(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return arr;
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
