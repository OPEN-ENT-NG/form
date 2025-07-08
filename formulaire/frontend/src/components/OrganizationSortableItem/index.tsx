import { FC } from "react";
import { Box, EllipsisWithTooltip } from "@cgi-learning-hub/ui";
import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded";
import { isFormElementSection } from "~/core/models/section/utils";
import { IOrganizationSortableItemProps } from "./types";
import { dragIconStyle, OrganizationStyledPaper, paperContentStyle, typographyStyle } from "./style";
import { TypographyVariant } from "~/core/style/themeProps";
import { useCreation } from "~/providers/CreationProvider";
import {
  getUpDownButtons,
  handleSubMoveDown,
  handleSubMoveUp,
  handleTopMoveDown,
  handleTopMoveUp,
  isSubElement,
  isTopElement,
} from "./utils";
import { IFormElement } from "~/core/models/formElement/types";
import { IQuestion } from "~/core/models/question/types";
import { Direction } from "./enum";
import { useSortable } from "@dnd-kit/sortable";
import { DRAG_HORIZONTAL_TRESHOLD } from "~/core/constants";

export const OrganizationSortableItem: FC<IOrganizationSortableItemProps> = ({ element, depth = 0 }) => {
  const { formElementsList, setFormElementsList } = useCreation();
  const { attributes, listeners, setNodeRef } = useSortable({
    id: element.id ? element.id : 0,
    data: { element: element },
  });

  const isSection = isFormElementSection(element);

  const handleReorderClick = (element: IFormElement, formElementList: IFormElement[], direction: Direction) => {
    if (isTopElement(element)) {
      if (direction === Direction.DOWN) {
        setFormElementsList(handleTopMoveDown(element, formElementList));
        return;
      }
      setFormElementsList(handleTopMoveUp(element, formElementList));
      return;
    }
    if (isSubElement(element)) {
      if (direction === Direction.DOWN) {
        setFormElementsList(handleSubMoveDown(element as IQuestion, formElementList));
        return;
      }
      setFormElementsList(handleSubMoveUp(element as IQuestion, formElementList));
      return;
    }
    return;
  };

  return (
    <OrganizationStyledPaper
      ref={setNodeRef}
      elevation={2}
      isSection={isSection}
      depth={depth * DRAG_HORIZONTAL_TRESHOLD}
      {...attributes}
      {...listeners}
    >
      <Box sx={paperContentStyle}>
        <Box>
          <DragIndicatorRoundedIcon sx={dragIconStyle} />
        </Box>
        <EllipsisWithTooltip
          typographyProps={{
            variant: TypographyVariant.BODY2,
            sx: typographyStyle,
          }}
        >
          {element.title}
        </EllipsisWithTooltip>
      </Box>
      <Box>{getUpDownButtons(element, formElementsList, handleReorderClick)}</Box>
    </OrganizationStyledPaper>
  );
};
