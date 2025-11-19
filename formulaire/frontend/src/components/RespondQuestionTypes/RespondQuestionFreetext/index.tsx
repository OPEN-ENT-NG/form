import { FC } from "react";
import { Box } from "@cgi-learning-hub/ui";
import { IRespondQuestionTypesProps } from "../types";
import { Editor } from "@edifice.io/react/editor";
import { EditorMode, EditorVariant } from "~/core/enums";
import { editorWrapperStyle } from "./style";

export const RespondQuestionFreetext: FC<IRespondQuestionTypesProps> = ({ question }) => {
  return (
    <Box sx={editorWrapperStyle}>
      <Editor content={question.statement} mode={EditorMode.READ} variant={EditorVariant.GHOST} />
    </Box>
  );
};
