import { Dispatch, ReactNode, SetStateAction } from "react";
import { IForm } from "~/core/models/form/types";
import { IFormElement } from "~/core/models/formElement/types";
import { IQuestion } from "~/core/models/question/types";

export interface ICreationProviderProps {
  children: ReactNode;
}

export type CreationProviderContextType = {
  form: IForm | null;
  formElementsList: IFormElement[];
  setFormElementsList: Dispatch<SetStateAction<IFormElement[]>>;
  currentEditingElement: IFormElement | null;
  setCurrentEditingElement: (element: IFormElement | null) => void;
  handleUndoQuestionsChange: (question: IQuestion) => void;
  handleDuplicateFormElement: (element: IFormElement) => Promise<void>;
  handleDeleteFormElement: (element: IFormElement) => void;
  saveQuestion: (question: IQuestion) => Promise<void>;
};
