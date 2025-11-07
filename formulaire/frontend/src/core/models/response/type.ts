export interface IResponseFile {
  id: number;
  responseId: number;
  filename: string;
  type: string;
}

//TODO update typages as needed
export interface IResponse {
  id: number | undefined;
  questionId: number;
  choiceId: number | undefined;
  answer: string | Date | number | undefined;
  distributionId: number;
  originalId: number;
  customAnswer: string;
  files: IResponseFile[];
  selected: boolean;
  selectedIndexList: boolean[]; // For multiple answer in preview
  choicePosition: number; // For question type ranking to order
  image?: string | null; // For question type multiple answer
}
