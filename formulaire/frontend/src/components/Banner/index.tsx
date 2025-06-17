import { Box, Typography } from "@cgi-learning-hub/ui";
import { FC } from "react";
import { IBannerProps } from "./types";
import { bannerStyle, iconStyle } from "./style";

export const Banner: FC<IBannerProps> = ({icon: Icon, text}) => {
  return (
    <Box sx={bannerStyle}>
        <Icon sx={iconStyle}></Icon>
        <Typography variant="body2">{text}</Typography>
    </Box>
  );
};