export const getTransformStyle = (
  transform: { x: number; y: number; scaleX: number; scaleY: number } | null,
  transition: string | undefined,
) => {
  const base = transition ?? "";

  // append your margin-left animation
  const merged = [base, "margin-left 200ms ease"]
    .filter(Boolean) // filter out any falsy values
    .join(", ");

  return {
    transform:
      transform && typeof transform.x === "number" && typeof transform.y === "number"
        ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
        : undefined,
    transition: merged,
  };
};
