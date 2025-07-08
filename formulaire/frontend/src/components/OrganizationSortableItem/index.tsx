import { FC } from "react";
import { Typography, Box } from "@cgi-learning-hub/ui";
import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded";
import { isFormElementSection } from "~/core/models/section/utils";
import { IOrganizationSortableItemProps } from "./types";
import { dragIconStyle, StyledPaper } from "./style";
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
import { flattenFormElements } from "~/core/models/formElement/utils";

export const OrganizationSortableItem: FC<IOrganizationSortableItemProps> = ({ element, indent = 0 }) => {
  const { formElementsList, setFormElementsList } = useCreation();
  const { attributes, listeners, setNodeRef } = useSortable({
    id: element.id ? element.id : 0,
    data: { element: element },
  });
  if(element.id === 433) console.log(listeners, element.id);
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
    <Box ref={setNodeRef} sx={{ marginLeft: indent }} {...attributes} {...listeners}>
      <StyledPaper elevation={2} isSection={isSection}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box>
            <DragIndicatorRoundedIcon sx={dragIconStyle} />
          </Box>
          <Box>
            <Typography variant={TypographyVariant.BODY2}>{element.title}</Typography>
          </Box>
        </Box>
        <Box>{getUpDownButtons(element, formElementsList, handleReorderClick)}</Box>
      </StyledPaper>
    </Box>
  );
};

interface IOrganizationSortableItemDisplayProps {
  activeId: number;
  indent?: number;
}

export const OrganizationSortableItemDisplay: FC<IOrganizationSortableItemDisplayProps> = ({
  activeId,
  indent = 0,
}) => {
  const { formElementsList, setFormElementsList } = useCreation();
  const element = flattenFormElements(formElementsList).find((el) => el.id === activeId);
  if (!element) return null;
  const isSection = isFormElementSection(element);

  const handleReorderClick = (element: IFormElement, formElementList: IFormElement[], direction: Direction) => {
    return;
  };

  return (
    <Box sx={{ marginLeft: indent, opacity: 0.7 }}>
      <StyledPaper elevation={2} isSection={isSection}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box>
            <DragIndicatorRoundedIcon sx={dragIconStyle} />
          </Box>
          <Box>
            <Typography variant={TypographyVariant.BODY2}>{element.title}</Typography>
          </Box>
        </Box>
        <Box>{getUpDownButtons(element, formElementsList, handleReorderClick)}</Box>
      </StyledPaper>
    </Box>
  );
};
