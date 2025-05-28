import { createContext, FC, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { CreationProviderContextType, ICreationProviderProps } from "./types";
import { IFormElement } from "~/core/models/formElement/types";
import { useParams } from "react-router-dom";
import { useGetFormQuery } from "~/services/api/services/formulaireApi/formApi";
import { useEdificeClient } from "@edifice.io/react";
import { initUserWorfklowRights } from "../HomeProvider/utils";
import { workflowRights } from "~/core/rights";
import { IForm } from "~/core/models/form/types";
import { useGetQuestionsQuery } from "~/services/api/services/formulaireApi/questionApi";
import { useGetSectionsQuery } from "~/services/api/services/formulaireApi/sectionApi";
import { getSectionList, isFormElementSection } from "~/core/models/section/utils";
import { getQuestionList } from "~/core/models/question/utils";
import { isValidFormElement } from "~/core/models/formElement/utils";
import { ISection } from "~/core/models/section/types";
import { IQuestion } from "~/core/models/question/types";

const CreationProviderContext = createContext<CreationProviderContextType | null>(null);

export const useCreation = () => {
  const context = useContext(CreationProviderContext);
  if (!context) {
    throw new Error("useCreation must be used within a CreationProvider");
  }
  return context;
};

export const CreationProvider: FC<ICreationProviderProps> = ({ children }) => {
  const { formId } = useParams();
  const { user } = useEdificeClient();
  const userWorkflowRights = initUserWorfklowRights(user, workflowRights);
  const [form, setForm] = useState<IForm | null>(null);
  const [formElementsList, setFormElementsList] = useState<IFormElement[]>([]);
  const [currentEditingElement, setCurrentEditingElement] = useState<IFormElement | null>(null);
  if (formId === undefined) {
    throw new Error("formId is undefined");
  }

  const { data: formDatas } = useGetFormQuery({ formId }, { skip: !userWorkflowRights.CREATION });
  const { data: questionsDatas } = useGetQuestionsQuery({ formId });
  const { data: sectionsDatas } = useGetSectionsQuery({ formId });

  useEffect(() => {
    if (formDatas) {
      setForm(formDatas);
      return;
    }
    return;
  }, [formDatas]);

  useEffect(() => {
    if (questionsDatas && questionsDatas.length > 0) {
      setFormElementsList((prevFormElementList) => {
        const previousSections = getSectionList(prevFormElementList);
        return [...previousSections, ...questionsDatas];
      });
    }
    if (sectionsDatas && sectionsDatas.length > 0) {
      setFormElementsList((prevFormElementList) => {
        const previousQuestions = getQuestionList(prevFormElementList);
        return [...previousQuestions, ...sectionsDatas];
      });
    }
    return;
  }, [questionsDatas, sectionsDatas]);

  // update formElementsList with the given formElement
  const updateFormElement = useCallback(
    (formElement: IFormElement) => {
      setFormElementsList((prevFormElementList) =>
        prevFormElementList.map((el) => (el.id === formElement.id ? formElement : el)),
      );
    },
    [setFormElementsList],
  );

  useEffect(() => {
    if (!currentEditingElement) {
      return;
    }

    if (isInFormElementsList(currentEditingElement)) {
      updateFormElement(currentEditingElement);
      return;
    }
  }, [currentEditingElement]);

  const onClickAwayEditingElement = useCallback(() => {
    //not new and valid
    if (!currentEditingElement?.isNew || isValidFormElement(currentEditingElement)) {
      setCurrentEditingElement(null);
      return;
    }

    //Is not valid
    if (isFormElementSection(currentEditingElement)) {
      removeFromFormElementsList(currentEditingElement);
      setCurrentEditingElement(null);
      return;
    }

    const questionElement = currentEditingElement as IQuestion;

    //Is not in a section
    if (!questionElement.sectionId) {
      removeFromFormElementsList(currentEditingElement);
      setCurrentEditingElement(null);
      return;
    }

    const section = formElementsList.find(
      (el): el is ISection => isFormElementSection(el) && el.id === questionElement.sectionId,
    );
    if (section) {
      //set FormElementsList with the section updated without the question
      const sectionWithoutInvalidQuestion: ISection = {
        ...section,
        questions: section.questions.filter((q) => q.id !== questionElement.id),
      };
      setFormElementsList((prevFormElementList) =>
        prevFormElementList.map((el) =>
          el.id === sectionWithoutInvalidQuestion.id ? sectionWithoutInvalidQuestion : el,
        ),
      );
    }
    setCurrentEditingElement(null);
    return;
  }, [currentEditingElement]);

  const isCurrentEditingElement = (element: IFormElement) => {
    return currentEditingElement ? element.id === currentEditingElement.id : false;
  };

  const isInFormElementsList = useCallback(
    (element: IFormElement) => {
      return formElementsList.some((el) => el.id === element.id);
    },
    [formElementsList],
  );

  const removeFromFormElementsList = useCallback(
    (elementDeleting: IFormElement) => {
      setFormElementsList((prevFormElementList) => prevFormElementList.filter((el) => el.id !== elementDeleting.id));
    },
    [setFormElementsList],
  );

  const value = useMemo<CreationProviderContextType>(
    () => ({
      form,
      formElementsList,
      setFormElementsList,
      currentEditingElement,
      setCurrentEditingElement,
      isCurrentEditingElement,
      onClickAwayEditingElement,
    }),
    [form, formElementsList, currentEditingElement],
  );

  return <CreationProviderContext.Provider value={value}>{children}</CreationProviderContext.Provider>;
};
