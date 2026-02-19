import { ApexOptions } from "apexcharts";

import { GRAPH_COLORS } from "~/core/constants";
import { IQuestion } from "~/core/models/question/types";
import { ICompleteResponse } from "~/core/models/response/type";
import { t } from "~/i18n";
import { DistributionMap } from "~/providers/ResultProvider/hook/UseBuildResultMap/types";

export const getCursorChartProps = (
  question: IQuestion,
  distributionMap: DistributionMap,
): { options: ApexOptions; series: ApexAxisChartSeries; type: "area" } => {
  const allResponses: ICompleteResponse[] = Array.from(distributionMap.values()).flat();

  const minValue = question.specificFields?.cursorMinVal ?? 0;
  const maxValue = question.specificFields?.cursorMaxVal ?? 0;

  const countMap = allResponses.reduce((acc, response) => {
    const value = Number(response.answer);
    if (!isNaN(value)) {
      acc.set(value, (acc.get(value) ?? 0) + 1);
    }
    return acc;
  }, new Map<number, number>());

  if (!countMap.has(minValue)) countMap.set(minValue, 0);
  if (!countMap.has(maxValue)) countMap.set(maxValue, 0);

  const data = Array.from(countMap.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([x, y]) => ({ x, y }));

  const options: ApexOptions = {
    chart: {
      zoom: { enabled: false },
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      type: "numeric",
      min: minValue,
      max: maxValue,
      labels: {
        formatter: (val: string) => Math.round(Number(val)).toString(),
      },
      title: { text: t("formulaire.selected.values"), offsetY: 70 },
    },
    yaxis: {
      min: 0,
      title: { text: t("formulaire.nb.responses") },
      labels: {
        formatter: (val: number) => Math.round(val).toString(),
      },
    },
    colors: GRAPH_COLORS,
  };

  const series = [
    {
      name: t("formulaire.nb.responses"),
      data,
    },
  ];

  const type = "area";

  return { options, series, type };
};
