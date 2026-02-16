import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import { toast } from "react-toastify";

import { ModalType } from "~/core/enums";
import { IFolder } from "~/core/models/folder/types";
import { IForm } from "~/core/models/form/types";
import { hasFormResponses } from "~/core/models/form/utils";
import { getHrefFormTreePath } from "~/core/pathHelper";
import { ComponentVariant } from "~/core/style/themeProps";
import { IButtonProps } from "~/core/types";
import { useFormulaireNavigation } from "~/hook/useFormulaireNavigation";
import { t } from "~/i18n";
import { useGlobal } from "~/providers/GlobalProvider";

export const useGetCreationHeaderButtons = (form: IForm | null, hasFormElements: boolean): IButtonProps[] => {
  const { navigateToHome, navigateToFormPreview, navigateToTreeView } = useFormulaireNavigation();
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
        if (form?.id) navigateToTreeView(form.id);
      },
    },
    hasFormElements
      ? {
          title: t("formulaire.organize"),
          variant: ComponentVariant.OUTLINED,
          action: () => {
            toggleModal(ModalType.ORGANIZATION);
          },
          disabled: !!form && hasFormResponses(form),
        }
      : undefined,
    {
      title: t("formulaire.preview"),
      variant: ComponentVariant.OUTLINED,
      action: () => {
        if (form?.id) navigateToFormPreview(form.id);
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
