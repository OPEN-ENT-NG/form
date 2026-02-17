import { ApexOptions } from "apexcharts";

import { compareChildren } from "~/containers/creation/CreationMatrixChildrenWrapper/utils";
import { compareChoices } from "~/containers/creation/CreationQuestionChoiceWrapper/utils";
import { GRAPH_COLORS } from "~/core/constants";
import { IQuestion, IQuestionChoice } from "~/core/models/question/types";
import { ICompleteResponse } from "~/core/models/response/type";
import { DistributionMap } from "~/providers/ResultProvider/hook/UseBuildResultMap/types";

const getCategories = (question: IQuestion): string[] => {
  return [...(question.children || [])].sort(compareChildren).map((child) => child.title ?? "");
};

export const getOptions = (question: IQuestion): ApexOptions => {
  return {
    chart: {
      type: "bar",
    },
    xaxis: {
      categories: getCategories(question),
    },
    colors: GRAPH_COLORS,
  };
};

export const getSeries = (question: IQuestion, distributionMap: DistributionMap) => {
  const allResponses: ICompleteResponse[] = Array.from(distributionMap.values()).flat();

  const sortedChildren: IQuestion[] = [...(question.children || [])].sort(compareChildren);
  const sortedChoices: IQuestionChoice[] = [...(question.choices || [])].sort(compareChoices);

  return sortedChoices.map((choice) => {
    return {
      name: choice.value ?? "",
      data: sortedChildren.map((child) => {
        return allResponses.filter((response) => response.questionId === child.id && response.choiceId === choice.id)
          .length;
      }),
    };
  });
};
