import { Box } from "@cgi-learning-hub/ui";
import { CreationSection } from "~/components/CreationSection";
import { ICreationSectionWrapperProps } from "./types";
import { FC } from "react";
import { CreationEditingSection } from "~/components/CreationEditingSection";
import { isCurrentEditingElement } from "~/providers/CreationProvider/utils";
import { useCreation } from "~/providers/CreationProvider";

export const CreationSectionWrapper: FC<ICreationSectionWrapperProps> = ({ section }) => {
  const { currentEditingElement } = useCreation();
  const isEditing = isCurrentEditingElement(section, currentEditingElement);

  return <Box>{isEditing ? <CreationEditingSection section={section} /> : <CreationSection section={section} />}</Box>;
};
