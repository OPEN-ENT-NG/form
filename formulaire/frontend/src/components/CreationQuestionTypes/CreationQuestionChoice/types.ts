import { CreationQuestionChoiceType } from "./enum";

export interface ICreationQuestionChoiceProps {
  type: CreationQuestionChoiceType;
  children: React.ReactNode;
  index: number;
  isEditing?: boolean;
  hasImage?: boolean;
  updateChoiceImage?: (index: number | null, src: string) => void;
  image?: string;
}
