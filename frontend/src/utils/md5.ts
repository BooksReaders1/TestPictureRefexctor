// Simple hash function for image slicing (similar to MD5 behavior)
export function hashString(str: string): number {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  return Math.abs(hash);
}

export function calculateSlicesFromHash(chapterId: string, pageIndex: number): number {
  const str = `${chapterId}_${pageIndex}`;
  const hash = hashString(str);
  // Return 3-9 slices based on hash
  return (hash % 7) + 3;
}
