import { getChartProps } from "~/components/result/ResultChart/utils.ts";
import { IFormElement } from "~/core/models/formElement/types";
import { IQuestion } from "~/core/models/question/types";
import { DistributionMap } from "~/providers/ResultProvider/hook/UseBuildResultMap/types";

import { generateChartImage, getQuestionsWithGraph, prepareFormDataForPdf } from "./utils";

export const useGeneratePdf = (
  formElementList: IFormElement[],
  getDistributionMap: (question: IQuestion) => DistributionMap,
) => {
  const generatePdfFormData = async (): Promise<{ filesFormData: FormData; nbFiles: number }> => {
    const questionsWithGraph = getQuestionsWithGraph(formElementList);

    const images: Blob[] = await Promise.all(
      questionsWithGraph.map(async (question) => {
        const { options, series, type } = getChartProps(question, getDistributionMap(question));

        return await generateChartImage(options, series, type);
      }),
    );

    const formData: FormData = prepareFormDataForPdf(images, questionsWithGraph);
    return { filesFormData: formData, nbFiles: images.length };
  };

  return { generatePdfFormData };
};
