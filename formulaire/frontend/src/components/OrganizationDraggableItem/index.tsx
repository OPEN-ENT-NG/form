import { FC } from "react";
import { Typography, Box } from "@cgi-learning-hub/ui";
import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded";
import { isFormElementSection } from "~/core/models/section/utils";
import { IFormElementRowProps } from "./types";
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

export const OrganizationDraggableItem: FC<IFormElementRowProps> = ({ element, indent = 0 }) => {
  const { formElementsList, setFormElementsList } = useCreation();
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
    <Box sx={{ marginLeft: indent }}>
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
