import { createContext, FC, useContext, useEffect, useMemo, useState } from "react";
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
    if (questionsDatas) {
      console.log("questionsDatas", questionsDatas);
      return;
    }
    return;
  }, [questionsDatas]);

  useEffect(() => {
    if (sectionsDatas) {
      console.log("sectionsDatas", sectionsDatas);
      return;
    }
    return;
  }, [sectionsDatas]);

  const value = useMemo<CreationProviderContextType>(
    () => ({
      form,
      formElementsList,
      currentEditingElement,
    }),
    [form, formElementsList, currentEditingElement],
  );

  return <CreationProviderContext.Provider value={value}>{children}</CreationProviderContext.Provider>;
};
