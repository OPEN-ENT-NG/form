import { FC, useEffect, useState } from "react";
import { ICreationQuestionTypesProps } from "../types";
import { Box, TextField } from "@cgi-learning-hub/ui";
import { ComponentVariant } from "~/core/style/themeProps";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { useCreation } from "~/providers/CreationProvider";
import { isCurrentEditingElement } from "~/providers/CreationProvider/utils";

export const CreationQuestionShortAnswer: FC<ICreationQuestionTypesProps> = ({ question }) => {
  const { t } = useTranslation(FORMULAIRE);
  const [currentQuestionPlaceholder, setCurrentQuestionPlaceholder] = useState<string>(question.placeholder ?? "");
  const { currentEditingElement, setCurrentEditingElement } = useCreation();

  const handlePlaceholderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentQuestionPlaceholder(event.target.value);
    question.placeholder = event.target.value;
  };

  useEffect(() => {
    if (!currentEditingElement || !isCurrentEditingElement(question, currentEditingElement)) {
      return;
    }
    const updatedQuestion = {
      ...question,
      placeholder: currentQuestionPlaceholder,
    };

    setCurrentEditingElement(updatedQuestion);
  }, [currentQuestionPlaceholder, setCurrentEditingElement]);

  return (
    <Box>
      <TextField
        variant={ComponentVariant.OUTLINED}
        fullWidth
        multiline
        placeholder={t("formulaire.question.type.SHORTANSWER")}
        value={currentQuestionPlaceholder}
        onChange={handlePlaceholderChange}
        slotProps={{
          input: {
            readOnly: !isCurrentEditingElement(question, currentEditingElement),
            sx: {
              pointerEvents: !isCurrentEditingElement(question, currentEditingElement) ? "none" : "auto",
              userSelect: !isCurrentEditingElement(question, currentEditingElement) ? "none" : "auto",
            },
          },
        }}
      />
    </Box>
  );
};
