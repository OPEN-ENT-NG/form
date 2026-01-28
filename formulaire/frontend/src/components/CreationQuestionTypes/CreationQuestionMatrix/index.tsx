import { Box, Typography } from "@cgi-learning-hub/ui";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { CreationMatrixChildrenWrapper } from "~/containers/CreationMatrixChildrenWrapper";
import { CreationQuestionChoiceWrapper } from "~/containers/CreationQuestionChoiceWrapper";
import { FORMULAIRE } from "~/core/constants";
import { QuestionTypes } from "~/core/models/question/enum";
import { TEXT_PRIMARY_COLOR } from "~/core/style/colors";
import { TypographyVariant } from "~/core/style/themeProps";

import { matrixStyle } from "./style";
import { ICreationQuestionMatrixProps } from "./types";

export const CreationQuestionMatrix: FC<ICreationQuestionMatrixProps> = ({ question, matrixType }) => {
  const { t } = useTranslation(FORMULAIRE);

  return (
    <Box sx={matrixStyle}>
      <Box>
        <Typography color={TEXT_PRIMARY_COLOR} variant={TypographyVariant.H6}>
          {t("formulaire.matrix.columns")}
        </Typography>
        <CreationQuestionChoiceWrapper question={question} type={QuestionTypes.MATRIX} hideCustomChoice />
      </Box>
      <Box>
        <Typography color={TEXT_PRIMARY_COLOR} variant={TypographyVariant.H6}>
          {t("formulaire.matrix.lines")}
        </Typography>
        <CreationMatrixChildrenWrapper question={question} matrixType={matrixType} />
      </Box>
    </Box>
  );
};
