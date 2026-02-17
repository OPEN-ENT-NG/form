import { ApexOptions } from "apexcharts";

import { compareChoices } from "~/containers/creation/CreationQuestionChoiceWrapper/utils";
import { GRAPH_COLORS } from "~/core/constants";
import { IQuestion } from "~/core/models/question/types";
import { ICompleteResponse } from "~/core/models/response/type";
import { t } from "~/i18n";
import { DistributionMap } from "~/providers/ResultProvider/hook/UseBuildResultMap/types";

export const getCategories = (question: IQuestion): string[] => {
  const sortedChoices = [...(question.choices || [])].sort(compareChoices);

  return [
    ...sortedChoices.map((choice) => choice.value),
    ...(question.mandatory ? [] : [t("formulaire.response.empty")]),
  ];
};

export const getOptions = (question: IQuestion): ApexOptions => {
  return {
    chart: {
      id: "basic-bar",
    },
    xaxis: {
      categories: getCategories(question),
    },
    colors: GRAPH_COLORS,
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true,
      },
    },
  };
};

export const getSeries = (question: IQuestion, distributionMap: DistributionMap) => {
  const allResponses: ICompleteResponse[] = Array.from(distributionMap.values()).flat();
  const sortedChoices = [...(question.choices || [])].sort(compareChoices);
  const nbEmptyDistribution = Array.from(distributionMap.values()).filter(
    (responses) => responses.length === 0 || responses.every((response) => !response.choiceId),
  ).length;

  return [
    {
      name: t("formulaire.nb.responses"),
      data: [
        ...sortedChoices.map((choice) => allResponses.filter((response) => response.choiceId === choice.id).length),
        ...(question.mandatory ? [] : [nbEmptyDistribution]),
      ],
    },
  ];
};
