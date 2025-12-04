import { FC } from "react";
import { Box, EllipsisWithTooltip } from "@cgi-learning-hub/ui";
import { IOrganizationSortableItemPreviewProps } from "./types";
import { useCreation } from "~/providers/CreationProvider";
import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded";
import {
  iconStyle,
  OrganizationStyledPaper,
  paperContentStyle,
  typographyStyle,
} from "../OrganizationSortableItem/style";
import { TypographyVariant } from "~/core/style/themeProps";
import { DRAG_HORIZONTAL_TRESHOLD } from "~/core/constants";
import { OrganizationUpDownButtons } from "../OrganizationUpDownButtons";
import { isSection } from "~/core/models/formElement/utils";

export const OrganizationSortableItemPreview: FC<IOrganizationSortableItemPreviewProps> = ({
  formElement,
  depth = 0,
}) => {
  const { formElementsList } = useCreation();
  const isElementSection = isSection(formElement);

  return (
    <OrganizationStyledPaper
      elevation={2}
      isSection={isElementSection}
      depth={depth * DRAG_HORIZONTAL_TRESHOLD}
      isPreview
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
          {formElement.title}
        </EllipsisWithTooltip>
      </Box>

      <OrganizationUpDownButtons element={formElement} formElementsList={formElementsList} />
    </OrganizationStyledPaper>
  );
};
