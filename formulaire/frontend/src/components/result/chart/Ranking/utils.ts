import { compareChoices } from "~/containers/creation/CreationQuestionChoiceWrapper/utils";
import { GRAPH_COLORS } from "~/core/constants";
import { IQuestion } from "~/core/models/question/types";
import { ICompleteResponse } from "~/core/models/response/type";
import { DistributionMap } from "~/providers/ResultProvider/hook/UseBuildResultMap/types";

const categories = (question: IQuestion): string[] => question.choices?.map((_, index) => (index + 1).toString()) ?? [];

export const options = (question: IQuestion, distributionMap: DistributionMap) => {
  return {
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    xaxis: {
      categories: categories(question),
    },
    colors: GRAPH_COLORS,
  };
};

export const series = (question: IQuestion, distributionMap: DistributionMap) => {
  const allResponses: ICompleteResponse[] = Array.from(distributionMap.values()).flat();

  const sortedChoices = [...(question.choices ?? [])].sort(compareChoices);

  return sortedChoices.map((choice) => {
    const name = choice.value;
    const data = sortedChoices.map((_, index) => {
      return allResponses.filter((response) => response.choiceId === choice.id && response.choicePosition === index + 1)
        .length;
    });
    return { name, data };
  });
};
