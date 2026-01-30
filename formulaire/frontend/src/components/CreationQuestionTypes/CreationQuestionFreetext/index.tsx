import { Editor, EditorRef } from "@edifice.io/react/editor";
import { FC, useEffect, useRef } from "react";

import { EDITOR_CONTENT_HTML } from "~/core/constants";
import { EditorMode, EditorVariant } from "~/core/enums";
import { useCreation } from "~/providers/CreationProvider";
import { isCurrentEditingElement } from "~/providers/CreationProvider/utils";

import { StyledEditorWrapper } from "./style";
import { ICreationQuestionFreetextProps } from "./types";

export const CreationQuestionFreetext: FC<ICreationQuestionFreetextProps> = ({ question, questionTitleRef }) => {
  const editorRef = useRef<EditorRef>(null);
  const { currentEditingElement, setCurrentEditingElement } = useCreation();

  // As Editor component automatically take the focus, we wait to take it back
  useEffect(() => {
    if (questionTitleRef) {
      const timeout = setTimeout(() => {
        questionTitleRef.current?.focus();
      }, 100);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, []);

  const updateStatement = () => {
    if (!currentEditingElement || !isCurrentEditingElement(question, currentEditingElement)) return;

    const updatedQuestion = {
      ...question,
      statement: editorRef.current?.getContent(EDITOR_CONTENT_HTML) as string,
    };

    setCurrentEditingElement(updatedQuestion);
  };

  return (
    <StyledEditorWrapper isCurrentEditingElement={true}>
      {isCurrentEditingElement(question, currentEditingElement) ? (
        <Editor
          content={question.statement}
          ref={editorRef}
          onContentChange={updateStatement}
          mode={EditorMode.EDIT}
          variant={EditorVariant.OUTLINE}
        />
      ) : (
        <Editor content={question.statement} ref={editorRef} mode={EditorMode.READ} variant={EditorVariant.GHOST} />
      )}
    </StyledEditorWrapper>
  );
};
