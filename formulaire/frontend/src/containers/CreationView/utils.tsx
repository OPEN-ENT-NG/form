import { ComponentVariant } from "~/core/style/themeProps";
import { IButtonProps } from "~/core/types";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import { t } from "~/i18n";
import { getFormTreePath } from "~/core/pathHelper";
import { useNavigate } from "react-router-dom";
import { IFolder } from "~/core/models/folder/types";
import { FORMULAIRE } from "~/core/constants";
import { ModalType } from "~/core/enums";
import { useModal } from "~/providers/ModalProvider";
import { IFormElement } from "~/core/models/formElement/types";

export const useGetCreationHeaderButtons = (
  formId: string | number | undefined,
  formElementsList: IFormElement[],
): IButtonProps[] => {
  const navigate = useNavigate();
  const { toggleModal } = useModal();

  const buttons: (IButtonProps | undefined)[] = [
    {
      title: t("formulaire.return"),
      variant: ComponentVariant.OUTLINED,
      action: () => {
        navigate(`/${FORMULAIRE}`);
      },
    },
    {
      title: t("formulaire.visualize.path"),
      variant: ComponentVariant.OUTLINED,
      action: () => {
        if (formId) window.location.href = getFormTreePath(formId);
      },
    },
    formElementsList.length > 0
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
      action: () => {},
    },
    {
      title: t("formulaire.save"),
      variant: ComponentVariant.CONTAINED,
      action: () => {},
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
