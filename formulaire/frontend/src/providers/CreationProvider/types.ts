import { Dispatch, ReactNode, SetStateAction } from "react";
import { IFolder } from "~/core/models/folder/types";
import { IForm } from "~/core/models/form/types";
import { IFormElement } from "~/core/models/formElement/types";
import { IQuestion } from "~/core/models/question/types";
import { ISection } from "~/core/models/section/types";

export interface ICreationProviderProps {
  children: ReactNode;
}

export type CreationProviderContextType = {
  currentFolder: IFolder;
  setCurrentFolder: (value: IFolder) => void;
  folders: IFolder[];
  setFolders: (value: IFolder[]) => void;
  form: IForm | null;
  formElementsList: IFormElement[];
  setFormElementsList: Dispatch<SetStateAction<IFormElement[]>>;
  currentEditingElement: IFormElement | null;
  setCurrentEditingElement: (element: IFormElement | null) => void;
  handleUndoFormElementChange: (element: IFormElement) => void;
  handleDuplicateFormElement: (element: IFormElement) => Promise<void>;
  handleDeleteFormElement: (element: IFormElement) => void;
  saveQuestion: (question: IQuestion) => Promise<void>;
  saveSection: (section: ISection) => Promise<void>;
  questionModalSection: ISection | null;
  setQuestionModalSection: Dispatch<SetStateAction<ISection | null>>;
};
