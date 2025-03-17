import { Box, Button } from "@cgi-learning-hub/ui";
import { FC } from "react";

import { HeaderProps } from "./types";
import { FormBreadcrumbs } from "../Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { ButtonVariant } from "~/core/style/themeProps";
import { headerStyle } from "../Breadcrumbs/style";
import { ModalType } from "~/core/enums";

export const Header: FC<HeaderProps> = ({
  stringItems,
  buttons,
  isCreationPage = false,
}) => {
  const { t } = useTranslation(FORMULAIRE);

  const handleOpenModal = (mdoalType: ModalType) => {
    switch (mdoalType) {
      case ModalType.CREATE:
        console.log("call modal creation");
        break;
      case ModalType.IMPORT:
        console.log("call modal creation");
        break;
      default:
        console.log("unknown modal type");
    }
  };

  return (
    <Box sx={headerStyle}>
      <FormBreadcrumbs
        stringItems={stringItems}
        separator={<NavigateNextIcon sx={{ height: "2.4rem" }} />}
        isHeader
      />
      {isCreationPage && <Box>//TODO</Box>}
      <Box>
        {buttons.map((button) => (
          <Button
            key={button.titleI18nkey}
            variant={button.variant ?? ButtonVariant.CONTAINED}
            onClick={() => handleOpenModal(button.modalType)}
            sx={{ marginLeft: "2rem" }}
          >
            {t(button.titleI18nkey)}
          </Button>
        ))}
      </Box>
    </Box>
  );
};
