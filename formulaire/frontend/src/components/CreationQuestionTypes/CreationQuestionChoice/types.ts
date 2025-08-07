import { QuestionTypes } from "~/core/models/question/enum";

export interface ICreationQuestionChoiceProps {
  type: QuestionTypes;
  children: React.ReactNode;
  index: number;
  isEditing?: boolean;
  hasImage?: boolean;
  updateChoiceImage?: (index: number | null, src: string) => void;
  image?: string;
}
