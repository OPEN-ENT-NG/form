import { RadioGroup, styled, SxProps } from "@cgi-learning-hub/ui";
import { blockProps } from "~/core/utils";
import { IChoicesRadioGroupProps } from "./types";

export const ChoicesRadioGroup = styled(RadioGroup, {
  shouldForwardProp: blockProps("hasOneChoiceWithImage"),
})<IChoicesRadioGroupProps>(({ hasOneChoiceWithImage }) => ({
  flexDirection: hasOneChoiceWithImage ? "row" : "column",
  display: "flex",
  flexFlow: hasOneChoiceWithImage ? "wrap" : "column",
  justifyContent: "space-evenly",
  gap: hasOneChoiceWithImage ? "1rem" : "0",
}));

export const choiceBoxStyle: SxProps = {
  display: "flex",
  flexDirection: "column",
};

export const customAnswerStyle = {
  display: "flex",
  gap: "1rem",
  alignItems: "center",
};
