import { FC } from "react";
import { Typography, Box } from "@cgi-learning-hub/ui";
import { IOrganizationSortableItemPreviewProps } from "./types";
import { useCreation } from "~/providers/CreationProvider";
import { isFormElementSection } from "~/core/models/section/utils";
import { getUpDownButtons } from "../OrganizationSortableItem/utils";
import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded";
import { dragIconStyle, OrganizationStyledPaper, paperContentStyle } from "../OrganizationSortableItem/style";
import { TypographyVariant } from "~/core/style/themeProps";

export const OrganizationSortableItemPreview: FC<IOrganizationSortableItemPreviewProps> = ({
  formElement,
  depth = 0,
}) => {
  const { formElementsList } = useCreation();
  const isSection = isFormElementSection(formElement);

  const handleReorderClick = () => {
    return;
  };

  return (
    <OrganizationStyledPaper elevation={2} isSection={isSection} depth={depth} isPreview>
      <Box sx={paperContentStyle}>
        <Box>
          <DragIndicatorRoundedIcon sx={dragIconStyle} />
        </Box>
        <Box>
          <Typography variant={TypographyVariant.BODY2}>{formElement.title}</Typography>
        </Box>
      </Box>
      <Box>{getUpDownButtons(formElement, formElementsList, handleReorderClick)}</Box>
    </OrganizationStyledPaper>
  );
};
