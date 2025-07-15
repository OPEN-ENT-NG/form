import { FC } from "react";
import { Box, EllipsisWithTooltip } from "@cgi-learning-hub/ui";
import { IOrganizationSortableItemPreviewProps } from "./types";
import { useCreation } from "~/providers/CreationProvider";
import { isFormElementSection } from "~/core/models/section/utils";
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

export const OrganizationSortableItemPreview: FC<IOrganizationSortableItemPreviewProps> = ({
  formElement,
  depth = 0,
}) => {
  const { formElementsList } = useCreation();
  const isSection = isFormElementSection(formElement);

  return (
    <OrganizationStyledPaper elevation={2} isSection={isSection} depth={depth * DRAG_HORIZONTAL_TRESHOLD} isPreview>
      <Box sx={paperContentStyle}>
        <Box>
          <DragIndicatorRoundedIcon sx={iconStyle} />
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

      <OrganizationUpDownButtons element={formElement} formElementsList={formElementsList} />
    </OrganizationStyledPaper>
  );
};
