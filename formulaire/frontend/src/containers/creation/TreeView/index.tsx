import { Box, Button, DialogContent, EmptyState, Typography, ZoomControl } from "@cgi-learning-hub/ui";
import { FC, useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { sectionFooterStyle } from "~/components/CreationSection/style";
import { CreationSortableItem } from "~/components/CreationSortableItem";
import { Header } from "~/components/Header";
import { ResponsiveDialog } from "~/components/ResponsiveDialog";
import { EmptyForm } from "~/components/SVG/EmptyForm";
import { FormTreeView } from "~/components/TreeGraph";
import { IFormTreeViewHandle } from "~/components/TreeGraph/types";
import { useElementHeight } from "~/containers/home/HomeView/utils";
import { FORMULAIRE, MAX_TREE_ZOOM, MIN_TREE_ZOOM, STEPS_TREE_ZOOM } from "~/core/constants";
import { ClickAwayDataType, ModalType } from "~/core/enums";
import { IFormElement } from "~/core/models/formElement/types";
import { BreakpointVariant, ComponentVariant, TypographyVariant } from "~/core/style/themeProps";
import { useFormulaireNavigation } from "~/hook/useFormulaireNavigation";
import { useTheme } from "~/hook/useTheme";
import { useCreation } from "~/providers/CreationProvider";
import { useGlobal } from "~/providers/GlobalProvider";

import { creationHedearStyle, creationViewStyle, emptyStateWrapper } from "../CreationView/style";
import { treeStyle, treeTypographyStyle } from "./style";
import { getRecursiveFolderParents, useGetTreeHeaderButtons } from "./utils";

export const TreeView: FC = () => {
  const { t } = useTranslation(FORMULAIRE);
  const { form, folders, formElementsList, currentEditingElement, setCurrentEditingElement, setScrollToQuestionId } =
    useCreation();
  const [headerRef] = useElementHeight<HTMLDivElement>();
  const headerButtons = useGetTreeHeaderButtons();
  const { navigateToHome, navigateToFormEdit } = useFormulaireNavigation();

  const { isTablet } = useGlobal();
  const { isTheme1D } = useTheme();

  const memoizedFormElements = useMemo(() => formElementsList, [formElementsList]);

  const [treeKey, setTreeKey] = useState(0);

  const treeRef = useRef<IFormTreeViewHandle>(null);
  const [zoomLevel, setZoomLevel] = useState(75);

  const {
    displayModals: { showTreeFormUpdate },
    toggleModal,
  } = useGlobal();

  const selectView = () => {
    return isTablet ? errorView : desktopView;
  };

  const handleEditElement = useCallback(
    (formElement: IFormElement) => {
      toggleModal(ModalType.TREE_FORM_UPDATE);
      setCurrentEditingElement(formElement);
    },
    [setCurrentEditingElement, toggleModal],
  );

  const navigateToQuestion = () => {
    if (!form?.id) return;
    setScrollToQuestionId(currentEditingElement?.id ?? 0);
    navigateToFormEdit(form.id);
  };

  const handleCloseModal = () => {
    setCurrentEditingElement(null);
    toggleModal(ModalType.TREE_FORM_UPDATE);
    setTreeKey((prev) => prev + 1);
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
                formElements={memoizedFormElements}
                form={form}
                onZoomChange={setZoomLevel}
                onEditElement={handleEditElement}
              />

              <ResponsiveDialog
                open={currentEditingElement !== null && showTreeFormUpdate}
                onClose={handleCloseModal}
                maxWidth={BreakpointVariant.MD}
                fullWidth
              >
                <DialogContent>
                  {currentEditingElement && showTreeFormUpdate && (
                    <>
                      <CreationSortableItem formElement={currentEditingElement} isPreview={false} />
                      <Box sx={sectionFooterStyle}>
                        <Button onClick={navigateToQuestion} variant="text">
                          <Typography color="secondary">{t("formulaire.section.new.question")}</Typography>
                        </Button>
                      </Box>
                    </>
                  )}
                </DialogContent>
              </ResponsiveDialog>
            </>
          )}
        </Box>
      </Box>
    </>
  );

  return <Box sx={creationViewStyle(isTheme1D)}>{selectView()}</Box>;
};
