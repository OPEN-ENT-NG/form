import { FC, useEffect, useRef, useState } from "react";
import { ICreationQuestionFreetextProps } from "../types";
import { Editor, EditorRef } from "@edifice.io/react/editor";
import { isCurrentEditingElement } from "~/providers/CreationProvider/utils";
import { useCreation } from "~/providers/CreationProvider";
import { StyledEditorWrapper } from "./style";
import { EditorFocusPosition, EditorMode } from "./enums";

export const CreationQuestionFreetext: FC<ICreationQuestionFreetextProps> = ({ question, questionTitleRef }) => {
  const editorRef = useRef<EditorRef>(null);
  const [statement, setStatement] = useState<string>(question.statement ?? "");
  const { currentEditingElement, setCurrentEditingElement } = useCreation();
  
  // As Editor component automatically take the focus, we wait to take it back
  useEffect(() => {
    if (questionTitleRef) {
      const timeout = setTimeout(() => {
        questionTitleRef.current?.focus();
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, []);

  // Save question when we this component is not the edited one anymore
  useEffect(() => {
    if (!currentEditingElement || !isCurrentEditingElement(question, currentEditingElement)) {
      return;
    }
    const updatedQuestion = {
      ...question,
      statement: statement,
    };

    setCurrentEditingElement(updatedQuestion);
  }, [statement, setCurrentEditingElement]);

  return (
    <StyledEditorWrapper isCurrentEditingElement={isCurrentEditingElement(question, currentEditingElement)} onClick={() => {editorRef.current?.setFocus(EditorFocusPosition.END)}}>
      <Editor
        content={statement}
        ref={editorRef}
        mode={isCurrentEditingElement(question, currentEditingElement) ? EditorMode.EDIT : EditorMode.READ}
        onContentChange={() => {
          setStatement(editorRef.current?.getContent("html") as string);
        }}
      />f
    </StyledEditorWrapper>
  );
};
