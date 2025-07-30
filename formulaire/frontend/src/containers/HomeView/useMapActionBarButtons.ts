import { useCallback, useMemo } from "react";

import { useHome } from "~/providers/HomeProvider";
import { ActionBarButtonType } from "./enums";
import { useModal } from "~/providers/ModalProvider";
import { ModalType } from "~/core/enums";
import { useDuplicateFormsMutation, useRestoreFormsMutation } from "~/services/api/services/formulaireApi/formApi";
import { MANAGER_RIGHT, TRASH_FOLDER_ID } from "~/core/constants";
import { useShareModal } from "~/providers/ShareModalProvider";
import { useEdificeClient } from "@edifice.io/react";
import { HomeTabState } from "~/providers/HomeProvider/enums";
import { getFormDistributions } from "~/core/models/form/utils";
import { getNbFinishedDistrib } from "~/core/models/distribution/utils";
import { getFormEditPath, getFormResultsPath } from "~/core/pathHelper";
import { useGetDistributionQuery } from "~/services/api/services/formulaireApi/distributionApi";
import { useHandleOpenFormResponse } from "./useHandleOpenFormResponse";
import { IForm } from "~/core/models/form/types";

export const useMapActionBarButtons = () => {
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
    rootFolders,
    currentFolder,
    forms,
    distributions,
  } = useHome();

  const { user } = useEdificeClient();

  const { userFormsRights } = useShareModal();

  const { toggleModal } = useModal();
  const [duplicateForms, { isLoading: isDuplicating }] = useDuplicateFormsMutation();
  const [restoreForms, { isLoading: isRestoring }] = useRestoreFormsMutation();
  const { data: userDistributions } = useGetDistributionQuery();
  const handleOpenFormResponse = useHandleOpenFormResponse();
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

  const hasSentForm = useMemo(() => !!selectedSentForm, [selectedSentForm]);

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
      const targetFolderId = currentFolder.id === rootFolders[1].id ? rootFolders[0].id : currentFolder.id;

      await duplicateForms({
        formIds,
        targetFolderId,
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

  const openFormResponseAction: (form?: IForm | null) => Promise<void> = async (form = null) => {
    const choosenForm = selectedSentForm ?? form;
    if (!choosenForm || !userDistributions?.length) return;

    const redirectPath = await handleOpenFormResponse(choosenForm, userDistributions);
    if (redirectPath) {
      window.location.href = redirectPath;
    }
  };

  const ActionBarButtonsMap = useMemo(
    () => ({
      [ActionBarButtonType.OPEN]: {
        titleI18nkey: "formulaire.open",
        type: ActionBarButtonType.OPEN,
        action: () => {
          if (hasFolders) {
            setCurrentFolder(selectedFolders[0]);
            unselectAll();
            return;
          }
          if (hasForms && tab === HomeTabState.FORMS) {
            return (window.location.href = getFormEditPath(selectedForms[0].id));
          }
          return openFormResponseAction();
        },
      },
      [ActionBarButtonType.RENAME]: {
        titleI18nkey: "formulaire.rename",
        type: ActionBarButtonType.RENAME,
        action: () => {
          toggleModal(ModalType.FOLDER_RENAME);
        },
      },
      [ActionBarButtonType.MOVE]: {
        titleI18nkey: "formulaire.move",
        type: ActionBarButtonType.MOVE,
        action: () => {
          toggleModal(ModalType.MOVE);
        },
      },
      [ActionBarButtonType.DELETE]: {
        titleI18nkey: "formulaire.delete",
        type: ActionBarButtonType.DELETE,
        action: () => {
          toggleModal(ModalType.FORM_FOLDER_DELETE);
        },
      },
      [ActionBarButtonType.PROPS]: {
        titleI18nkey: "formulaire.properties",
        type: ActionBarButtonType.PROPS,
        action: () => {
          toggleModal(ModalType.FORM_PROP_UPDATE);
        },
      },
      [ActionBarButtonType.DUPLICATE]: {
        titleI18nkey: "formulaire.duplicate",
        type: ActionBarButtonType.DUPLICATE,
        action: () => handleDuplicate(),
      },
      [ActionBarButtonType.EXPORT]: {
        titleI18nkey: "formulaire.export",
        type: ActionBarButtonType.EXPORT,
        action: () => {
          toggleModal(ModalType.EXPORT);
        },
      },
      [ActionBarButtonType.UNSELECT_ALL]: {
        titleI18nkey: "formulaire.deselect",
        type: ActionBarButtonType.UNSELECT_ALL,
        action: () => {
          unselectAll();
        },
      },
      [ActionBarButtonType.SELECT_ALL]: {
        titleI18nkey: "formulaire.selectAll",
        type: ActionBarButtonType.SELECT_ALL,
        action: () => {
          handleSelectAll();
        },
      },
      [ActionBarButtonType.RESTORE]: {
        titleI18nkey: "formulaire.restore",
        type: ActionBarButtonType.RESTORE,
        action: () => handleRestore(),
      },
      [ActionBarButtonType.SHARE]: {
        titleI18nkey: "formulaire.share",
        type: ActionBarButtonType.SHARE,
        action: () => {
          toggleModal(ModalType.FORM_SHARE);
        },
      },
      [ActionBarButtonType.RESULTS]: {
        titleI18nkey: "formulaire.results",
        type: ActionBarButtonType.RESULTS,
        action: () => {
          return (window.location.href = getFormResultsPath(selectedForms[0].id));
        },
      },
      [ActionBarButtonType.REMIND]: {
        titleI18nkey: "formulaire.checkremind",
        type: ActionBarButtonType.REMIND,
        action: () => {
          toggleModal(ModalType.REMIND);
        },
      },
      [ActionBarButtonType.MY_ANSWER]: {
        titleI18nkey: "formulaire.myResponses",
        type: ActionBarButtonType.MY_ANSWER,
        action: () => {
          toggleModal(ModalType.ANSWERS);
        },
      },
    }),
    [
      tab,
      hasFolders,
      hasSentForm,
      selectedFolders,
      userDistributions,
      selectedSentForm,
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
    return [ActionBarButtonsMap[ActionBarButtonType.UNSELECT_ALL], ActionBarButtonsMap[ActionBarButtonType.SELECT_ALL]];
  }, [ActionBarButtonsMap, tab]);

  // Fonction simplifiée pour obtenir les boutons de gauche
  const leftButtons = useMemo(() => {
    const getButtonTypes = (): ActionBarButtonType[] => {
      // Cas spécial: Formulaires dans la corbeille
      if (hasFormsInTrash) {
        return [ActionBarButtonType.RESTORE, ActionBarButtonType.DELETE];
      }

      // Cas 1: Un seul formulaire SANS éléments
      if (hasOneForm && !hasFolders && !hasElements) {
        const buttons = [ActionBarButtonType.OPEN, ActionBarButtonType.PROPS, ActionBarButtonType.DUPLICATE];
        if (currentFolder.id === rootFolders[0].id) {
          buttons.push(ActionBarButtonType.MOVE);
        }
        if (hasShareRightManager) {
          buttons.push(ActionBarButtonType.EXPORT, ActionBarButtonType.DELETE);
        }
        return buttons;
      }
      // Cas 2: Plusieurs formulaires
      if (hasMultipleForms && !hasFolders) {
        const buttons = [ActionBarButtonType.DUPLICATE];
        if (currentFolder.id === rootFolders[0].id) {
          buttons.push(ActionBarButtonType.MOVE);
        }
        if (hasShareRightManager) {
          buttons.push(ActionBarButtonType.EXPORT, ActionBarButtonType.DELETE);
        }
        return buttons;
      }
      // Cas 3: Un seul dossier
      if (hasOneFolder && !hasForms) {
        return [
          ActionBarButtonType.OPEN,
          ActionBarButtonType.RENAME,
          ActionBarButtonType.MOVE,
          ActionBarButtonType.DELETE,
        ];
      }
      // Cas 4: Plusieurs dossiers
      if (hasMultipleFolders && !hasForms) {
        return [ActionBarButtonType.MOVE, ActionBarButtonType.DELETE];
      }
      // Cas 5: Mélange dossiers + formulaires
      if (hasMixedSelection) {
        const buttons = [ActionBarButtonType.MOVE];
        if (hasShareRightManager) {
          buttons.push(ActionBarButtonType.DELETE);
        }
        return buttons;
      }
      //cas 6: Un seul formulaire AVEC des éléments
      if (hasOneForm && !hasFolders && hasElements) {
        const buttons = [
          ActionBarButtonType.OPEN,
          ActionBarButtonType.PROPS,
          ActionBarButtonType.DUPLICATE,
          ActionBarButtonType.RESULTS,
          ActionBarButtonType.REMIND,
        ];
        if (currentFolder.id === rootFolders[0].id) {
          buttons.splice(3, 0, ActionBarButtonType.MOVE);
        }
        if (hasShareRightManager) {
          if (hasQuestionsInForms) {
            const buttonShareIndex = buttons.findIndex((button) => button === ActionBarButtonType.RESULTS);
            buttons.splice(buttonShareIndex, 0, ActionBarButtonType.SHARE);
          }
          buttons.push(ActionBarButtonType.EXPORT, ActionBarButtonType.DELETE);
        }
        return buttons;
      }
      // Cas 7: Un formulaire en réponse
      if (hasSentForm && tab === HomeTabState.RESPONSES) {
        if (
          selectedSentForm?.multiple &&
          getNbFinishedDistrib(getFormDistributions(selectedSentForm, distributions)) > 0
        ) {
          return [ActionBarButtonType.OPEN, ActionBarButtonType.MY_ANSWER];
        }
        return [ActionBarButtonType.OPEN];
      }
      return [];
    };

    const buttonTypes = getButtonTypes();

    return buttonTypes.map((type) => ActionBarButtonsMap[type]);
  }, [
    ActionBarButtonsMap,
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

  return { leftButtons, rightButtons, openFormResponseAction };
};
