import { Box } from "@cgi-learning-hub/ui";
import { FC } from "react";
import { CreationQuestionWrapper } from "~/containers/CreationQuestionWrapper";
import { CreationSectionWrapper } from "~/containers/CreationSectionWrapper";
import { ICreationSortableItemProps } from "./types";
import { isQuestion, isSection } from "~/core/models/formElement/utils";

export const CreationSortableItem: FC<ICreationSortableItemProps> = ({ formElement, isPreview }) => {
  let content = null;
  if (isQuestion(formElement)) content = <CreationQuestionWrapper isPreview={isPreview} question={formElement} />;
  if (isSection(formElement)) content = <CreationSectionWrapper isPreview={isPreview} section={formElement} />;

  return <Box sx={{ opacity: isPreview ? 0.5 : 1 }}>{content}</Box>;
};
