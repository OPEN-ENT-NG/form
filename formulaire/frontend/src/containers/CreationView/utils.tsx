import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import { toast } from "react-toastify";

import { ModalType } from "~/core/enums";
import { IFolder } from "~/core/models/folder/types";
import { getHrefFormTreePath } from "~/core/pathHelper";
import { ComponentVariant } from "~/core/style/themeProps";
import { IButtonProps } from "~/core/types";
import { useFormulaireNavigation } from "~/hook/useFormulaireNavigation";
import { t } from "~/i18n";
import { useGlobal } from "~/providers/GlobalProvider";

export const useGetCreationHeaderButtons = (
  formId: string | number | undefined,
  hasFormElements: boolean,
): IButtonProps[] => {
  const { navigateToHome, navigateToFormPreview } = useFormulaireNavigation();
  const { toggleModal } = useGlobal();

  const buttons: (IButtonProps | undefined)[] = [
    {
      title: t("formulaire.return"),
      variant: ComponentVariant.OUTLINED,
      action: () => {
        navigateToHome();
      },
    },
    {
      title: t("formulaire.visualize.path"),
      variant: ComponentVariant.OUTLINED,
      action: () => {
        if (formId) window.location.href = getHrefFormTreePath(formId);
      },
    },
    hasFormElements
      ? {
          title: t("formulaire.organize"),
          variant: ComponentVariant.OUTLINED,
          action: () => {
            toggleModal(ModalType.ORGANIZATION);
          },
        }
      : undefined,
    {
      title: t("formulaire.preview"),
      variant: ComponentVariant.OUTLINED,
      action: () => {
        if (formId) navigateToFormPreview(formId);
      },
    },
    {
      title: t("formulaire.save"),
      variant: ComponentVariant.CONTAINED,
      action: () => {
        toast.success(t("formulaire.success.form.save"));
      },
      startIcon: <SaveRoundedIcon />,
    },
  ];

  return buttons.filter(Boolean) as IButtonProps[];
};

export const getRecursiveFolderParents = (
  folderId: number | null,
  folders: IFolder[],
  recursiveFolderParents: IFolder[] = [],
): IFolder[] => {
  if (!folderId) return recursiveFolderParents;

  const parentFolder = folders.find((folder) => folder.id === folderId);
  if (!parentFolder) return recursiveFolderParents;

  return getRecursiveFolderParents(parentFolder.parent_id, folders, [parentFolder, ...recursiveFolderParents]);
};
