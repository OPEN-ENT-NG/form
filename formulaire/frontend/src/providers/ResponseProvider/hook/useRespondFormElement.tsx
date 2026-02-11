import { IFormElement } from "~/core/models/formElement/types";
import { getStringifiedFormElementIdType, isSection } from "~/core/models/formElement/utils";
import { QuestionTypes } from "~/core/models/question/enum";
import { IQuestion } from "~/core/models/question/types";
import { IResponse } from "~/core/models/response/type";
import {
  useCreateMultipleMutation,
  useDeleteMultipleByQuestionAndDistributionMutation,
  useUpdateMultipleMutation,
} from "~/services/api/services/formulaireApi/responseApi";

import { ResponseMap } from "../types";

export const useRespondFormElement = (responsesMap: ResponseMap) => {
  const [createResponses] = useCreateMultipleMutation();
  const [updateResponses] = useUpdateMultipleMutation();
  const [deleteMultipleByQuestionAndDistribution] = useDeleteMultipleByQuestionAndDistributionMutation();

  const save = async (currentElement: IFormElement, distributionId: number) => {
    const formElementIdType = getStringifiedFormElementIdType(currentElement) ?? "";
    const localResponsesMap = responsesMap.get(formElementIdType);
    if (!localResponsesMap) return;

    const responsesToUpdate = [] as IResponse[];
    const responsesToCreate = [] as IResponse[];
    const questionIdsResponseToDelete = [] as number[];

    const questions = isSection(currentElement) ? currentElement.questions : [currentElement as IQuestion];
    questions.forEach((q) => {
      if (q.questionType === QuestionTypes.MATRIX) {
        q.children?.forEach((child) => {
          fillListsByQuestionType(
            child,
            localResponsesMap,
            responsesToUpdate,
            responsesToCreate,
            questionIdsResponseToDelete,
          );
        });
      } else {
        fillListsByQuestionType(
          q,
          localResponsesMap,
          responsesToUpdate,
          responsesToCreate,
          questionIdsResponseToDelete,
        );
      }
    });

    // Delete some responses
    await deleteMultipleByQuestionAndDistribution({ distributionId, questionIds: questionIdsResponseToDelete });

    await updateResponses({ distributionId, responses: responsesToUpdate }); // Update existing responses
    await createResponses({ distributionId, responses: responsesToCreate }); // Create new responses

    //TODO manage files later
  };

  const fillListsByQuestionType = (
    question: IQuestion,
    localResponsesMap: Map<number, IResponse[]>,
    responsesToUpdate: IResponse[],
    responsesToCreate: IResponse[],
    questionIdsResponseToDelete: number[],
  ): void => {
    if (!question.id) return;
    const questionResponses = localResponsesMap.get(question.id) ?? [];

    switch (question.questionType) {
      case QuestionTypes.SHORTANSWER:
      case QuestionTypes.LONGANSWER:
      case QuestionTypes.DATE:
      case QuestionTypes.TIME:
      case QuestionTypes.CURSOR:
        questionResponses.forEach((r) => {
          updateOrCreateResponse(r, responsesToUpdate, responsesToCreate); // update or create
        });
        break;
      case QuestionTypes.SINGLEANSWER:
      case QuestionTypes.SINGLEANSWERRADIO: {
        const selectedResponse = questionResponses.find((r) => r.selected); // find the one selected
        updateOrCreateResponse(selectedResponse, responsesToUpdate, responsesToCreate); // update or create
        break;
      }
      case QuestionTypes.MULTIPLEANSWER: {
        questionIdsResponseToDelete.push(question.id); // we want to delete existing responses..
        const selectedResponses = questionResponses.filter((r) => r.selected);
        responsesToCreate.push(...selectedResponses); // ..and create new responses with the selected ones
        break;
      }
      case QuestionTypes.RANKING: {
        questionIdsResponseToDelete.push(question.id); // we want to delete existing responses..
        responsesToCreate.push(...questionResponses); // ..and create new responses
        break;
      }
      case QuestionTypes.FILE:
        break;
      default:
        break;
    }
  };

  const updateOrCreateResponse = (
    response: IResponse | null | undefined,
    responsesToUpdate: IResponse[],
    responsesToCreate: IResponse[],
  ): void => {
    if (!response) return;
    if (response.id) responsesToUpdate.push(response);
    else responsesToCreate.push(response);
  };

  return { save };
};
