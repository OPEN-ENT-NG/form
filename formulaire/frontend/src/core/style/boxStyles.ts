export const modalBoxStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  background: "white",
  borderRadius: "1rem",
  padding: "3rem",
  display: "flex",
  flexDirection: "column",
  gap: "2rem",
};

export const spaceBetweenBoxStyle = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
} as const;

export const flexStartBoxStyle = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
} as const;

export const flexEndBoxStyle = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
} as const;

export const centerBoxStyle = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
} as const;

export const columnBoxStyle = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
} as const;

export const cardWrapperStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(min(30rem, 100%), 1fr))",
  gap: "1.6rem",
  width: "100%",
} as const;

export const emptyStateWrapper = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  minHeight: "calc(100vh - 71px)",
  gap: 3,
} as const;
