import { Box, Typography } from "@cgi-learning-hub/ui";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { FORMULAIRE } from "~/core/constants";
import { TypographyVariant } from "~/core/style/themeProps";

export const CreationQuestionTime: FC = () => {
  const { t } = useTranslation(FORMULAIRE);

  return (
    <Box>
      <Typography variant={TypographyVariant.BODY1}>{t("formulaire.question.time.empty")}</Typography>
    </Box>
  );
};
