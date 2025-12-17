import { ComponentVariant } from "~/core/style/themeProps";
import { IButtonProps } from "~/core/types";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import { t } from "~/i18n";
import { getFormPreviewPath, getFormTreePath } from "~/core/pathHelper";
import { useNavigate } from "react-router-dom";
import { IFolder } from "~/core/models/folder/types";
import { ModalType } from "~/core/enums";
import { useGlobal } from "~/providers/GlobalProvider";
import { toast } from "react-toastify";

export const useGetCreationHeaderButtons = (
  formId: string | number | undefined,
  hasFormElements: boolean,
): IButtonProps[] => {
  const navigate = useNavigate();
  const { toggleModal } = useGlobal();

  const buttons: (IButtonProps | undefined)[] = [
    {
      title: t("formulaire.return"),
      variant: ComponentVariant.OUTLINED,
      action: () => {
        navigate(`/`);
      },
    },
    {
      title: t("formulaire.visualize.path"),
      variant: ComponentVariant.OUTLINED,
      action: () => {
        if (formId) window.location.href = getFormTreePath(formId);
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
        if (formId) window.location.href = getFormPreviewPath(formId);
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
