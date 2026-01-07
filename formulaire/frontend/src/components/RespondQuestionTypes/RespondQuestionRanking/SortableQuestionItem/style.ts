import { Box, Paper, styled } from "@cgi-learning-hub/ui";
import { blockProps } from "~/core/utils";
import { IGrapableBoxProps } from "../types";

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

export const GrapableBox = styled(Box, {
  shouldForwardProp: blockProps("isPreview"),
})<IGrapableBoxProps>(({ isPreview }) => {
  return {
    "&:hover": { cursor: isPreview ? "grabbing" : "grab" },
  };
});

export const leftBoxStyle = {
  display: "flex",
  alignItems: "center",
  gap: "1rem",
};

export const buttonsBoxStyle = {
  display: "flex",
};

export const buttonStyle = { fontSize: "3rem" };
