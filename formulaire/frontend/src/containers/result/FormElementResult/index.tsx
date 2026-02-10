import { Stack } from "@cgi-learning-hub/ui";
import { FC } from "react";

import { isQuestion, isSection } from "~/core/models/formElement/utils";

import { QuestionResult } from "../QuestionResult";
import { SectionResult } from "../SectionResult";
import { IFormElementResultProps } from "./types";

export const FormElementResult: FC<IFormElementResultProps> = ({ formElement }) => {
  return (
    <Stack>
      {isQuestion(formElement) && <QuestionResult question={formElement} />}
      {isSection(formElement) && <SectionResult section={formElement} />}
    </Stack>
  );
};
