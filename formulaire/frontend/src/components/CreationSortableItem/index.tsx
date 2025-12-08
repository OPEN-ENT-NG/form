import { Box } from "@cgi-learning-hub/ui";
import { FC } from "react";
import { CreationQuestionWrapper } from "~/containers/CreationQuestionWrapper";
import { CreationSectionWrapper } from "~/containers/CreationSectionWrapper";
import { IQuestion } from "~/core/models/question/types";
import { isFormElementQuestion } from "~/core/models/question/utils";
import { ISection } from "~/core/models/section/types";
import { ICreationSortableItemProps } from "./types";

export const CreationSortableItem: FC<ICreationSortableItemProps> = ({ formElement, isPreview }) => {
  return (
    <Box
      sx={{
        opacity: isPreview ? 0.5 : 1,
      }}
    >
      {isFormElementQuestion(formElement) ? (
        <CreationQuestionWrapper isPreview={isPreview} question={formElement as IQuestion} />
      ) : (
        <CreationSectionWrapper isPreview={isPreview} section={formElement as ISection} />
      )}
    </Box>
  );
};
