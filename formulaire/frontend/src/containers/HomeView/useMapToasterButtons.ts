import { useCallback, useMemo } from "react";

import { useHome } from "~/providers/HomeProvider";
import { ToasterButtonType } from "./enums";
import { useModal } from "~/providers/ModalProvider";
import { ModalType } from "~/core/enums";
import { useDuplicateFormsMutation, useRestoreFormsMutation } from "~/services/api/services/formulaireApi/formApi";
import { MANAGER_RIGHT, TRASH_FOLDER_ID } from "~/core/constants";
import { useShareModal } from "~/providers/ShareModalProvider";
import { useEdificeClient } from "@edifice.io/react";
import { HomeTabState } from "~/providers/HomeProvider/enums";
import { getFormDistributions } from "~/core/models/form/utils";
import { getNbFinishedDistrib } from "~/core/models/distribution/utils";

export const useMapToasterButtons = () => {
  const {
    selectedFolders,
    selectedForms,
    selectedSentForm,
    tab,
    setCurrentFolder,
    setSelectedFolders,
    setSelectedForms,
    setSelectedSentForm,
    folders,
    currentFolder,
    forms,
    distributions,
  } = useHome();

  const { user } = useEdificeClient();

  const { userFormsRights } = useShareModal();

  const { toggleModal } = useModal();
  const [duplicateForms, { isLoading: isDuplicating }] = useDuplicateFormsMutation();
  const [restoreForms, { isLoading: isRestoring }] = useRestoreFormsMutation();

  const hasNoFolders = useMemo(() => selectedFolders.length === 0, [selectedFolders]);
  const hasOneFolder = useMemo(() => selectedFolders.length === 1, [selectedFolders]);
  const hasMultipleFolders = useMemo(() => selectedFolders.length > 1, [selectedFolders]);
  const hasFolders = useMemo(() => selectedFolders.length > 0, [selectedFolders]);
  const hasQuestionsInForms = useMemo(() => selectedForms.every((form) => form.nb_elements > 0), [selectedForms]);
  const hasShareRightManager = useMemo(() => {
    return selectedForms.every((form) => {
      const formRight = userFormsRights.find((right) => right.form.id === form.id);
      return (formRight ? formRight.rights.includes(MANAGER_RIGHT) : false) || user?.userId === form.owner_id;
    });
  }, [selectedForms, userFormsRights]);

  const hasNoForms = useMemo(() => selectedForms.length === 0, [selectedForms]);
  const hasOneForm = useMemo(() => selectedForms.length === 1, [selectedForms]);
  const hasMultipleForms = useMemo(() => selectedForms.length > 1, [selectedForms]);
  const hasForms = useMemo(() => selectedForms.length > 0, [selectedForms]);
  const hasElements = useMemo(() => !!selectedForms[0]?.nb_elements, [selectedForms]);

  const hasSentForm = useMemo(() => selectedSentForm, [selectedSentForm]);

  const hasOnlyFolders = useMemo(() => hasFolders && hasNoForms, [hasFolders, hasNoForms]);
  const hasOnlyForms = useMemo(() => hasForms && hasNoFolders, [hasForms, hasNoFolders]);
  const hasMixedSelection = useMemo(() => hasFolders && hasForms, [hasFolders, hasForms]);
  const isInTrash = useMemo(() => currentFolder.id === TRASH_FOLDER_ID, [currentFolder.id]);
  const hasFormsInTrash = useMemo(() => isInTrash && hasForms, [isInTrash, hasForms]);

  const filteredFolders = useMemo(() => {
    return folders.filter((folder) => folder.parent_id === currentFolder.id);
  }, [folders, currentFolder.id]);

  const filteredForms = useMemo(() => {
    return forms.filter((form) => form.folder_id === currentFolder.id);
  }, [forms, currentFolder.id]);

  const unselectAll = useCallback(() => {
    if (tab === HomeTabState.FORMS) {
      setSelectedFolders([]);
      setSelectedForms([]);
      return;
    }
    //Response tab
    setSelectedSentForm(null);
    return;
  }, [setSelectedFolders, setSelectedForms]);

  const handleSelectAll = useCallback(() => {
    if (tab === HomeTabState.FORMS) {
      if (hasOnlyFolders) {
        setSelectedFolders(filteredFolders);
        return;
      }
      if (hasOnlyForms) {
        setSelectedForms(filteredForms);
        return;
      }
      setSelectedFolders(filteredFolders);
      setSelectedForms(filteredForms);
      return;
    }
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
      unselectAll();
      return;
    } catch (error) {
      console.error("Error duplicating forms:", error);
      return;
    }
  }, [hasForms, isDuplicating, selectedForms, currentFolder.id, duplicateForms, unselectAll]);

  const handleRestore = useCallback(async () => {
    if (!hasForms || isRestoring || !isInTrash) return;

    try {
      const formIds = selectedForms.map((form) => form.id);
      await restoreForms(formIds).unwrap();
      unselectAll();
      return;
    } catch (error) {
      console.error("Error restoring forms:", error);
      return;
    }
  }, [hasForms, isRestoring, isInTrash, selectedForms, restoreForms, unselectAll]);

  const ToasterButtonsMap = useMemo(
    () => ({
      [ToasterButtonType.OPEN]: {
        titleI18nkey: "formulaire.open",
        type: ToasterButtonType.OPEN,
        action: () => {
          if (hasFolders) {
            setCurrentFolder(selectedFolders[0]);
            unselectAll();
            return;
          }
          if (hasForms && tab === HomeTabState.FORMS) {
            //TODO
            console.log("open form");
            return;
          }
          if (hasSentForm && tab === HomeTabState.RESPONSES) {
            //TODO
            console.log("open sent form");
            return;
          }
        },
      },
      [ToasterButtonType.RENAME]: {
        titleI18nkey: "formulaire.rename",
        type: ToasterButtonType.RENAME,
        action: () => {
          toggleModal(ModalType.FOLDER_RENAME);
        },
      },
      [ToasterButtonType.MOVE]: {
        titleI18nkey: "formulaire.move",
        type: ToasterButtonType.MOVE,
        action: () => {
          toggleModal(ModalType.MOVE);
        },
      },
      [ToasterButtonType.DELETE]: {
        titleI18nkey: "formulaire.delete",
        type: ToasterButtonType.DELETE,
        action: () => {
          toggleModal(ModalType.FORM_FOLDER_DELETE);
        },
      },
      [ToasterButtonType.PROPS]: {
        titleI18nkey: "formulaire.properties",
        type: ToasterButtonType.PROPS,
        action: () => {
          toggleModal(ModalType.FORM_PROP_UPDATE);
        },
      },
      [ToasterButtonType.DUPLICATE]: {
        titleI18nkey: "formulaire.duplicate",
        type: ToasterButtonType.DUPLICATE,
        action: () => handleDuplicate(),
      },
      [ToasterButtonType.EXPORT]: {
        titleI18nkey: "formulaire.export",
        type: ToasterButtonType.EXPORT,
        action: () => {
          toggleModal(ModalType.EXPORT);
        },
      },
      [ToasterButtonType.UNSELECT_ALL]: {
        titleI18nkey: "formulaire.deselect",
        type: ToasterButtonType.UNSELECT_ALL,
        action: () => {
          unselectAll();
        },
      },
      [ToasterButtonType.SELECT_ALL]: {
        titleI18nkey: "formulaire.selectAll",
        type: ToasterButtonType.SELECT_ALL,
        action: () => {
          handleSelectAll();
        },
      },
      [ToasterButtonType.RESTORE]: {
        titleI18nkey: "formulaire.restore",
        type: ToasterButtonType.RESTORE,
        action: () => handleRestore(),
      },
      [ToasterButtonType.SHARE]: {
        titleI18nkey: "formulaire.share",
        type: ToasterButtonType.SHARE,
        action: () => {
          toggleModal(ModalType.FORM_SHARE);
        },
      },
      [ToasterButtonType.REMIND]: {
        titleI18nkey: "formulaire.checkremind",
        type: ToasterButtonType.REMIND,
        action: () => {
          toggleModal(ModalType.REMIND);
        },
      },
      [ToasterButtonType.MY_ANSWER]: {
        titleI18nkey: "formulaire.myResponses",
        type: ToasterButtonType.MY_ANSWER,
        action: () => {
          //TODO
          console.log("my responses");
        },
      },
    }),
    [
      hasFolders,
      selectedFolders,
      setCurrentFolder,
      toggleModal,
      unselectAll,
      handleDuplicate,
      handleSelectAll,
      handleRestore,
    ],
  );

  // Simplification des boutons de droite
  const rightButtons = useMemo(() => {
    if (tab === HomeTabState.RESPONSES) {
      return [];
    }
    return [ToasterButtonsMap[ToasterButtonType.UNSELECT_ALL], ToasterButtonsMap[ToasterButtonType.SELECT_ALL]];
  }, [ToasterButtonsMap, tab]);

  // Fonction simplifiée pour obtenir les boutons de gauche
  const leftButtons = useMemo(() => {
    const getButtonTypes = (): ToasterButtonType[] => {
      // Cas spécial: Formulaires dans la corbeille
      if (hasFormsInTrash) {
        return [ToasterButtonType.RESTORE, ToasterButtonType.DELETE];
      }

      // Cas 1: Un seul formulaire
      if (hasOneForm && !hasFolders && !hasElements) {
        const buttons = [
          ToasterButtonType.OPEN,
          ToasterButtonType.PROPS,
          ToasterButtonType.DUPLICATE,
          ToasterButtonType.MOVE,
          ToasterButtonType.EXPORT,
          ToasterButtonType.DELETE,
        ];
        return hasQuestionsInForms && hasShareRightManager ? [...buttons, ToasterButtonType.SHARE] : buttons;
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
      //cas 6: Un formulaire avec des éléments
      if (hasOneForm && !hasFolders && hasElements) {
        return [
          ToasterButtonType.OPEN,
          ToasterButtonType.PROPS,
          ToasterButtonType.DUPLICATE,
          ToasterButtonType.MOVE,
          ToasterButtonType.REMIND,
          ToasterButtonType.EXPORT,
          ToasterButtonType.DELETE,
        ];
      }
      // Cas 7: Un formulaire en réponse
      if (hasSentForm && tab === HomeTabState.RESPONSES) {
        if (
          selectedSentForm?.multiple &&
          getNbFinishedDistrib(getFormDistributions(selectedSentForm, distributions)) > 0
        ) {
          return [ToasterButtonType.OPEN, ToasterButtonType.MY_ANSWER];
        }
        return [ToasterButtonType.OPEN];
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
    hasFormsInTrash,
    tab,
    selectedSentForm,
  ]);

  return { leftButtons, rightButtons };
};
