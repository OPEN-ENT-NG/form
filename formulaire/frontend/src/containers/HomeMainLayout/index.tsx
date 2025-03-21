import { FC } from "react";
import { Box, SearchInput } from "@cgi-learning-hub/ui";
import { Button, Switch } from "@mui/material";
import { FormBreadcrumbs } from "~/components/Breadcrumbs";
import { spaceBetweenBoxStyle } from "~/styles/boxStyles";

import { ComponentVariant } from "~/core/style/themeProps";
import { useHome } from "~/providers/HomeProvider";
import { mainContentInnerStyle, resourceContainerStyle, searchBarStyle, searchStyle } from "./styles";
import { HomeMainFolders } from "../HomeMainFolders";
import { useTranslation } from "react-i18next";
import { HomeMainForms } from "../HomeMainForms";
import { FORMULAIRE } from "~/core/constants";

export const HomeMainLayout: FC = () => {
  const { folders, forms, currentFolder } = useHome();

  const { t } = useTranslation(FORMULAIRE);

  const filteredFolders = folders.filter((folder) => folder.parent_id === (currentFolder ? currentFolder.id : null));

  const filteredForms = forms.filter((form) => form.folder_id === (currentFolder ? currentFolder.id : null));

  const hasFilteredFolders = !!filteredFolders.length;
  const hasFilteredForms = !!filteredForms.length;
  const breadcrumbsText = currentFolder?.name ? [currentFolder.name] : [];

  return (
    <Box sx={mainContentInnerStyle}>
      <Box sx={searchStyle}>
        <SearchInput placeholder={t("formulaire.search")} sx={searchBarStyle} />
        <Button variant={ComponentVariant.OUTLINED}>{t("formulaire.organize")}</Button>
      </Box>
      <Box sx={spaceBetweenBoxStyle}>
        <FormBreadcrumbs stringItems={breadcrumbsText} />
        <Switch />
      </Box>

      <Box sx={resourceContainerStyle}>
        {hasFilteredFolders && <HomeMainFolders folders={filteredFolders} />}
        {hasFilteredForms && <HomeMainForms forms={filteredForms} />}
      </Box>
    </Box>
  );
};
