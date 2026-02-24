import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  EmptyState,
  Typography,
  ZoomControl,
} from "@cgi-learning-hub/ui";
import { FC, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { CreationSortableItem } from "~/components/CreationSortableItem";
import { Header } from "~/components/Header";
import { ResponsiveDialog } from "~/components/ResponsiveDialog";
import { EmptyForm } from "~/components/SVG/EmptyForm";
import { FormTreeView } from "~/components/TreeGraph";
import { IFormTreeViewHandle } from "~/components/TreeGraph/types";
import { useElementHeight } from "~/containers/home/HomeView/utils";
import { FORMULAIRE, MAX_TREE_ZOOM, MIN_TREE_ZOOM, STEPS_TREE_ZOOM } from "~/core/constants";
import { ClickAwayDataType, ModalType } from "~/core/enums";
import { TEXT_PRIMARY_COLOR } from "~/core/style/colors";
import { BreakpointVariant, ComponentVariant, TypographyFontStyle, TypographyVariant } from "~/core/style/themeProps";
import { isEnterPressed } from "~/core/utils";
import { useFormulaireNavigation } from "~/hook/useFormulaireNavigation";
import { useTheme } from "~/hook/useTheme";
import { useCreation } from "~/providers/CreationProvider";
import { updateElementInList } from "~/providers/CreationProvider/utils";
import { useGlobal } from "~/providers/GlobalProvider";

import { creationHedearStyle, creationViewStyle, emptyStateWrapper } from "../CreationView/style";
import { treeStyle, treeTypographyStyle } from "./style";
import { useSaveFormElement } from "./useSaveFormElement";
import { getRecursiveFolderParents, useGetTreeHeaderButtons } from "./utils";

export const TreeView: FC = () => {
  const { t } = useTranslation(FORMULAIRE);
  const { form, folders, formElementsList, currentEditingElement, setCurrentEditingElement, setScrollToQuestionId } =
    useCreation();
  const [headerRef] = useElementHeight<HTMLDivElement>();
  const { isTablet } = useGlobal();
  const { isTheme1D } = useTheme();
  const headerButtons = useGetTreeHeaderButtons();
  const { navigateToHome, navigateToFormEdit } = useFormulaireNavigation();
  const {
    displayModals: { showTreeFormUpdate },
    toggleModal,
  } = useGlobal();
  const saveFormElement = useSaveFormElement();

  const treeRef = useRef<IFormTreeViewHandle>(null);
  const originalEditingElementRef = useRef<typeof currentEditingElement>(null);
  const [frozenFormElements, setFrozenFormElements] = useState(formElementsList);
  const [treeKey, setTreeKey] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(75);

  const selectView = () => {
    return isTablet ? errorView : desktopView;
  };

  const navigateToQuestion = () => {
    if (!form?.id) return;
    setScrollToQuestionId(currentEditingElement?.id ?? 0);
    navigateToFormEdit(form.id);
  };

  const handleRegisterAndCloseModal = async () => {
    if (currentEditingElement) {
      const hasChanged = JSON.stringify(currentEditingElement) !== JSON.stringify(originalEditingElementRef.current);
      const updatedList = updateElementInList(formElementsList, currentEditingElement);
      if (hasChanged) {
        await saveFormElement(currentEditingElement);
      }
      setFrozenFormElements(updatedList);
    } else {
      setFrozenFormElements(formElementsList);
    }
    handleCloseModal();
    setTreeKey((prev) => prev + 1);
  };

  const handleCloseModal = () => {
    originalEditingElementRef.current = null;
    setCurrentEditingElement(null);
    toggleModal(ModalType.TREE_FORM_UPDATE);
  };

  const applyZoom = (value: number) => {
    treeRef.current?.zoomTo(value);
  };

  const errorView = (
    <Box sx={emptyStateWrapper}>
      <EmptyState
        image={<EmptyForm />}
        imageHeight={300}
        color="primary.main"
        title={""}
        description={t("formulaire.form.edit.forbidden.caption.mobile")}
        slotProps={{ description: { variant: TypographyVariant.BODY1 } }}
      />
      <Button
        variant={ComponentVariant.CONTAINED}
        onClick={() => {
          navigateToHome();
        }}
      >
        {t("formulaire.form.edit.forbidden.button.mobile")}
      </Button>
    </Box>
  );

  const desktopView = (
    <>
      <ZoomControl
        onChange={applyZoom}
        value={zoomLevel}
        min={MIN_TREE_ZOOM}
        max={MAX_TREE_ZOOM}
        step={STEPS_TREE_ZOOM}
      />
      <Box sx={creationViewStyle(isTheme1D)} data-type={ClickAwayDataType.ROOT}>
        <Box ref={headerRef} sx={creationHedearStyle}>
          {form && (
            <Header
              items={[form.title]}
              buttons={headerButtons}
              form={form}
              isCreationPage
              displaySeparator
              showCollapse={getRecursiveFolderParents(form.folder_id, folders).length > 1}
            />
          )}
        </Box>
        <Box sx={treeStyle}>
          <Box sx={treeTypographyStyle}>
            <Typography fontStyle={"italic"}>{t("formulaire.scroll.legend")}</Typography>
            <Typography fontStyle={"italic"}>{t("formulaire.mouse.legend")}</Typography>
          </Box>
          {form && (
            <>
              <FormTreeView
                key={treeKey}
                ref={treeRef}
                formElements={frozenFormElements}
                form={form}
                onZoomChange={setZoomLevel}
                onEditElement={(formElement) => {
                  originalEditingElementRef.current = formElement;
                  toggleModal(ModalType.TREE_FORM_UPDATE);
                  setCurrentEditingElement(formElement);
                }}
              />

              <ResponsiveDialog
                open={currentEditingElement !== null && showTreeFormUpdate}
                onClose={() => {
                  void handleRegisterAndCloseModal();
                }}
                maxWidth={BreakpointVariant.MD}
                fullWidth
                onKeyDown={(e) => {
                  //Pour pouvoir sauter des lignes dans les TextArea => Shift + Entrée
                  if (isEnterPressed(e) && !e.shiftKey) {
                    e.preventDefault();
                    void handleRegisterAndCloseModal();
                  }
                }}
              >
                <DialogTitle
                  color={TEXT_PRIMARY_COLOR}
                  variant={TypographyVariant.H2}
                  fontWeight={TypographyFontStyle.BOLD}
                >
                  {t("formulaire.form.edit.question")}
                </DialogTitle>
                <DialogContent>
                  {currentEditingElement && showTreeFormUpdate && (
                    <CreationSortableItem
                      key={currentEditingElement.id}
                      formElement={currentEditingElement}
                      isPreview={false}
                    />
                  )}
                </DialogContent>
                <DialogActions sx={{ justifyContent: "space-between" }}>
                  <Button onClick={navigateToQuestion} variant="text">
                    <Typography color="secondary">{t("formulaire.form.edit.redirection")}</Typography>
                  </Button>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button onClick={handleCloseModal}>{t("formulaire.cancel")}</Button>
                    <Button variant="contained" onClick={() => void handleRegisterAndCloseModal()}>
                      {t("formulaire.save")}
                    </Button>
                  </Box>
                </DialogActions>
              </ResponsiveDialog>
            </>
          )}
        </Box>
      </Box>
    </>
  );

  return <Box sx={creationViewStyle(isTheme1D)}>{selectView()}</Box>;
};
