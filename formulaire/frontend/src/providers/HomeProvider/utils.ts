import { useMemo } from "react";
import { IFolder } from "~/core/models/folder/types";
import { HomeTabState, RootFolderIds } from "./enums";
import { ViewMode } from "~/components/SwitchView/enums";
import { IHomeTabViewPref, IUserTabRights } from "./types";
import FolderIcon from "@mui/icons-material/Folder";
import ShareIcon from "@mui/icons-material/Share";
import DeleteIcon from "@mui/icons-material/Delete";
import { hasWorkflow } from "~/core/utils";
import { IUserWorkflowRights, IWorkflowRights, WorkflowRights } from "~/core/rights";
import { IUserInfo } from "@edifice.io/client";
import i18n from "~/i18n";

export const useRootFolders = (): IFolder[] => {

  const rootFolders = useMemo<IFolder[]>(
    () => [
      {
        id: RootFolderIds.FOLDER_MY_FORMS_ID,
        parent_id: null,
        name: i18n.t("formulaire.forms.mine"),
        icon: FolderIcon,
        user_id: "",
        nb_folder_children: 0,
        nb_form_children: 0,
        children: [],
        selected: null,
      },
      {
        id: RootFolderIds.FOLDER_SHARED_FORMS_ID,
        parent_id: null,
        name: i18n.t("formulaire.forms.shared"),
        icon: ShareIcon,
        user_id: "",
        nb_folder_children: 0,
        nb_form_children: 0,
        children: [],
        selected: null,
      },
      {
        id: RootFolderIds.FOLDER_ARCHIVED_ID,
        parent_id: null,
        name: i18n.t("formulaire.forms.archived"),
        icon: DeleteIcon,
        user_id: "",
        nb_folder_children: 0,
        nb_form_children: 0,
        children: [],
        selected: null,
      },
    ],
    [],
  );

  return rootFolders;
};

export const initTabViewPref = (): IHomeTabViewPref => {
  return {
    [HomeTabState.FORMS]: ViewMode.CARDS,
    [HomeTabState.RESPONSES]: ViewMode.CARDS,
  };
};

export const initUserWorfklowRights = (
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

export const initUserTabRights = (userWorkflowRights: IUserWorkflowRights): IUserTabRights => {
  return {
    [HomeTabState.FORMS]: userWorkflowRights[WorkflowRights.CREATION],
    [HomeTabState.RESPONSES]: userWorkflowRights[WorkflowRights.RESPONSE],
  };
};
