import { Box, Button, EmptyState } from "@cgi-learning-hub/ui";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Header } from "~/components/Header";
import { EmptyForm } from "~/components/SVG/EmptyForm";
import { FORMULAIRE } from "~/core/constants";
import { ClickAwayDataType, ModalType } from "~/core/enums";
import { IForm } from "~/core/models/form/types";
import { getHomePath } from "~/core/pathHelper";
import { ComponentVariant, TypographyVariant } from "~/core/style/themeProps";
import { useTheme } from "~/hook/useTheme";
import { useCreation } from "~/providers/CreationProvider";
import { useClickAwayEditingElement } from "~/providers/CreationProvider/hook/useClickAwayEditingElement";
import { useGlobal } from "~/providers/GlobalProvider";

import { CreateFormElementModal } from "../CreateFormElementModal";
import { CreationLayout } from "../CreationLayout";
import { CreationOrganisationModal } from "../CreationOrganisationModal";
import { useElementHeight } from "../HomeView/utils";
import { creationHedearStyle, creationViewStyle, emptyStateWrapper } from "./style";
import { getRecursiveFolderParents, useGetCreationHeaderButtons } from "./utils";

export const CreationView: FC = () => {
  const { t } = useTranslation(FORMULAIRE);
  const {
    form,
    folders,
    formElementsList,
    handleDeleteFormElement,
    currentEditingElement,
    setCurrentEditingElement,
    saveQuestion,
    saveSection,
    setFormElementsList,
    newChoiceValue,
    setNewChoiceValue,
  } = useCreation();
  const navigate = useNavigate();
  const [headerRef, headerHeight] = useElementHeight<HTMLDivElement>();
  const headerButtons = useGetCreationHeaderButtons(form?.id, !!formElementsList.length);

  const {
    displayModals: { showFormElementCreate, showOrganization },
    toggleModal,
    isTablet,
  } = useGlobal();

  const { handleClickAway } = useClickAwayEditingElement(
    handleDeleteFormElement,
    setCurrentEditingElement,
    formElementsList,
    setFormElementsList,
    newChoiceValue,
    setNewChoiceValue,
    saveQuestion,
    saveSection,
  );
  const { isTheme1D } = useTheme();

  const selectView = () => {
    return isTablet ? errorView : desktopView;
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
          navigate(getHomePath());
        }}
      >
        {t("formulaire.form.edit.forbidden.button.mobile")}
      </Button>
    </Box>
  );

  const desktopView = (
    <>
      <Box
        sx={creationViewStyle(isTheme1D)}
        data-type={ClickAwayDataType.ROOT}
        onMouseDown={(e) => {
          handleClickAway(e, currentEditingElement);
        }}
      >
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
        {form && <CreationLayout headerHeight={headerHeight} />}
      </Box>
      {showFormElementCreate && (
        <CreateFormElementModal
          isOpen={showFormElementCreate}
          handleClose={() => {
            toggleModal(ModalType.FORM_ELEMENT_CREATE);
          }}
        />
      )}
      {showOrganization && (
        <CreationOrganisationModal
          isOpen={showOrganization}
          handleClose={() => {
            toggleModal(ModalType.ORGANIZATION);
          }}
        />
      )}
    </>
  );

  return <Box sx={creationViewStyle(isTheme1D)}>{selectView()}</Box>;
};
