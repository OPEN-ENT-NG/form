import { Dialog, DialogProps } from "@cgi-learning-hub/ui";
import { FC, useMemo } from "react";

import { useGlobal } from "~/providers/GlobalProvider";

export const ResponsiveDialog: FC<DialogProps> = ({ slotProps, children, ...props }) => {
  const { isMobile } = useGlobal();

  const mobileSlotProps = useMemo(
    () => ({
      paper: {
        sx: { margin: "1rem", width: "calc(100% - 2rem)" },
      },
    }),
    [],
  );

  const dialogSlotProps = isMobile ? mobileSlotProps : slotProps;

  return (
    <Dialog {...props} slotProps={dialogSlotProps}>
      {children}
    </Dialog>
  );
};
