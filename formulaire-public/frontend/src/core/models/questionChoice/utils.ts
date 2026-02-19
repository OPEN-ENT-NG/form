import { IQuestionChoice, IQuestionChoiceDTO } from "../question/types";

export const isQuestionChoice = (item: object): item is IQuestionChoice => {
  return "value" in item;
};

export const transformQuestionChoice = (raw: IQuestionChoiceDTO): IQuestionChoice => {
  return {
    id: raw.id,
    questionId: raw.question_id,
    value: raw.value,
    position: raw.position,
    type: raw.type,
    nextFormElement: raw.next_form_element,
    nextFormElementId: raw.next_form_element_id,
    nextFormElementType: raw.next_form_element_type,
    isNextFormElementDefault: raw.is_next_form_element_default,
    isCustom: raw.is_custom,
    nbResponses: raw.nbResponses,
    image: raw.image,
    isNew: false,
    stableId: raw.id,
  };
};
