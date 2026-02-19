import { Paper, styled } from "@cgi-learning-hub/ui";

export const SortableQuestionPaper = styled(Paper)(({ theme }) => ({
  display: "flex",
  borderRadius: theme.shape.borderRadius,
  justifyContent: "space-between",
  marginBottom: "1.6rem",
  alignItems: "center",
  padding: "0.5rem 1rem",
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
}));

export const grapableBoxStyle = (isPreview?: boolean) => ({
  "&:hover": { cursor: isPreview ? "grabbing" : "grab" },
});

export const leftBoxStyle = {
  display: "flex",
  alignItems: "center",
  gap: "1rem",
};

export const buttonsBoxStyle = {
  display: "flex",
  cursor: "default",
};

export const buttonStyle = { fontSize: "3rem" };
