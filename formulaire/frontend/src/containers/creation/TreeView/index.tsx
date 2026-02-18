import { Box, Button, EmptyState, Typography } from "@cgi-learning-hub/ui";
import { FC, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Header } from "~/components/Header";
import { EmptyForm } from "~/components/SVG/EmptyForm";
import { FormTreeView } from "~/components/TreeGraph";
import { IFormTreeViewHandle } from "~/components/TreeGraph/types";
import { ZoomComponent } from "~/components/ZoomComponent";
import { useElementHeight } from "~/containers/home/HomeView/utils";
import { FORMULAIRE } from "~/core/constants";
import { ClickAwayDataType } from "~/core/enums";
import { ComponentVariant, TypographyVariant } from "~/core/style/themeProps";
import { useFormulaireNavigation } from "~/hook/useFormulaireNavigation";
import { useTheme } from "~/hook/useTheme";
import { useCreation } from "~/providers/CreationProvider";
import { useGlobal } from "~/providers/GlobalProvider";

import { creationHedearStyle, creationViewStyle, emptyStateWrapper } from "../CreationView/style";
import { treeStyle, treeTypographyStyle } from "./style";
import { getRecursiveFolderParents, useGetTreeHeaderButtons } from "./utils";

export const TreeView: FC = () => {
  const { t } = useTranslation(FORMULAIRE);
  const { form, folders, formElementsList } = useCreation();
  const [headerRef] = useElementHeight<HTMLDivElement>();
  const headerButtons = useGetTreeHeaderButtons();
  const { navigateToHome } = useFormulaireNavigation();

  const { isTablet } = useGlobal();
  const { isTheme1D } = useTheme();

  const treeRef = useRef<IFormTreeViewHandle>(null);
  const [zoomLevel, setZoomLevel] = useState(75);

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
          navigateToHome();
        }}
      >
        {t("formulaire.form.edit.forbidden.button.mobile")}
      </Button>
    </Box>
  );

  const desktopView = (
    <>
      <ZoomComponent
        zoomLevel={zoomLevel}
        zoomMaxLevel={300}
        zoomIn={() => treeRef.current?.zoomIn()}
        zoomOut={() => treeRef.current?.zoomOut()}
        resetZoom={() => treeRef.current?.resetZoom()}
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
            <FormTreeView ref={treeRef} formElements={formElementsList} form={form} onZoomChange={setZoomLevel} />
          )}
        </Box>
      </Box>
    </>
  );

  return <Box sx={creationViewStyle(isTheme1D)}>{selectView()}</Box>;
};
