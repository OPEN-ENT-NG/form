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

export const customAnswerStyle: SxProps = {
  display: "flex",
  gap: "1rem",
  alignItems: "flex-start",
  flexDirection: "column",
  marginTop: ".5rem",
};

export const labelStyle: SxProps = {
  display: "flex",
  alignItems: "center",
  gap: ".5rem",
  height: "3.2rem",
};

export const formControlLabelStyle: SxProps = {
  display: "flex",
  alignItems: "flex-start",
};
