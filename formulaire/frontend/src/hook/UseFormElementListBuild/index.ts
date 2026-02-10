import { useEffect, useState } from "react";

import { IFormElement } from "~/core/models/formElement/types";
import { compareFormElements } from "~/core/models/formElement/utils";
import { IQuestion, IQuestionChoice } from "~/core/models/question/types";
import { useGetQuestionsChildrenQuery, useGetQuestionsQuery } from "~/services/api/services/formulaireApi/questionApi";
import { useGetQuestionChoicesQuery } from "~/services/api/services/formulaireApi/questionChoiceApi";
import { useGetSectionsQuery } from "~/services/api/services/formulaireApi/sectionApi";

export const useFormElementListBuild = (formId: number) => {
  const [formElementList, setFormElementList] = useState<IFormElement[]>([]);

  const { data: questions, isFetching: isQuestionsFetching } = useGetQuestionsQuery({ formId: formId.toString() });
  const { data: sections, isFetching: isSectionsFetching } = useGetSectionsQuery({ formId: formId.toString() });
  const { data: choices, isFetching: isChoicesFetching } = useGetQuestionChoicesQuery(
    {
      questionIds: questions?.map((q) => q.id).filter((id): id is number => id !== null) || [],
    },
    { skip: !questions },
  );
  const { data: children, isFetching: isChildrenFetching } = useGetQuestionsChildrenQuery(
    questions?.map((q) => q.id).filter((id) => id !== null) || [],
    { skip: !questions },
  );

  const isFetching = isQuestionsFetching || isSectionsFetching || isChoicesFetching || isChildrenFetching;

  useEffect(() => {
    if (!isFetching && questions && sections && choices && children) {
      // Create a Map of choices by questionId for O(1) lookup
      const choicesByQuestion = choices.reduce((acc, choice) => {
        if (choice.questionId != null) {
          const existingChoices = acc.get(choice.questionId) ?? [];
          return acc.set(choice.questionId, [...existingChoices, choice]);
        }
        return acc;
      }, new Map<number, IQuestionChoice[]>());

      // Create a Map of children by questionId for O(1) lookup
      const childrenByQuestion = children.reduce((acc, child) => {
        if (child.matrixId != null) {
          const existingChildren = acc.get(child.matrixId) ?? [];
          return acc.set(child.matrixId, [...existingChildren, child]);
        }
        return acc;
      }, new Map<number, IQuestion[]>());

      const { questionsBySection, questionsWithoutSectionList } = questions.reduce(
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

      const sectionsWithQuestions = sections.map((section) => ({
        ...section,
        questions: section.id != null ? questionsBySection.get(section.id) ?? [] : [],
      }));

      const orderedFormElementList = [...sectionsWithQuestions, ...questionsWithoutSectionList].sort(
        compareFormElements,
      );
      setFormElementList(orderedFormElementList);
    }
  }, [isFetching, questions, sections, choices, children]);

  return { formElementList };
};
