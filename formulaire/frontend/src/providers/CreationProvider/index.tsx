import { createContext, FC, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { CreationProviderContextType, ICreationProviderProps } from "./types";
import { IFormElement } from "~/core/models/formElement/types";
import { useParams } from "react-router-dom";
import { useGetFormQuery } from "~/services/api/services/formulaireApi/formApi";
import { useEdificeClient } from "@edifice.io/react";
import { useRootFolders } from "../HomeProvider/utils";
import { workflowRights } from "~/core/rights";
import { IForm } from "~/core/models/form/types";
import { useGetQuestionsQuery } from "~/services/api/services/formulaireApi/questionApi";
import { useGetSectionsQuery } from "~/services/api/services/formulaireApi/sectionApi";
import { isInFormElementsList, removeFormElementFromList, updateElementInList } from "./utils";
import { IQuestion } from "~/core/models/question/types";
import { useFormElementList } from "./hook/useFormElementsList";
import { useFormElementActions } from "./hook/useFormElementActions";
import { ISection } from "~/core/models/section/types";
import { useGetFoldersQuery } from "~/services/api/services/formulaireApi/folderApi";
import { IFolder } from "~/core/models/folder/types";
import { isQuestion, isSection } from "~/core/models/formElement/utils";
import { useGlobal } from "../GlobalProvider";

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
  const { initUserWorfklowRights } = useGlobal();
  const userWorkflowRights = initUserWorfklowRights(user, workflowRights);
  const rootFolders = useRootFolders();
  const [currentFolder, setCurrentFolder] = useState<IFolder>(rootFolders[0]);
  const [folders, setFolders] = useState<IFolder[]>([]);
  const [form, setForm] = useState<IForm | null>(null);
  const [formElementsList, setFormElementsList] = useState<IFormElement[]>([]);
  const [currentEditingElement, setCurrentEditingElement] = useState<IFormElement | null>(null);
  const [questionModalSection, setQuestionModalSection] = useState<ISection | null>(null);
  const [resetFormElementListId, setResetFormElementListId] = useState(0);
  if (formId === undefined) {
    throw new Error("formId is undefined");
  }

  //DATA
  const { data: foldersDatas } = useGetFoldersQuery(undefined, { skip: !userWorkflowRights.CREATION });
  const { data: formDatas } = useGetFormQuery({ formId }, { skip: !userWorkflowRights.CREATION });
  const { data: questionsDatas } = useGetQuestionsQuery({ formId });
  const { data: sectionsDatas } = useGetSectionsQuery({ formId });

  //CUSTOM HOOKS
  const { completeList } = useFormElementList(sectionsDatas, questionsDatas, resetFormElementListId);
  const { duplicateQuestion, duplicateSection, saveQuestion, saveSection, updateFormElementsList } =
    useFormElementActions(formElementsList, formId, currentEditingElement, setFormElementsList);

  useEffect(() => {
    if (foldersDatas) {
      setFolders([...rootFolders, ...foldersDatas]);
      return;
    }
    return;
  }, [foldersDatas, rootFolders]);

  useEffect(() => {
    if (formDatas) {
      setForm(formDatas);
      return;
    }
    return;
  }, [formDatas]);

  useEffect(() => {
    if (!sectionsDatas && !questionsDatas) return;
    setFormElementsList(completeList);
  }, [questionsDatas, sectionsDatas, completeList]);

  useEffect(() => {
    if (currentEditingElement && isInFormElementsList(currentEditingElement, formElementsList)) {
      setFormElementsList((prevFormElementList) => updateElementInList(prevFormElementList, currentEditingElement));
    }
    return;
  }, [currentEditingElement]);

  //USER ACTIONS
  const handleUndoQuestionsChange = useCallback(
    (question: IQuestion) => {
      if (!questionsDatas?.length) return;
      const oldQuestion = questionsDatas.find((q) => q.id === question.id);
      if (!oldQuestion) return;
      setFormElementsList((prevFormElementList) => updateElementInList(prevFormElementList, oldQuestion));
    },
    [questionsDatas],
  );

  const handleUndoSectionChange = useCallback(
    (section: ISection) => {
      if (!sectionsDatas?.length) return;
      const oldSection = sectionsDatas.find((s) => s.id === section.id);
      if (!oldSection) return;
      setFormElementsList((prevFormElementList) =>
        updateElementInList(prevFormElementList, {
          ...section,
          title: oldSection.title,
          description: oldSection.description,
        } as ISection),
      );
    },
    [sectionsDatas],
  );

  const handleUndoFormElementChange = useCallback(
    (formElement: IFormElement) => {
      if (isQuestion(formElement)) {
        handleUndoQuestionsChange(formElement);
        return;
      }
      if (isSection(formElement)) {
        handleUndoSectionChange(formElement);
        return;
      }
    },
    [handleUndoQuestionsChange, handleUndoSectionChange],
  );

  const handleDeleteFormElement = useCallback(
    (toRemove: IFormElement, useKey: boolean = false) => {
      if (!useKey) {
        setFormElementsList((prevFormElementList) => removeFormElementFromList(prevFormElementList, toRemove));
        return;
      }
      setFormElementsList((prevFormElementList) => removeFormElementFromList(prevFormElementList, toRemove, true));
    },
    [setFormElementsList],
  );

  const handleDuplicateFormElement = useCallback(
    async (toDuplicate: IFormElement) => {
      if (!isInFormElementsList(toDuplicate, formElementsList)) return;
      if (isQuestion(toDuplicate)) {
        await duplicateQuestion(toDuplicate);
        return;
      }
      if (isSection(toDuplicate)) {
        await duplicateSection(toDuplicate);
        return;
      }
    },
    [setFormElementsList, formElementsList],
  );

  const value = useMemo<CreationProviderContextType>(
    () => ({
      currentFolder,
      setCurrentFolder,
      folders,
      setFolders,
      form,
      formElementsList,
      setFormElementsList,
      currentEditingElement,
      setCurrentEditingElement,
      handleUndoFormElementChange,
      handleDuplicateFormElement,
      handleDeleteFormElement,
      saveQuestion,
      saveSection,
      questionModalSection,
      setQuestionModalSection,
      updateFormElementsList,
      setResetFormElementListId,
    }),
    [currentFolder, folders, form, formElementsList, currentEditingElement, questionModalSection],
  );

  return <CreationProviderContext.Provider value={value}>{children}</CreationProviderContext.Provider>;
};
