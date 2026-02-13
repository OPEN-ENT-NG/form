import { IFolder } from "~/core/models/folder/types";
import { ComponentVariant } from "~/core/style/themeProps";
import { IButtonProps } from "~/core/types";
import { useFormulaireNavigation } from "~/hook/useFormulaireNavigation";
import { t } from "~/i18n";

export const useGetTreeHeaderButtons = (): IButtonProps[] => {
  const { navigateToHome } = useFormulaireNavigation();

  const buttons: (IButtonProps | undefined)[] = [
    {
      title: t("formulaire.return"),
      variant: ComponentVariant.OUTLINED,
      action: () => {
        navigateToHome();
      },
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
