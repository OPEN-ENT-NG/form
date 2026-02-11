import { DatePicker, Typography } from "@cgi-learning-hub/ui";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs, isDayjs } from "dayjs";
import { FC, useEffect, useState } from "react";

import { t } from "~/i18n";
import { useResponse } from "~/providers/ResponseProvider";

import { IRespondQuestionTypesProps } from "../types";

export const RespondQuestionDate: FC<IRespondQuestionTypesProps> = ({ question }) => {
  const { getQuestionResponse, updateQuestionResponses, isPageTypeRecap } = useResponse();
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
    if (!value?.isValid()) return;
    const dateToSave: Date = value.toDate();
    associatedResponse.answer = dateToSave;
    updateQuestionResponses(question, [associatedResponse]);
  };

  return isPageTypeRecap ? (
    <Typography sx={{ ...(!localDate && { fontStyle: "italic" }) }}>
      {localDate?.toDate().toLocaleDateString() ?? t("formulaire.response.missing")}
    </Typography>
  ) : (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker adapterLocale="fr" value={localDate} onChange={handleDateChange} />
    </LocalizationProvider>
  );
};
