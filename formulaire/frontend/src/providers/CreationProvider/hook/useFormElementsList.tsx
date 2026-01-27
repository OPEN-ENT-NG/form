import { useEffect, useMemo, useState } from "react";
import { IFormElement } from "~/core/models/formElement/types";
import { IQuestion, IQuestionChoice } from "~/core/models/question/types";
import { ISection } from "~/core/models/section/types";
import { useGetQuestionsChildrenQuery } from "~/services/api/services/formulaireApi/questionApi";
import { useGetQuestionChoicesQuery } from "~/services/api/services/formulaireApi/questionChoiceApi";

export const useFormElementList = (
  sectionsDatas: ISection[] | undefined,
  questionsDatas: IQuestion[] | undefined,
  resetFormElementListId: number,
  isDataFetching: boolean,
) => {
  const questionsIds = useMemo(() => {
    return (questionsDatas ?? []).map((q) => q.id).filter((id): id is number => id !== null);
  }, [questionsDatas]);

  const { data: choicesDatas, isFetching: isChoicesFetching } = useGetQuestionChoicesQuery(
    { questionIds: questionsIds },
    { skip: questionsIds.length === 0 },
  );

  const { data: childrenDatas, isFetching: isChildrenFetching } = useGetQuestionsChildrenQuery(questionsIds, {
    skip: questionsIds.length === 0,
  });

  const [completeList, setCompleteList] = useState<IFormElement[]>([]);

  useEffect(() => {
    if (
      isDataFetching ||
      isChoicesFetching ||
      isChildrenFetching ||
      !sectionsDatas ||
      !questionsDatas ||
      !choicesDatas ||
      !childrenDatas
    )
      return;
    // Create a Map of choices by questionId for O(1) lookup
    const choicesByQuestion = choicesDatas.reduce((acc, choice) => {
      if (choice.questionId != null) {
        const existingChoices = acc.get(choice.questionId) ?? [];
        return acc.set(choice.questionId, [...existingChoices, choice]);
      }
      return acc;
    }, new Map<number, IQuestionChoice[]>());

    // Create a Map of children by questionId for O(1) lookup
    const childrenByQuestion = childrenDatas.reduce((acc, child) => {
      if (child.matrixId != null) {
        const existingChildren = acc.get(child.matrixId) ?? [];
        return acc.set(child.matrixId, [...existingChildren, child]);
      }
      return acc;
    }, new Map<number, IQuestion[]>());

    const { questionsBySection, questionsWithoutSectionList } = questionsDatas.reduce(
      (acc, question) => {
        const withChoicesAndChildren = {
          ...question,
          choices: question.id != null ? choicesByQuestion.get(question.id) ?? [] : [],
          children: question.id != null ? childrenByQuestion.get(question.id) ?? [] : [],
        };

        if (question.sectionId != null) {
          const existingQuestions = acc.questionsBySection.get(question.sectionId) ?? [];
          return {
            ...acc,
            questionsBySection: acc.questionsBySection.set(question.sectionId, [
              ...existingQuestions,
              withChoicesAndChildren,
            ]),
          };
        } else {
          return {
            ...acc,
            questionsWithoutSectionList: [...acc.questionsWithoutSectionList, withChoicesAndChildren],
          };
        }
      },
      {
        questionsBySection: new Map<number, (IQuestion & { choices: IQuestionChoice[] })[]>(),
        questionsWithoutSectionList: [] as (IQuestion & { choices: IQuestionChoice[] })[],
      },
    );

    const sectionsWithQuestions = sectionsDatas.map((section) => ({
      ...section,
      questions: section.id != null ? questionsBySection.get(section.id) ?? [] : [],
    }));

    setCompleteList(
      [...sectionsWithQuestions, ...questionsWithoutSectionList].sort(
        (a, b) => (a.position ?? Infinity) - (b.position ?? Infinity),
      ),
    );
  }, [
    sectionsDatas,
    questionsDatas,
    choicesDatas,
    childrenDatas,
    resetFormElementListId,
    isDataFetching,
    isChoicesFetching,
    isChildrenFetching,
  ]);

  return { completeList };
};
