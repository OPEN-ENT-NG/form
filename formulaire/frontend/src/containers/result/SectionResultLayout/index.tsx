import { Stack, Typography } from "@cgi-learning-hub/ui";
import { FC } from "react";

import { getDescription } from "~/components/CreationSection/utils";
import { COMMON_WHITE_COLOR, TEXT_SECONDARY_COLOR } from "~/core/style/colors";

import { sectionContentStyle, sectionTitleStyle } from "./style";
import { SectionResultLayoutProps } from "./types";

export const SectionResultLayout: FC<SectionResultLayoutProps> = ({ section, children }) => {
  return (
    <Stack width="100%" overflow="hidden">
      <Typography sx={sectionTitleStyle} color={COMMON_WHITE_COLOR}>
        {section.title}
      </Typography>
      <Stack sx={sectionContentStyle}>
        <Typography color={TEXT_SECONDARY_COLOR} fontStyle="italic">
          {getDescription(section)}
        </Typography>
        {children}
      </Stack>
    </Stack>
  );
};
