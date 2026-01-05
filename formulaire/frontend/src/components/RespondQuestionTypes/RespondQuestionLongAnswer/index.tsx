import { Box } from "@cgi-learning-hub/ui";
import { Editor, EditorRef } from "@edifice.io/react/editor";
import { FC, useRef } from "react";
import { EditorMode, EditorVariant } from "~/core/enums";
import { IRespondQuestionTypesProps } from "../types";
import { respondQuestionLongAnswerStyle } from "./style";

export const RespondQuestionLongAnswer: FC<IRespondQuestionTypesProps> = ({ question }) => {
  const editorRef = useRef<EditorRef>(null);
  return (
    <Box sx={respondQuestionLongAnswerStyle}>
      <Editor ref={editorRef} content={question.statement} mode={EditorMode.EDIT} variant={EditorVariant.OUTLINE} />
    </Box>
  );
};
