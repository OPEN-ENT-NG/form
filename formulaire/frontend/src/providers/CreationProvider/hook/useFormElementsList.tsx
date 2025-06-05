import { useMemo } from "react";
import { IQuestion, IQuestionChoice } from "~/core/models/question/types";
import { ISection } from "~/core/models/section/types";
import { useGetQuestionChoicesQuery } from "~/services/api/services/formulaireApi/questionChoiceApi";

export const useFormElementList = (sectionsDatas: ISection[] | undefined, questionsDatas: IQuestion[] | undefined) => {
  const questionsIds = useMemo(
    () => (questionsDatas ?? []).map((q) => q.id).filter((id): id is number => id !== null),
    [questionsDatas],
  );

  const { data: choicesDatas } = useGetQuestionChoicesQuery(
    { questionIds: questionsIds },
    { skip: questionsIds.length === 0 },
  );

  const completeList = useMemo(() => {
    // Create a Map of choices by questionId for O(1) lookup
    const choicesByQuestion = (choicesDatas ?? []).reduce((acc, choice) => {
      if (choice.questionId != null) {
        const existingChoices = acc.get(choice.questionId) ?? [];
        return acc.set(choice.questionId, [...existingChoices, choice]);
      }
      return acc;
    }, new Map<number, IQuestionChoice[]>());

    const { questionsBySection, questionsWithoutSectionList } = (questionsDatas ?? []).reduce(
      (acc, question) => {
        const withChoices = {
          ...question,
          choices: question.id != null ? choicesByQuestion.get(question.id) ?? [] : [],
        };

        if (question.sectionId != null) {
          const existingQuestions = acc.questionsBySection.get(question.sectionId) ?? [];
          return {
            ...acc,
            questionsBySection: acc.questionsBySection.set(question.sectionId, [...existingQuestions, withChoices]),
          };
        } else {
          return {
            ...acc,
            questionsWithoutSectionList: [...acc.questionsWithoutSectionList, withChoices],
          };
        }
      },
      {
        questionsBySection: new Map<number, (IQuestion & { choices: IQuestionChoice[] })[]>(),
        questionsWithoutSectionList: [] as (IQuestion & { choices: IQuestionChoice[] })[],
      },
    );

    const sectionsWithQuestions = (sectionsDatas ?? []).map((section) => ({
      ...section,
      questions: section.id != null ? questionsBySection.get(section.id) ?? [] : [],
    }));

    return [...sectionsWithQuestions, ...questionsWithoutSectionList].sort(
      (a, b) => (a.position ?? Infinity) - (b.position ?? Infinity),
    );
  }, [sectionsDatas, questionsDatas, choicesDatas]);

  return { completeList };
};
