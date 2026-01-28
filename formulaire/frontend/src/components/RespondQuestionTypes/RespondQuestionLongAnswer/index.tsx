import { Box } from "@cgi-learning-hub/ui";
import { Editor, EditorRef } from "@edifice.io/react/editor";
import { FC, useEffect, useRef, useState } from "react";

import { EDITOR_CONTENT_HTML } from "~/core/constants";
import { EditorMode, EditorVariant } from "~/core/enums";
import { useResponse } from "~/providers/ResponseProvider";

import { IRespondQuestionTypesProps } from "../types";
import { respondQuestionLongAnswerStyle } from "./style";

export const RespondQuestionLongAnswer: FC<IRespondQuestionTypesProps> = ({ question }) => {
  const editorRef = useRef<EditorRef>(null);
  const { getQuestionResponse, updateQuestionResponses } = useResponse();
  const [answer, setAnswer] = useState<string>("");

  useEffect(() => {
    const associatedResponse = getQuestionResponse(question);
    if (!associatedResponse) return;
    const existingAnswer = associatedResponse.answer;
    if (typeof existingAnswer === "string") setAnswer(existingAnswer);
  }, []);

  const handleResponseChange = () => {
    const associatedResponse = getQuestionResponse(question);
    if (!question.id || !associatedResponse) return;
    const value = editorRef.current?.getContent(EDITOR_CONTENT_HTML) as string;
    setAnswer(value);
    associatedResponse.answer = value;
    updateQuestionResponses(question, [associatedResponse]);
  };

  return (
    <Box sx={respondQuestionLongAnswerStyle}>
      <Editor
        onContentChange={handleResponseChange}
        content={answer}
        ref={editorRef}
        mode={EditorMode.EDIT}
        variant={EditorVariant.OUTLINE}
        focus={false}
      />
    </Box>
  );
};
