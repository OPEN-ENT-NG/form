import { FC, useEffect, useRef } from "react";
import { ICreationQuestionFreetextProps } from "../types";
import { Editor, EditorRef } from "@edifice.io/react/editor";
import { isCurrentEditingElement } from "~/providers/CreationProvider/utils";
import { useCreation } from "~/providers/CreationProvider";
import { StyledEditorWrapper } from "./style";
import { EditorMode } from "./enums";
import { ClickAwayListener } from "@mui/material";
import { EDITOR_CONTENT_HTML, MOUSE_EVENT_DOWN, TOUCH_EVENT_START } from "~/core/constants";

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

  // Save question when we this component is not the edited one anymore
  const handleUpdateStatement = (newStatement: string) => {
    if (!currentEditingElement || !isCurrentEditingElement(question, currentEditingElement)) {
      return;
    }

    const updatedQuestion = {
      ...question,
      statement: newStatement,
    };

    setCurrentEditingElement(updatedQuestion);
  };

  return (
    <>
      {isCurrentEditingElement(question, currentEditingElement) ? (
        <ClickAwayListener
          mouseEvent={MOUSE_EVENT_DOWN}
          touchEvent={TOUCH_EVENT_START}
          on
          onClickAway={() => {
            handleUpdateStatement(editorRef.current?.getContent(EDITOR_CONTENT_HTML) as string);
          }}
        >
          <StyledEditorWrapper isCurrentEditingElement={true}>
            <Editor content={question.statement} ref={editorRef} mode={EditorMode.EDIT} />
          </StyledEditorWrapper>
        </ClickAwayListener>
      ) : (
        <StyledEditorWrapper isCurrentEditingElement={false}>
          <Editor content={question.statement} ref={editorRef} mode={EditorMode.READ} />
        </StyledEditorWrapper>
      )}
    </>
  );
};
