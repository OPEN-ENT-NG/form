import { Box, DatePicker } from "@cgi-learning-hub/ui";
import dayjs, { Dayjs, isDayjs } from "dayjs";
import { FC, useEffect, useState } from "react";
import { useResponse } from "~/providers/ResponseProvider";
import { IRespondQuestionTypesProps } from "../types";

export const RespondQuestionDate: FC<IRespondQuestionTypesProps> = ({ question }) => {
  const { getQuestionResponse, updateQuestionResponses } = useResponse();
  const [localDate, setLocalDate] = useState<Dayjs | null>(null);

  useEffect(() => {
    const associatedResponse = getQuestionResponse(question);
    if (!associatedResponse) return;

    const existingAnswer = associatedResponse.answer;

    if (existingAnswer instanceof Date) {
      setLocalDate(dayjs(existingAnswer));
    } else if (isDayjs(existingAnswer)) {
      setLocalDate(existingAnswer);
    } else if (typeof existingAnswer === "string") {
      const d = new Date(existingAnswer);
      if (!isNaN(d.getTime())) setLocalDate(dayjs(d));
    }
  }, [question, getQuestionResponse]);

  const handleDateChange = (value: Dayjs | null) => {
    const associatedResponse = getQuestionResponse(question);
    if (!question.id || !associatedResponse) return;

    setLocalDate(value);
    const dateToSave: Date | undefined = value?.toDate();
    associatedResponse.answer = dateToSave;
    updateQuestionResponses(question, [associatedResponse]);
  };

  return (
    <Box>
      <DatePicker adapterLocale="fr" value={localDate} onChange={handleDateChange} />
    </Box>
  );
};
