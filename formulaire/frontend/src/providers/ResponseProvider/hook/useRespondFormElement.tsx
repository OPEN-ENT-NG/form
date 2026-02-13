import { useDispatch } from "react-redux";

import { TagName } from "~/core/enums";
import { IFormElement } from "~/core/models/formElement/types";
import { getStringifiedFormElementIdType, isSection } from "~/core/models/formElement/utils";
import { QuestionTypes } from "~/core/models/question/enum";
import { IQuestion } from "~/core/models/question/types";
import { IResponse } from "~/core/models/response/type";
import { buildResponsesPayload, createNewResponse } from "~/core/models/response/utils";
import { emptySplitFormulaireApi } from "~/services/api/services/formulaireApi/emptySplitFormulaireApi";
import {
  useCreateMultipleMutation,
  useDeleteMultipleByQuestionAndDistributionMutation,
  useUpdateMultipleMutation,
} from "~/services/api/services/formulaireApi/responseApi";

import { ResponseMap } from "../types";

export const useRespondFormElement = (responsesMap: ResponseMap) => {
  const dispatch = useDispatch();
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
            distributionId,
            localResponsesMap,
            responsesToUpdate,
            responsesToCreate,
            questionIdsResponseToDelete,
          );
        });
      } else {
        fillListsByQuestionType(
          q,
          distributionId,
          localResponsesMap,
          responsesToUpdate,
          responsesToCreate,
          questionIdsResponseToDelete,
        );
      }
    });

    // Delete some responses
    if (questionIdsResponseToDelete.length)
      await deleteMultipleByQuestionAndDistribution({ distributionId, questionIds: questionIdsResponseToDelete });

    // Update existing responses
    if (responsesToUpdate.length)
      await updateResponses({ distributionId, responses: buildResponsesPayload(responsesToUpdate, distributionId) });

    // Create new responses
    if (responsesToCreate.length)
      await createResponses({ distributionId, responses: buildResponsesPayload(responsesToCreate, distributionId) });

    //TODO manage files later

    dispatch(emptySplitFormulaireApi.util.invalidateTags([TagName.RESPONSE]));
  };

  const fillListsByQuestionType = (
    question: IQuestion,
    distributionId: number,
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
      case QuestionTypes.SINGLEANSWERRADIO:
      case QuestionTypes.MULTIPLEANSWER: {
        questionIdsResponseToDelete.push(question.id); // we want to delete existing response(s)..
        const selectedResponses = questionResponses.filter((r) => r.selected);
        responsesToCreate.push(
          ...(selectedResponses.length > 0
            ? selectedResponses
            : [createNewResponse(question.id, undefined, distributionId)]),
        ); // ..and create new response(s) with the selected one(s)
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
