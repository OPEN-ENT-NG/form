import { FC } from "react";
import { Box, TextField } from "@cgi-learning-hub/ui";
import { ComponentVariant } from "~/core/style/themeProps";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { longAnswerStyle } from "./style";

export const CreationQuestionLongAnswer: FC = () => {
  const { t } = useTranslation(FORMULAIRE);

  return (
    <Box>
      <TextField
        variant={ComponentVariant.OUTLINED}
        sx={longAnswerStyle}
        fullWidth
        placeholder={t("formulaire.question.type.LONGANSWER")}
        slotProps={{
          input: {
            readOnly: true,
          },
        }}
        disabled
      />
    </Box>
  );
};
