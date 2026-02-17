import { ICompleteResponse } from "~/core/models/response/type";
import { t } from "~/i18n";

import { IChartData } from "./types";

export const mapCursorToChartData = (responses: ICompleteResponse[]): IChartData => {
  const sortedValues = responses.map((r) => Number(r.answer)).sort((a, b) => a - b);

  const countMap = new Map<number, number>();

  sortedValues.forEach((value) => {
    countMap.set(value, (countMap.get(value) ?? 0) + 1);
  });

  return {
    labels: Array.from(countMap.keys()).map((key) => key.toString()),
    series: [
      {
        name: t("formulaire.number.responses"),
        data: Array.from(countMap.values()),
      },
    ],
  };
};
