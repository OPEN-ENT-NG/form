export interface IResponseFile {
  id: number | string;
  responseId: number | null;
  filename: string;
  type: string;
  size?: number;
}

//TODO update typages as needed
export interface IResponse {
  id: number | null;
  questionId: number;
  choiceId: number | undefined;
  answer: string | Date | number | undefined;
  distributionId: number | undefined;
  originalId: number | undefined;
  customAnswer: string | undefined;
  files: IResponseFile[];
  selected: boolean;
  selectedIndexList: boolean[]; // For multiple answer in preview
  choicePosition: number | undefined; // For question type ranking to order
  image?: string | null; // For question type multiple answer
}
