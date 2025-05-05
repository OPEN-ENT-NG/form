export const getClippedRect = (
  treeItemRect: DOMRect | undefined,
  treeRootRect: DOMRect | undefined,
): DOMRect | null => {
  if (!treeItemRect || !treeRootRect) return null;
  const top = Math.max(treeItemRect.top, treeRootRect.top);
  const left = Math.max(treeItemRect.left, treeRootRect.left);
  const right = Math.min(treeItemRect.right, treeRootRect.right);
  const bottom = Math.min(treeItemRect.bottom, treeRootRect.bottom);
  const width = right - left;
  const height = bottom - top;
  return new DOMRect(left, top, width, height);
};
