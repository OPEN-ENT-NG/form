import { RefObject } from "react";
import { ICreationQuestionTypesProps } from "../types";

export interface IEditorWrapperProps {
  isCurrentEditingElement: boolean;
}

export interface ICreationQuestionFreetextProps extends ICreationQuestionTypesProps {
  questionTitleRef: RefObject<HTMLInputElement> | null;
}
