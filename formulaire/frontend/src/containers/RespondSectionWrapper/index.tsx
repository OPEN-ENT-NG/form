import { FC } from "react";
import { IRespondSectionWrapperProps } from "./types";
import { Paper, Stack, Typography } from "@cgi-learning-hub/ui";
import { sectionStackStyle } from "./style";
import { TypographyVariant } from "~/core/style/themeProps";
import { TEXT_PRIMARY_COLOR, TEXT_SECONDARY_COLOR } from "~/core/style/colors";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { RespondQuestionWrapper } from "../RespondQuestionWrapper";

export const RespondSectionWrapper: FC<IRespondSectionWrapperProps> = ({ section }) => {
  const { t } = useTranslation(FORMULAIRE);

  return (
    <Stack component={Paper} sx={sectionStackStyle}>
      <Typography variant={TypographyVariant.H6} color={section.title ? TEXT_PRIMARY_COLOR : TEXT_SECONDARY_COLOR}>
        {section.title || t("formulaire.section.title.empty")}
      </Typography>
      <Stack>
        {section.questions.map((question, index) => {
          return <RespondQuestionWrapper key={index} question={question} />;
        })}
      </Stack>
    </Stack>
  );
};
