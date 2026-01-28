import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

import { ISection } from "~/core/models/section/types";

export interface ICreationSectionProps {
  section: ISection;
  isPreview?: boolean;
  listeners: SyntheticListenerMap | undefined;
  attributes: DraggableAttributes | undefined;
}
