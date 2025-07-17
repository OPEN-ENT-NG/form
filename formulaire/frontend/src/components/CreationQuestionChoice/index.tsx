import { FC } from "react";
import { Box, Button, TextField, Typography } from "@cgi-learning-hub/ui";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { ICreationQuestionChoiceProps } from "./types";
import { CreationQuestionChoiceType } from "./enum";

export const CreationQuestionChoice: FC<ICreationQuestionChoiceProps> = ({type, text, onDelete, hasImage, image = ""}) => {
  const { t } = useTranslation(FORMULAIRE);

  const typeToIcons: Record<CreationQuestionChoiceType, string> = {
    [CreationQuestionChoiceType.SINGLE_CHOICE]: "●",
    [CreationQuestionChoiceType.MULTIPLE_CHOICE]: "▼",
    [CreationQuestionChoiceType.DROPDOWN]: "▼",
  };

  return (
    <Box>
      <Typography>{typeToIcons[type]}</Typography>
      <TextField></TextField>
      {hasImage && <Button variant="outlined">Image</Button>}
    </Box>
  );
};
