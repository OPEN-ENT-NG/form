import { FC } from "react";
import { Typography, Box } from "@cgi-learning-hub/ui";
import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded";
import { isFormElementSection } from "~/core/models/section/utils";
import { IFormElementRowProps } from "./types";
import { dragIconStyle, StyledPaper } from "./style";
import { TypographyVariant } from "~/core/style/themeProps";
import { useCreation } from "~/providers/CreationProvider";
import { IQuestion } from "~/core/models/question/types";
import { ISection } from "~/core/models/section/types";

export const OrganizationDraggableItem: FC<IFormElementRowProps> = ({ element, indent = 0 }) => {
  const { formElementsList } = useCreation();
  const isSection = isFormElementSection(element);

  const getUpDownButtons = () => {
    const buttons = [];
    console.log("isSection", isSection, element.position, formElementsList.length);
    if (element.position) {
      if (element.position > 1) {
        buttons.push(
          <Box key="up" sx={{ marginRight: 1 }}>
            <Typography>UP</Typography>
          </Box>,
        );
      }
      if (element.position < formElementsList.length) {
        buttons.push(
          <Box key="down">
            <Typography>DOWN</Typography>
          </Box>,
        );
      }
    }
    if (!isSection) {
      const question = element as IQuestion;
      if (question.sectionPosition) {
        buttons.push(
          <Box key="down">
            <Typography>UP</Typography>
          </Box>,
        );
        buttons.push(
          <Box key="down">
            <Typography>DOWN</Typography>
          </Box>,
        );
      }
    }

    return <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>{buttons}</Box>;
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
        <Box>{getUpDownButtons()}</Box>
      </StyledPaper>
    </Box>
  );
};
