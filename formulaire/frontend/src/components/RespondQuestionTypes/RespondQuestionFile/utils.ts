import { IQuestion } from "~/core/models/question/types";
import { IResponse, IResponseFile } from "~/core/models/response/type";

import { ICustomFile } from "./types";

export const toResponseFile = (file: File): IResponseFile => {
  return {
    id: crypto.randomUUID(),
    responseId: null,
    filename: file.name,
    type: file.type,
    size: file.size,
  };
};

export const toCustomFile = (responseFile: IResponseFile): ICustomFile => {
  return {
    id: responseFile.id.toString(),
    name: responseFile.filename,
    size: responseFile.size ?? 0,
    isDeletable: true,
  };
};

export const createResponse = (question: IQuestion, responseFiles: IResponseFile[]): IResponse => {
  return {
    id: null,
    questionId: question.id ?? 0,
    choiceId: undefined,
    answer: undefined,
    distributionId: undefined,
    originalId: undefined,
    customAnswer: undefined,
    files: responseFiles,
    selected: true,
    selectedIndexList: [],
    choicePosition: undefined,
  };
};
