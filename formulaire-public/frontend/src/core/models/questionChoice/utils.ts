import { IQuestionChoice } from "../question/types";

export const isQuestionChoice = (item: object): item is IQuestionChoice => {
  return "value" in item;
};
