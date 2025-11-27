import { ChangeEvent, FC, useEffect, useState } from "react";
import { Box, TextField } from "@cgi-learning-hub/ui";
import { IRespondQuestionTypesProps } from "../types";
import { t } from "~/i18n";
import { useGlobal } from "~/providers/GlobalProvider";
import { useRespondQuestion } from "~/containers/RespondQuestionWrapper/useRespondQuestion";

export const RespondQuestionShortAnswer: FC<IRespondQuestionTypesProps> = ({ question }) => {
  const { selectAllTextInput } = useGlobal();
  const { getQuestionResponses, updateQuestionResponses } = useRespondQuestion(question);
  const [answer, setAnswer] = useState<string>("");

  useEffect(() => {
    const associatedResponse = getAssociatedResponse();
    const existingAnswer = associatedResponse.answer;
    if (typeof existingAnswer === "string") setAnswer(existingAnswer);
  }, []);

  const handleResponseChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAnswer(event.target.value);
    if (!question.id) return;
    const associatedResponse = getAssociatedResponse();
    associatedResponse.answer = event.target.value;
    updateQuestionResponses([associatedResponse]);
  };

  const getAssociatedResponse = () => {
    const questionResponses = getQuestionResponses();
    return questionResponses[0]; // SHORTANSWER question should always have only 1 response associated
  };

  return (
    <Box>
      <TextField
        placeholder={question.placeholder ?? t("formulaire.question.type.SHORTANSWER")}
        fullWidth
        value={answer}
        onChange={handleResponseChange}
        onFocus={selectAllTextInput}
        error={question.mandatory && !answer}
      />
    </Box>
  );
};
