export interface IDroppableTreeItemProps {
  treeItemId: number;
  treeRootRect?: DOMRect;
}

export interface IStyledDroppableTreeItemProps {
  rect: DOMRect;
  isOverDroppable: boolean;
}
