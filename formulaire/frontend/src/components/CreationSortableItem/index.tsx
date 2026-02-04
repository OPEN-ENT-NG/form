import { Box } from "@cgi-learning-hub/ui";
import { FC } from "react";
import { CreationQuestionWrapper } from "~/containers/CreationQuestionWrapper";
import { CreationSectionWrapper } from "~/containers/CreationSectionWrapper";
import { isQuestion, isSection } from "~/core/models/formElement/utils";
import { ICreationSortableItemProps } from "./types";

export const CreationSortableItem: FC<ICreationSortableItemProps> = ({ formElement, isPreview }) => {
  return (
    <Box
      sx={{
        opacity: isPreview ? 0.5 : 1,
      }}
    >
      {isQuestion(formElement) && <CreationQuestionWrapper isPreview={isPreview} isRoot question={formElement} />}
      {isSection(formElement) && <CreationSectionWrapper isPreview={isPreview} section={formElement} />}
    </Box>
  );
};
