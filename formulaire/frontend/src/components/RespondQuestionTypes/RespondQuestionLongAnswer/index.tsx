import { Box } from "@cgi-learning-hub/ui";
import { Editor, EditorRef } from "@edifice.io/react/editor";
import { FC, useEffect, useRef, useState } from "react";

import { EDITOR_CONTENT_HTML } from "~/core/constants";
import { EditorMode, EditorVariant, ResponsePageType } from "~/core/enums";
import { useResponse } from "~/providers/ResponseProvider";

import { IRespondQuestionTypesProps } from "../types";
import { respondQuestionLongAnswerStyle } from "./style";

export const RespondQuestionLongAnswer: FC<IRespondQuestionTypesProps> = ({ question }) => {
  const editorRef = useRef<EditorRef>(null);
  const { getQuestionResponse, updateQuestionResponses, pageType } = useResponse();
  const [answer, setAnswer] = useState<string>("");
  const isPageTypeRecap = pageType === ResponsePageType.RECAP;

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
    <Box sx={{ ...(!isPageTypeRecap && respondQuestionLongAnswerStyle) }}>
      <Editor
        onContentChange={handleResponseChange}
        content={answer} //TODO
        ref={editorRef}
        mode={isPageTypeRecap ? EditorMode.READ : EditorMode.EDIT}
        variant={isPageTypeRecap ? EditorVariant.GHOST : EditorVariant.OUTLINE}
        focus={false}
      />
    </Box>
  );
};
