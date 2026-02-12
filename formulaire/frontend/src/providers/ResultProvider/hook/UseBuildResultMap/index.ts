import { useMemo } from "react";

import { IFormElement } from "~/core/models/formElement/types";
import { ICompleteResponse } from "~/core/models/response/type";
import { useGetFinishedDistributionsQuery } from "~/services/api/services/formulaireApi/distributionApi";
import { useGetAllResponsesQuery } from "~/services/api/services/formulaireApi/responseApi";

import { DistributionId, QuestionId, ResultMap } from "./types";
import { buildResultMapFromAllData } from "./utils";

export const useBuildResponseMap = (formElement: IFormElement | null) => {
  const { data: responses, isFetching: isResponsesLoading } = useGetAllResponsesQuery(formElement?.formId ?? 0, {
    skip: !formElement?.formId,
  });
  const { data: distributions, isFetching: isDistributionsLoading } = useGetFinishedDistributionsQuery(
    formElement?.formId ?? 0,
    { skip: !formElement?.formId },
  );

  const resultMap: ResultMap = useMemo(() => {
    if (!responses || !distributions) return new Map<QuestionId, Map<DistributionId, ICompleteResponse[]>>();
    return buildResultMapFromAllData(responses, distributions);
  }, [responses, distributions]);

  const isLoading = isResponsesLoading || isDistributionsLoading;

  return { resultMap, isLoading };
};
