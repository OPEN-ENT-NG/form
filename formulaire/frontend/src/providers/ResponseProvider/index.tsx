import { FC, createContext, useContext, useEffect, useMemo, useState } from "react";
import { ResponseProviderContextType, IResponseProviderProps } from "./types";
import { useParams } from "react-router-dom";
import { IForm } from "~/core/models/form/types";
import { useGetFormQuery } from "~/services/api/services/formulaireApi/formApi";
import { useEdificeClient } from "@edifice.io/react";
import { workflowRights } from "~/core/rights";
import { IFormElement } from "~/core/models/formElement/types";
import { useGetQuestionsQuery } from "~/services/api/services/formulaireApi/questionApi";
import { useGetSectionsQuery } from "~/services/api/services/formulaireApi/sectionApi";
import { useFormElementList } from "../CreationProvider/hook/useFormElementsList";
import { useGlobal } from "../GlobalProvider";

const ResponseProviderContext = createContext<ResponseProviderContextType | null>(null);

export const useResponse = () => {
  const context = useContext(ResponseProviderContext);
  if (!context) {
    throw new Error("useResponse must be used within a ResponseProvider");
  }
  return context;
};

export const ResponseProvider: FC<IResponseProviderProps> = ({ children, previewMode }) => {
  const { formId } = useParams();
  const { user } = useEdificeClient();
  const { initUserWorfklowRights } = useGlobal();
  const userWorkflowRights = initUserWorfklowRights(user, workflowRights);
  const [form, setForm] = useState<IForm | null>(null);
  const [formElementsList, setFormElementsList] = useState<IFormElement[]>([]);
  const [isInPreviewMode, setIsInPreviewMode] = useState<boolean>(previewMode);
  if (formId === undefined) {
    throw new Error("formId is undefined");
  }

  //DATA
  const { data: formDatas } = useGetFormQuery(
    { formId },
    { skip: previewMode ? !userWorkflowRights.CREATION : !userWorkflowRights.RESPONSE },
  );
  const { data: questionsDatas } = useGetQuestionsQuery({ formId });
  const { data: sectionsDatas } = useGetSectionsQuery({ formId });

  //CUSTOM HOOKS
  const { completeList } = useFormElementList(sectionsDatas, questionsDatas);

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

  const value = useMemo<ResponseProviderContextType>(
    () => ({
      form,
      formElementsList,
      isInPreviewMode,
      setIsInPreviewMode,
    }),
    [form, formElementsList, isInPreviewMode],
  );

  return <ResponseProviderContext.Provider value={value}>{children}</ResponseProviderContext.Provider>;
};
