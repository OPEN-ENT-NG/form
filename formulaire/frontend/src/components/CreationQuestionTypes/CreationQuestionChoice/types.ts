import { QuestionTypes } from "~/core/models/question/enum";

export interface ICreationQuestionChoiceProps {
  children: React.ReactNode;
  index: number;
  type?: QuestionTypes;
  isEditing?: boolean;
  hasImage?: boolean;
  updateChoiceImage?: (index: number | null, src: string) => void;
  image?: string;
}
