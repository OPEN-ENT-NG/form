import { FC } from "react";
import { Box, Typography } from "@cgi-learning-hub/ui";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { TypographyVariant } from "~/core/style/themeProps";
import { CreationQuestionChoiceWrapper } from "~/containers/CreationQuestionChoiceWrapper";
import { QuestionTypes } from "~/core/models/question/enum";
import { ICreationQuestionMatrixProps } from "./types";
import { matrixStyle } from "./style";
import { CreationMatrixChildrenWrapper } from "~/containers/CreationMatrixChildrenWrapper";
import { TEXT_PRIMARY_COLOR } from "~/core/style/colors";

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
