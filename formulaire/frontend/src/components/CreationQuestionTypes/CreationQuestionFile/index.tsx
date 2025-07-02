import { FC } from "react";
import { Box, Typography } from "@cgi-learning-hub/ui";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { TypographyVariant } from "~/core/style/themeProps";

export const CreationQuestionFile: FC = () => {
  const { t } = useTranslation(FORMULAIRE);

  return (
    <Box>
      <Typography variant={TypographyVariant.BODY2}>{t("formulaire.question.type.FILE")}</Typography>
    </Box>
  );
};
