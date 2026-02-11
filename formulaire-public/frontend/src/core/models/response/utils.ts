import { IResponse } from "./type";

export const createNewResponse = (
  questionId: number,
  distributionId?: number,
  choiceId?: number,
  answer?: string | Date | number,
  choicePosition?: number,
): IResponse => {
  return {
    id: null,
    questionId: questionId,
    choiceId: choiceId ? choiceId : undefined,
    answer: answer ? answer : "",
    distributionId: distributionId ? distributionId : undefined,
    originalId: undefined,
    customAnswer: undefined,
    files: [],
    selected: false,
    selectedIndexList: [], // For multiple answer in preview
    choicePosition: choicePosition !== undefined ? choicePosition : undefined, // For question type ranking to order
    image: null, // For question type multiple answer
  };
};
