import { FormElementType } from "~/core/models/formElement/enum";
import { IFormElement } from "~/core/models/formElement/types";
import { IQuestionChoice } from "~/core/models/question/types";
import { ISection } from "~/core/models/section/types";

// Type for the formElement that can have a nextFormElementId
export type FormElementWithNextElement = ISection | IQuestionChoice;

// Configuration object to handle different formElement types
export interface IUseTargetNextElementConfig<T extends FormElementWithNextElement> {
  entity: T;
  // For sections, this will be the section itself
  // For question choices, this should be the parent question (IQuestion)
  positionReferenceElement: IFormElement;
  // Function to save/update the formElement
  onSave: (
    updatedEntity: T,
    targetElementId: number | undefined,
    targetElementType: FormElementType | undefined,
  ) => void;
}
