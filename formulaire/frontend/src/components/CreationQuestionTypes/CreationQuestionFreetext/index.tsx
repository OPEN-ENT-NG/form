import { FC, useEffect, useRef, useState } from "react";
import { ICreationQuestionFreetextProps } from "../types";
import { Box } from "@cgi-learning-hub/ui";
import { Editor, EditorRef } from "@edifice.io/react/editor";
import { isCurrentEditingElement } from "~/providers/CreationProvider/utils";
import { useCreation } from "~/providers/CreationProvider";

export const CreationQuestionFreetext: FC<ICreationQuestionFreetextProps> = ({ question, questionTitleRef }) => {
  const editorRef = useRef<EditorRef>(null);
  const [statement, setStatement] = useState<string>("");
  const { currentEditingElement, setCurrentEditingElement } = useCreation();
  
  useEffect(() => {
    if (questionTitleRef) {
      const timeout = setTimeout(() => {
        questionTitleRef.current?.focus();
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, []);

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
    <Box>
      <Editor
        content={statement}
        ref={editorRef}
        mode={isCurrentEditingElement(question, currentEditingElement) ? "edit" : "read"}
        onContentChange={() => {
          setStatement(editorRef.current?.getContent("html") as string);
        }}
      />
    </Box>
  );
};
