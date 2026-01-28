import DeleteIcon from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";
import ShareIcon from "@mui/icons-material/Share";
import { useMemo } from "react";

import { ViewMode } from "~/components/SwitchView/enums";
import { IFolder } from "~/core/models/folder/types";
import { IUserWorkflowRights, WorkflowRights } from "~/core/rights";
import { t } from "~/i18n";

import { HomeTabState, RootFolderIds } from "./enums";
import { IHomeTabViewPref, IUserTabRights } from "./types";

export const useRootFolders = (): IFolder[] => {
  const rootFolders = useMemo<IFolder[]>(
    () => [
      {
        id: RootFolderIds.FOLDER_MY_FORMS_ID,
        parent_id: null,
        name: t("formulaire.forms.mine"),
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
        name: t("formulaire.forms.shared"),
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
        name: t("formulaire.forms.archived"),
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

export const initUserTabRights = (userWorkflowRights: IUserWorkflowRights): IUserTabRights => {
  return {
    [HomeTabState.FORMS]: userWorkflowRights[WorkflowRights.CREATION],
    [HomeTabState.RESPONSES]: userWorkflowRights[WorkflowRights.RESPONSE],
  };
};
