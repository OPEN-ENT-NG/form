import { CreationQuestionChoiceType } from "./enum";

export interface ICreationQuestionChoiceProps {
  type: CreationQuestionChoiceType;
  text: string;
  onDelete: () => void;
  hasImage: boolean;
  image?: string;
}
