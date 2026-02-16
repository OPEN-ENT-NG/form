import { useMemo } from "react";

import { ICompleteResponse } from "~/core/models/response/type";
import { useGetFinishedDistributionsQuery } from "~/services/api/services/formulaireApi/distributionApi";
import { useGetAllResponsesQuery } from "~/services/api/services/formulaireApi/responseApi";
import { useGetQuestionFilesQuery } from "~/services/api/services/formulaireApi/responseFileApi";

import { DistributionId, QuestionId, ResultMap } from "./types";
import { buildResultMapFromAllData } from "./utils";

export const useBuildResponseMap = (formId: number) => {
  const { data: responses, isFetching: isResponsesLoading } = useGetAllResponsesQuery(formId);
  const { data: distributions, isFetching: isDistributionsLoading } = useGetFinishedDistributionsQuery(formId);
  const { data: files, isFetching: isFilesLoading } = useGetQuestionFilesQuery(formId);

  const resultMap: ResultMap = useMemo(() => {
    if (!responses || !distributions || !files) return new Map<QuestionId, Map<DistributionId, ICompleteResponse[]>>();
    return buildResultMapFromAllData(responses, distributions, files);
  }, [responses, distributions, files]);

  const isLoading = isResponsesLoading || isDistributionsLoading || isFilesLoading;
  return { resultMap, isLoading };
};
