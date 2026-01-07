export interface ISortableQuestionItemProps {
  id: number | null;
  isFirst?: boolean;
  isLast?: boolean;
  label: string;
  handleMoveQuestion?: (choiceId: number, up: boolean) => void;
  isPreview?: boolean;
}
