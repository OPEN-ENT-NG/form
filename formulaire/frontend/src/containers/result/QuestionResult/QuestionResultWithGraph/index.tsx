import { Box, Stack, Typography } from "@cgi-learning-hub/ui";
import { FC, useMemo } from "react";
import { ResultChart } from "~/components/result/ResultChart";
import { compareChoices } from "~/containers/creation/CreationQuestionChoiceWrapper/utils";
import { QuestionTypes } from "~/core/models/question/enum";
import { t } from "~/i18n";
import { IQuestionResultWithGraphProps } from "./types";
import { getDisplayedResponseStat, getResponseStatsMap } from "./utils";

export const QuestionResultWithGraph: FC<IQuestionResultWithGraphProps> = ({question, distributionMap}) => {
    const showLeftResponsesStat = useMemo(()=> question.questionType === QuestionTypes.SINGLEANSWER || question.questionType === QuestionTypes.SINGLEANSWERRADIO || question.questionType === QuestionTypes.MULTIPLEANSWER, [question])
    const sortedChoices = useMemo(()=> [...question.choices ?? []].sort(compareChoices), [question])
    const responseStatsMap = useMemo(()=> showLeftResponsesStat ? getResponseStatsMap(sortedChoices, distributionMap): new Map(), [sortedChoices, distributionMap, showLeftResponsesStat])
    return (
        <Stack direction="row">
        {showLeftResponsesStat && (
            <Stack width="40%">
            {sortedChoices.map((choice, index) => (
                    <Stack direction="row" justifyContent="space-between">
                        <Box>
                            <Typography>
                                {`${index+1}. ${choice.value}`}
                            </Typography>
                        </Box>
                        <Box>
                            {getDisplayedResponseStat(choice.id, responseStatsMap, question)}
                        </Box>
                    </Stack>
                )
            )}
            {!question.mandatory && (
                <Stack direction="row" justifyContent="space-between">
                    <Box >
                        <Typography>
                            {t("formulaire.response.empty")}
                        </Typography>
                    </Box>
                    <Box >
                        {getDisplayedResponseStat("empty", responseStatsMap, question)}
                    </Box>
                </Stack>
            )}
            </Stack>
        )}
    
        <Box flex={1} minWidth={0}>
            <ResultChart question={question} distributionMap={distributionMap} />
        </Box>
        </Stack>
    )

}