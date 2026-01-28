import { Box, EllipsisWithTooltip } from "@cgi-learning-hub/ui";
import { useSortable } from "@dnd-kit/sortable";
import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded";
import { FC, useCallback, useMemo } from "react";

import { DRAG_HORIZONTAL_TRESHOLD } from "~/core/constants";
import { IFormElement } from "~/core/models/formElement/types";
import { isSection } from "~/core/models/formElement/utils";
import { IQuestion } from "~/core/models/question/types";
import { TypographyVariant } from "~/core/style/themeProps";
import { useCreation } from "~/providers/CreationProvider";

import { OrganizationUpDownButtons } from "../OrganizationUpDownButtons";
import { Direction } from "./enum";
import { iconStyle, OrganizationStyledPaper, paperContentStyle, typographyStyle } from "./style";
import { IOrganizationSortableItemProps } from "./types";
import {
  getTransformStyle,
  handleSubMoveDown,
  handleSubMoveUp,
  handleTopMoveDown,
  handleTopMoveUp,
  isSubElement,
  isTopElement,
} from "./utils";

export const OrganizationSortableItem: FC<IOrganizationSortableItemProps> = ({ element, depth = 0 }) => {
  const { formElementsList, setFormElementsList } = useCreation();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: element.id ?? 0,
    data: { element: element },
  });

  const isElementSection = isSection(element);

  const handleReorderClick = useCallback(
    (element: IFormElement, formElementList: IFormElement[], direction: Direction) => {
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
    },
    [setFormElementsList],
  );

  const style = useMemo(() => getTransformStyle(transform, transition), [transform, transition]);

  return (
    <OrganizationStyledPaper
      ref={setNodeRef}
      elevation={2}
      isSection={isElementSection}
      depth={depth * DRAG_HORIZONTAL_TRESHOLD}
      {...attributes}
      {...listeners}
      style={style}
    >
      <Box sx={paperContentStyle}>
        <Box>
          <DragIndicatorRoundedIcon sx={iconStyle} />
        </Box>
        <EllipsisWithTooltip
          slotProps={{
            text: {
              variant: TypographyVariant.BODY2,
              sx: typographyStyle,
            },
          }}
        >
          {element.title}
        </EllipsisWithTooltip>
      </Box>
      <OrganizationUpDownButtons
        element={element}
        formElementsList={formElementsList}
        handleReorderClick={handleReorderClick}
      />
    </OrganizationStyledPaper>
  );
};
