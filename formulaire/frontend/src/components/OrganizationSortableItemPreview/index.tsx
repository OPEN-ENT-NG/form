import { FC } from "react";
import { Box, EllipsisWithTooltip } from "@cgi-learning-hub/ui";
import { IOrganizationSortableItemPreviewProps } from "./types";
import { useCreation } from "~/providers/CreationProvider";
import { isFormElementSection } from "~/core/models/section/utils";
import { getUpDownButtons } from "../OrganizationSortableItem/utils";
import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded";
import {
  dragIconStyle,
  OrganizationStyledPaper,
  paperContentStyle,
  typographyStyle,
} from "../OrganizationSortableItem/style";
import { TypographyVariant } from "~/core/style/themeProps";
import { DRAG_HORIZONTAL_TRESHOLD } from "~/core/constants";

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
    <OrganizationStyledPaper elevation={2} isSection={isSection} depth={depth * DRAG_HORIZONTAL_TRESHOLD} isPreview>
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
          {formElement.title}
        </EllipsisWithTooltip>
      </Box>
      <Box>{getUpDownButtons(formElement, formElementsList, handleReorderClick)}</Box>
    </OrganizationStyledPaper>
  );
};
