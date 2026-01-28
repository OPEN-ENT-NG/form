import { STRING } from "~/core/constants";

import { QuestionTypes } from "../question/enum";
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

export const formatBeforeSaving = (response: IResponse, questionType: QuestionTypes): void => {
  if (response.answer == undefined) {
    response.answer = "";
    return;
  }
  if (questionType === QuestionTypes.TIME && typeof response.answer != STRING) {
    //TODO utiliser autre chose que moment() ?
    // response.answer = moment(response.answer).format(Constants.HH_MM);
    return;
  }
  if (questionType === QuestionTypes.DATE && typeof response.answer != STRING) {
    //TODO utiliser autre chose que moment() ?
    // response.answer = moment(response.answer).format(Constants.DD_MM_YYYY);
    return;
  }
  if (questionType === QuestionTypes.CURSOR && typeof response.answer != STRING) {
    response.answer = response.answer.toString();
    return;
  }
};
