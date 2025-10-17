import { Box, Drawer, IconButton } from "@cgi-learning-hub/ui";
import CloseIcon from "@mui/icons-material/Close";
import React, { FC, useEffect, useRef } from "react";

import { sidebarStyle } from "./style";
import { ISidebarProps } from "./types";
import { KeyName } from "~/core/enums";

export const Sidebar: FC<ISidebarProps> = ({ isOpen, onClose, children }) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Accessibility
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [open]);

  const sidebarHandleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === KeyName.ESCAPE.toString()) {
      onClose();
    }
  };

  return (
    <Drawer anchor="left" open={isOpen} onClose={onClose} onKeyDown={sidebarHandleKeyDown}>
      <Box sx={sidebarStyle} component="nav">
        <Box>
          <IconButton onClick={onClose} ref={closeButtonRef}>
            <CloseIcon />
          </IconButton>
        </Box>
        {children}
      </Box>
    </Drawer>
  );
};
