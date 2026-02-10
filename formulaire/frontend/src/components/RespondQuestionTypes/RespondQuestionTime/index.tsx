import { Typography } from "@cgi-learning-hub/ui";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import { FC, useEffect, useState } from "react";

import { HH_MM } from "~/core/constants";
import { dayjsToTimeString, timeStringToDayjs } from "~/core/dayjsUtils";
import { t } from "~/i18n";
import { useResponse } from "~/providers/ResponseProvider";

import { IRespondQuestionTypesProps } from "../types";

export const RespondQuestionTime: FC<IRespondQuestionTypesProps> = ({ question }) => {
  const { getQuestionResponse, updateQuestionResponses, isPageTypeRecap } = useResponse();
  const [localTime, setLocalTime] = useState<Dayjs | null>(null);

  useEffect(() => {
    const associatedResponse = getQuestionResponse(question);
    if (!associatedResponse) return;

    setLocalTime(timeStringToDayjs(associatedResponse.answer?.toString()));
  }, [question, getQuestionResponse]);

  const handleTimeChange = (value: Dayjs | null) => {
    const associatedResponse = getQuestionResponse(question);
    if (!question.id || !associatedResponse) return;

    setLocalTime(value);
    if (!value || !value.isValid()) return;
    associatedResponse.answer = dayjsToTimeString(value);
    updateQuestionResponses(question, [associatedResponse]);
  };

  return isPageTypeRecap ? (
    <Typography sx={{ ...(!localTime && { fontStyle: "italic" }) }}>
      {dayjsToTimeString(localTime) ?? t("formulaire.response.missing")}
    </Typography>
  ) : (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker ampm={false} value={localTime} onChange={handleTimeChange} format={HH_MM} />
    </LocalizationProvider>
  );
};
