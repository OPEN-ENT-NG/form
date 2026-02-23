import ApexCharts, { ApexOptions } from "apexcharts";

import { RESULT_CHART_PDF } from "~/core/constants";
import { IFormElement } from "~/core/models/formElement/types";
import { isQuestion, isSection } from "~/core/models/formElement/utils";
import { IQuestion } from "~/core/models/question/types";
import { isQuestionTypeWithGraph } from "~/core/models/question/utils";

export const getQuestionsWithGraph = (formElementList: IFormElement[]) => {
  const allQuestions: IQuestion[] = formElementList.flatMap((formElement) => {
    if (isQuestion(formElement)) return formElement;
    if (isSection(formElement)) return formElement.questions;
    return [];
  });

  return allQuestions.filter(isQuestionTypeWithGraph);
};

export const generateChartImage = async (
  options: ApexOptions,
  series: number[] | ApexAxisChartSeries,
  type: "area" | "bar" | "pie",
): Promise<Blob> => {
  const el = document.createElement("div");
  el.style.position = "absolute";
  el.style.left = "-9999px";
  el.style.top = "0";
  document.body.appendChild(el);

  const chart = new ApexCharts(el, {
    ...options,
    series,
    chart: {
      ...options.chart,
      type,
      animations: { enabled: false },
      toolbar: { show: false },
      width: RESULT_CHART_PDF.width,
      height: RESULT_CHART_PDF.height,
    },
  });

  await chart.render();

  const image = (await chart.dataURI()) as {
    imgURI: string;
  };

  const blob = new Blob([image["imgURI"]], { type: "image/png" });

  chart.destroy();
  document.body.removeChild(el);

  return blob;
};

export const prepareFormDataForPdf = (images: Blob[], questions: IQuestion[]): FormData => {
  const formData = new FormData();

  images.forEach((blob, index) => {
    const question = questions[index];
    formData.append(`graph-${question.formId}-${question.id}`, blob, `graph-${question.formId}-${question.id}.png`);
  });

  return formData;
};
