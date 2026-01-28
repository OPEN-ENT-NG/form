import { Box, Typography } from "@cgi-learning-hub/ui";
import { FC } from "react";

import { TypographyVariant } from "~/core/style/themeProps";

import { bannerStyle, iconStyle } from "./style";
import { IBannerProps } from "./types";

export const Banner: FC<IBannerProps> = ({ icon: Icon, text }) => {
  return (
    <Box sx={bannerStyle}>
      <Icon sx={iconStyle}></Icon>
      <Typography variant={TypographyVariant.BODY2}>{text}</Typography>
    </Box>
  );
};
