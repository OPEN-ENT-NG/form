import { Box, Stack, Typography } from "@cgi-learning-hub/ui";
import dayjs from "dayjs";
import { FC, useMemo } from "react";

import { ResultChart } from "~/components/result/ResultChart";
import { ResultRow } from "~/components/result/ResultRow";
import { compareChoices } from "~/containers/creation/CreationQuestionChoiceWrapper/utils";
import { CHOICE_ID_FOR_NO_RESPONSE } from "~/core/constants";
import { QuestionTypes } from "~/core/models/question/enum";
import { ICompleteResponse } from "~/core/models/response/type";
import { t } from "~/i18n";

import { getDisplayDate } from "../utils";
import { ChoiceId, IQuestionResultWithGraphProps, IResponseStats } from "./types";
import { getAverage, getDisplayedResponseStat, getResponseStatsMap } from "./utils";

export const QuestionResultWithGraph: FC<IQuestionResultWithGraphProps> = ({ question, distributionMap }) => {
  const allResponses: ICompleteResponse[] = Array.from(distributionMap.values()).flat();
  const showLeftResponsesStat = useMemo(
    () =>
      question.questionType === QuestionTypes.SINGLEANSWER ||
      question.questionType === QuestionTypes.SINGLEANSWERRADIO ||
      question.questionType === QuestionTypes.MULTIPLEANSWER,
    [question],
  );
  const sortedChoices = useMemo(() => [...(question.choices ?? [])].sort(compareChoices), [question]);
  const responseStatsMap = useMemo(
    () =>
      showLeftResponsesStat ? getResponseStatsMap(sortedChoices, distributionMap) : new Map<ChoiceId, IResponseStats>(),
    [sortedChoices, distributionMap, showLeftResponsesStat],
  );
  const customReponses = useMemo(() => {
    const customChoice = question.choices?.find((choice) => choice.isCustom);
    return allResponses
      .filter((response) => response.choiceId === customChoice?.id && !!response.customAnswer)
      .sort((a, b) => dayjs(b.dateResponse).diff(dayjs(a.dateResponse)));
  }, [question, responseStatsMap]);

  return (
    <Stack gap={1}>
      <Stack direction="row">
        {showLeftResponsesStat && (
          <Stack width="45%" gap={0.4}>
            {sortedChoices.map((choice, index) => (
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography>{`${index + 1}. ${choice.value}`}</Typography>
                </Box>
                <Box width="15rem" minWidth="15rem">
                  {getDisplayedResponseStat(choice.id, responseStatsMap, question)}
                </Box>
              </Stack>
            ))}
            {!question.mandatory && (
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography>{t("formulaire.response.empty")}</Typography>
                </Box>
                <Box width="15rem" minWidth="15rem">
                  {getDisplayedResponseStat(CHOICE_ID_FOR_NO_RESPONSE, responseStatsMap, question)}
                </Box>
              </Stack>
            )}
          </Stack>
        )}

        <Box flex={1} minWidth={0}>
          <ResultChart question={question} distributionMap={distributionMap} />
          {question.questionType === QuestionTypes.CURSOR && (
            <Typography>{t("formulaire.response.average") + " " + getAverage(allResponses).toString()}</Typography>
          )}
        </Box>
      </Stack>
      {!!customReponses.length && (
        <Stack gap={1}>
          <Typography fontStyle="italic" color="text.secondary">
            {t("formulaire.results.custom.answers")}
          </Typography>
          <Stack gap={1}>
            {customReponses.map((customReponse) => (
              <ResultRow
                key={customReponse.id}
                displayDate={getDisplayDate(customReponse)}
                responderName={customReponse.responderName}
                answer={customReponse.customAnswer}
              />
            ))}
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};
