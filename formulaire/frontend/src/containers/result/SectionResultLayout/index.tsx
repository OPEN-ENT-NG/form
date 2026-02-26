import { Stack, Typography } from "@cgi-learning-hub/ui";
import { FC } from "react";

import { getDescription, isDescriptionEmpty } from "~/components/CreationSection/utils";
import { COMMON_WHITE_COLOR, TEXT_SECONDARY_COLOR } from "~/core/style/colors";
import { t } from "~/i18n";

import { sectionContentStyle, sectionTitleStyle } from "./style";
import { SectionResultLayoutProps } from "./types";

export const SectionResultLayout: FC<SectionResultLayoutProps> = ({ section, children }) => {
  return (
    <Stack width="100%" overflow="hidden">
      <Typography sx={sectionTitleStyle} color={COMMON_WHITE_COLOR}>
        {section.title}
      </Typography>
      <Stack sx={sectionContentStyle}>
        {isDescriptionEmpty(section) ? (
          <Typography color={TEXT_SECONDARY_COLOR} fontStyle="italic">
            {" "}
            {t("formulaire.section.no.description")}
          </Typography>
        ) : (
          <Typography dangerouslySetInnerHTML={{ __html: getDescription(section) || "" }} />
        )}
        {children}
      </Stack>
    </Stack>
  );
};
