import { ApexOptions } from "apexcharts";

import { GRAPH_COLORS } from "~/core/constants";
import { IQuestion } from "~/core/models/question/types";
import { ICompleteResponse } from "~/core/models/response/type";
import { t } from "~/i18n";
import { DistributionMap } from "~/providers/ResultProvider/hook/UseBuildResultMap/types";

const getCategories = (question: IQuestion, distributionMap: DistributionMap): number[] => {
  const allResponses: ICompleteResponse[] = Array.from(distributionMap.values()).flat();
  const minValue = question.specificFields?.cursorMinVal;
  const maxValue = question.specificFields?.cursorMaxVal;

  const uniqueAnsweredValues = [
    ...new Set([
      ...(minValue ? [minValue] : []),
      ...allResponses.map((response) => Number(response.answer)).filter((answer): answer is number => !isNaN(answer)),
      ...(maxValue ? [maxValue] : []),
    ]),
  ];

  const uniqueSortedAnsweredValues = uniqueAnsweredValues.sort((a, b) => a - b);

  return uniqueSortedAnsweredValues;
};

export const getOptions = (question: IQuestion, distributionMap: DistributionMap): ApexOptions => {
  return {
    chart: {
      zoom: {
        enabled: false,
      },
    },
    xaxis: {
      categories: getCategories(question, distributionMap),
      type: "numeric",
    },
    colors: GRAPH_COLORS,
  };
};

export const getSeries = (question: IQuestion, distributionMap: DistributionMap) => {
  const allResponses: ICompleteResponse[] = Array.from(distributionMap.values()).flat();

  const minValue = question.specificFields?.cursorMinVal?.toString();
  const maxValue = question.specificFields?.cursorMaxVal?.toString();

  const uniqueAnsweredValues = [
    ...new Set([
      ...(minValue ? minValue.toString() : []),
      ...allResponses
        .map((response) => response.answer?.toString())
        .filter((answer): answer is string => answer !== undefined),
      ...(maxValue ? [maxValue.toString()] : []),
    ]),
  ];

  const uniqueSortedAnsweredValues = uniqueAnsweredValues.sort((a, b) => {
    const aNum = parseFloat(a);
    const bNum = parseFloat(b);
    if (isNaN(aNum) || isNaN(bNum)) {
      return a.localeCompare(b);
    }
    return aNum - bNum;
  });

  return [
    {
      name: t("formulaire.nb.responses"),
      data: [...uniqueSortedAnsweredValues.map((v) => allResponses.filter((r) => r.answer?.toString() === v).length)],
    },
  ];
};
