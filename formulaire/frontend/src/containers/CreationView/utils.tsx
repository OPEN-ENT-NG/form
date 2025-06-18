import { ComponentVariant } from "~/core/style/themeProps";
import { IButtonProps } from "~/core/types";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import { t } from "~/i18n";
import { getFormTreePath } from "~/core/pathHelper";
import { useNavigate } from "react-router-dom";
import { IFolder } from "~/core/models/folder/types";
import { FORMULAIRE } from "~/core/constants";

export const useGetCreationHeaderButtons = (formId: string | number | undefined): IButtonProps[] => {
  const navigate = useNavigate();
  return [
    {
      title: t("formulaire.return"),
      variant: ComponentVariant.OUTLINED,
      action: () => { navigate(`/${FORMULAIRE}`)},
    },
    {
      title: t("formulaire.visualize.path"),
      variant: ComponentVariant.OUTLINED,
      action: () => { formId ? window.location.href = getFormTreePath(formId) : null},
    },
    {
      title: t("formulaire.organize"),
      variant: ComponentVariant.OUTLINED,
      action: () => {},
    },
    {
      title: t("formulaire.preview"),
      variant: ComponentVariant.OUTLINED,
      action: () => {},
    },
    {
      title: t("formulaire.save"),
      variant: ComponentVariant.CONTAINED,
      action: () => {},
      startIcon: <SaveRoundedIcon />,
    },
  ];
};

export const getRecursiveFolderParents = (folderId: number|null, folders: IFolder[], recursiveFolderParents: IFolder[] = []): IFolder[] => {
  if (!folderId) return recursiveFolderParents;

  const parentFolder = folders.find(folder => folder.id === folderId);
  if (!parentFolder) return recursiveFolderParents;

  return getRecursiveFolderParents(parentFolder.parent_id, folders, [parentFolder, ...recursiveFolderParents]);
};
