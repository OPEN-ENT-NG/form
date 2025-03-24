import { useCallback, useMemo } from "react";

import { useHome } from "~/providers/HomeProvider";
import { ToasterButtonType } from "./enums";
import { useModal } from "~/providers/ModalProvider";
import { ModalType } from "~/core/enums";
import { useDuplicateFormsMutation } from "~/services/api/services/formulaireApi/formApi";

export const useMapToasterButtons = () => {
  const {
    selectedFolders,
    selectedForms,
    setCurrentFolder,
    setSelectedFolders,
    setSelectedForms,
    folders,
    currentFolder,
    forms,
  } = useHome();
  const { toggleModal } = useModal();
  const [duplicateForms, { isLoading: isDuplicating }] = useDuplicateFormsMutation();

  const hasNoFolders = useMemo(() => selectedFolders.length === 0, [selectedFolders]);
  const hasOneFolder = useMemo(() => selectedFolders.length === 1, [selectedFolders]);
  const hasMultipleFolders = useMemo(() => selectedFolders.length > 1, [selectedFolders]);
  const hasFolders = useMemo(() => selectedFolders.length > 0, [selectedFolders]);

  const hasNoForms = useMemo(() => selectedForms.length === 0, [selectedForms]);
  const hasOneForm = useMemo(() => selectedForms.length === 1, [selectedForms]);
  const hasMultipleForms = useMemo(() => selectedForms.length > 1, [selectedForms]);
  const hasForms = useMemo(() => selectedForms.length > 0, [selectedForms]);

  const hasOnlyFolders = useMemo(() => hasFolders && hasNoForms, [hasFolders, hasNoForms]);
  const hasOnlyForms = useMemo(() => hasForms && hasNoFolders, [hasForms, hasNoFolders]);
  const hasMixedSelection = useMemo(() => hasFolders && hasForms, [hasFolders, hasForms]);

  const filteredFolders = useMemo(() => {
    return folders.filter((folder) => folder.parent_id === currentFolder.id);
  }, [folders, currentFolder.id]);

  const filteredForms = useMemo(() => {
    return forms.filter((form) => form.folder_id === currentFolder.id);
  }, [forms, currentFolder.id]);

  const unselectAll = useCallback(() => {
    setSelectedFolders([]);
    return setSelectedForms([]);
  }, [setSelectedFolders, setSelectedForms]);

  const handleSelectAll = useCallback(() => {
    if (hasOnlyFolders) return setSelectedFolders(filteredFolders);
    if (hasOnlyForms) return setSelectedForms(filteredForms);
    setSelectedFolders(filteredFolders);
    return setSelectedForms(filteredForms);
  }, [filteredFolders, filteredForms, hasOnlyFolders, hasOnlyForms, setSelectedFolders, setSelectedForms]);

  const handleDuplicate = useCallback(async () => {
    if (!hasForms || isDuplicating) return;

    try {
      const formIds = selectedForms.map((form) => form.id);
      const folderId = currentFolder.id;

      await duplicateForms({
        formIds,
        folderId,
      }).unwrap();
      return unselectAll();
    } catch (error) {
      return console.error("Error duplicating forms:", error);
    }
  }, [hasForms, isDuplicating, selectedForms, currentFolder.id, duplicateForms, unselectAll]);

  const ToasterButtonsMap = useMemo(
    () => ({
      [ToasterButtonType.OPEN]: {
        titleI18nkey: "formulaire.open",
        type: ToasterButtonType.OPEN,
        action: () => (hasFolders ? (setCurrentFolder(selectedFolders[0]), unselectAll()) : console.log("open form")),
      },
      [ToasterButtonType.RENAME]: {
        titleI18nkey: "formulaire.rename",
        type: ToasterButtonType.RENAME,
        action: () => toggleModal(ModalType.FOLDER_RENAME),
      },
      [ToasterButtonType.MOVE]: {
        titleI18nkey: "formulaire.move",
        type: ToasterButtonType.MOVE,
        action: () => toggleModal(ModalType.MOVE),
      },
      [ToasterButtonType.DELETE]: {
        titleI18nkey: "formulaire.delete",
        type: ToasterButtonType.DELETE,
        action: () => toggleModal(ModalType.FORM_FOLDER_DELETE),
      },
      [ToasterButtonType.PROPS]: {
        titleI18nkey: "formulaire.properties",
        type: ToasterButtonType.PROPS,
        action: () => toggleModal(ModalType.FORM_PROP_UPDATE),
      },
      [ToasterButtonType.DUPLICATE]: {
        titleI18nkey: "formulaire.duplicate",
        type: ToasterButtonType.DUPLICATE,
        action: () => handleDuplicate(),
      },
      [ToasterButtonType.EXPORT]: {
        titleI18nkey: "formulaire.export",
        type: ToasterButtonType.EXPORT,
        action: () => toggleModal(ModalType.EXPORT),
      },
      [ToasterButtonType.UNSELECT_ALL]: {
        titleI18nkey: "formulaire.deselect",
        type: ToasterButtonType.UNSELECT_ALL,
        action: () => unselectAll(),
      },
      [ToasterButtonType.SELECT_ALL]: {
        titleI18nkey: "formulaire.selectAll",
        type: ToasterButtonType.SELECT_ALL,
        action: () => handleSelectAll(),
      },
    }),
    [hasFolders, selectedFolders, setCurrentFolder, toggleModal, unselectAll, handleDuplicate, handleSelectAll],
  );

  // Simplification des boutons de droite
  const rightButtons = useMemo(
    () => [ToasterButtonsMap[ToasterButtonType.UNSELECT_ALL], ToasterButtonsMap[ToasterButtonType.SELECT_ALL]],
    [ToasterButtonsMap],
  );

  // Fonction simplifiée pour obtenir les boutons de gauche
  const leftButtons = useMemo(() => {
    const getButtonTypes = (): ToasterButtonType[] => {
      // Cas 1: Un seul formulaire
      if (hasOneForm && !hasFolders) {
        return [
          ToasterButtonType.OPEN,
          ToasterButtonType.PROPS,
          ToasterButtonType.DUPLICATE,
          ToasterButtonType.MOVE,
          ToasterButtonType.EXPORT,
          ToasterButtonType.DELETE,
        ];
      }
      // Cas 2: Plusieurs formulaires
      if (hasMultipleForms && !hasFolders) {
        return [
          ToasterButtonType.DUPLICATE,
          ToasterButtonType.MOVE,
          ToasterButtonType.EXPORT,
          ToasterButtonType.DELETE,
        ];
      }
      // Cas 3: Un seul dossier
      if (hasOneFolder && !hasForms) {
        return [ToasterButtonType.OPEN, ToasterButtonType.RENAME, ToasterButtonType.MOVE, ToasterButtonType.DELETE];
      }
      // Cas 4: Plusieurs dossiers
      if (hasMultipleFolders && !hasForms) {
        return [ToasterButtonType.MOVE, ToasterButtonType.DELETE];
      }
      // Cas 5: Mélange dossiers + formulaires
      if (hasMixedSelection) {
        return [ToasterButtonType.MOVE, ToasterButtonType.DELETE];
      }

      return [];
    };

    const buttonTypes = getButtonTypes();

    return buttonTypes.map((type) => ToasterButtonsMap[type]);
  }, [
    ToasterButtonsMap,
    hasOneForm,
    hasMultipleForms,
    hasOneFolder,
    hasMultipleFolders,
    hasFolders,
    hasForms,
    hasMixedSelection,
  ]);

  return { leftButtons, rightButtons };
};
