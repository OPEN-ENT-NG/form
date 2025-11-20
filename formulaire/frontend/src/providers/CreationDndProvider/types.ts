import { DragMoveEvent, DragStartEvent, SensorDescriptor, SensorOptions } from "@dnd-kit/core";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { IFormElement } from "~/core/models/formElement/types";

export interface ICreationDndProviderProps {
  children: ReactNode;
}

export type CreationDndProviderContextType = {
  sensors: SensorDescriptor<SensorOptions>[];
  activeItem: IFormElement | null;
  setActiveItem: Dispatch<SetStateAction<IFormElement | null>>;
  handleDragStart: ({ active }: DragStartEvent) => void;
  handleDragOver: ({ over }: DragMoveEvent) => void;
};
