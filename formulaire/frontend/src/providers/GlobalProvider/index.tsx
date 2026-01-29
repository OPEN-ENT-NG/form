import { useMediaQuery } from "@cgi-learning-hub/ui";
import { IUserInfo } from "@edifice.io/client";
import { createContext, FC, useContext, useMemo, useState } from "react";
import { MOBILE_MAX_WIDTH } from "~/core/constants";
import { ModalType } from "~/core/enums";
import { IForm } from "~/core/models/form/types";
import {
  ISharedRights,
  IUserSharedRights,
  IUserWorkflowRights,
  IWorkflowRights,
  SharedRights,
  WorkflowRights,
} from "~/core/rights";
import { hasSharedRight, hasWorkflow } from "~/core/utils";
import { GlobalProviderContextType, IDisplayModalsState, IGlobalProviderProps } from "./types";
import { initialDisplayModalsState } from "./utils";

const GlobalProviderContext = createContext<GlobalProviderContextType | null>(null);

export const useGlobal = () => {
  const context = useContext(GlobalProviderContext);
  if (!context) {
    throw new Error("useGlobal must be used within a ModalProvider");
  }
  return context;
};

export const GlobalProvider: FC<IGlobalProviderProps> = ({ children }) => {
  const [displayModals, setDisplayModals] = useState<IDisplayModalsState>(initialDisplayModalsState);
  const isMobile = useMediaQuery(`(max-width: ${MOBILE_MAX_WIDTH}px)`);

  const toggleModal = (modalType: ModalType) => {
    setDisplayModals((prevState) => ({
      ...prevState,
      [modalType]: !prevState[modalType],
    }));
  };

  const selectAllTextInput = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const initUserWorfklowRights = (
    user: IUserInfo | undefined,
    workflowRights: IWorkflowRights,
  ): IUserWorkflowRights => {
    return {
      [WorkflowRights.ACCESS]: hasWorkflow(user, workflowRights.access),
      [WorkflowRights.CREATION]: hasWorkflow(user, workflowRights.creation),
      [WorkflowRights.RESPONSE]: hasWorkflow(user, workflowRights.response),
      [WorkflowRights.RGPD]: hasWorkflow(user, workflowRights.rgpd),
      [WorkflowRights.CREATION_PUBLIC]: hasWorkflow(user, workflowRights.creationPublic),
    };
  };

  const initUserSharedRights = (
    user: IUserInfo | undefined,
    sharedRights: ISharedRights,
    form: IForm,
  ): IUserSharedRights => {
    return {
      [SharedRights.READ]: hasSharedRight(user, sharedRights.read, form),
      [SharedRights.CONTRIB]: hasSharedRight(user, sharedRights.contrib, form),
      [SharedRights.MANAGE]: hasSharedRight(user, sharedRights.manager, form),
      [SharedRights.RESPOND]: hasSharedRight(user, sharedRights.responder, form),
    };
  };

  const value = useMemo<GlobalProviderContextType>(
    () => ({
      displayModals,
      toggleModal,
      isMobile,
      selectAllTextInput,
      initUserWorfklowRights,
      initUserSharedRights,
    }),
    [displayModals, isMobile, initUserWorfklowRights, initUserSharedRights],
  );

  return <GlobalProviderContext.Provider value={value}>{children}</GlobalProviderContext.Provider>;
};
