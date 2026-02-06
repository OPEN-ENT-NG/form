import { TextField, Typography } from "@cgi-learning-hub/ui";
import { ChangeEvent, FC, useEffect, useState } from "react";

import { ResponsePageType } from "~/core/enums";
import { t } from "~/i18n";
import { useGlobal } from "~/providers/GlobalProvider";
import { useResponse } from "~/providers/ResponseProvider";

import { IRespondQuestionTypesProps } from "../types";

export const RespondQuestionShortAnswer: FC<IRespondQuestionTypesProps> = ({ question }) => {
  const { selectAllTextInput } = useGlobal();
  const { getQuestionResponse, updateQuestionResponses, pageType } = useResponse();
  const [answer, setAnswer] = useState<string>("");
  const isPageTypeRecap = pageType === ResponsePageType.RECAP;

  useEffect(() => {
    const associatedResponse = getQuestionResponse(question);
    if (!associatedResponse) return;
    const existingAnswer = associatedResponse.answer;
    if (typeof existingAnswer === "string") setAnswer(existingAnswer);
  }, []);

  const handleResponseChange = (event: ChangeEvent<HTMLInputElement>) => {
    const associatedResponse = getQuestionResponse(question);
    if (!question.id || !associatedResponse) return;
    setAnswer(event.target.value);
    associatedResponse.answer = event.target.value;
    updateQuestionResponses(question, [associatedResponse]);
  };

  return isPageTypeRecap && !answer ? (
    <Typography fontStyle={"italic"}>{t("formulaire.response.missing")}</Typography>
  ) : (
    <TextField
      placeholder={question.placeholder ?? t("formulaire.question.type.SHORTANSWER")}
      fullWidth
      value={answer}
      onChange={handleResponseChange}
      onFocus={selectAllTextInput}
      error={question.mandatory && !answer}
    />
  );
};
