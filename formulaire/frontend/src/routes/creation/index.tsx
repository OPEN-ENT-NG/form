import { Box } from "@mui/material";
import { FC } from "react";
import { useParams } from "react-router-dom";
import { CreationView } from "~/containers/CreationView";
import { CreationProvider } from "~/providers/CreationProvider";

export const Creation: FC = () => {
  const { formId } = useParams();
  return (
    <CreationProvider>
      <Box>{formId}</Box>
      <CreationView />
    </CreationProvider>
  );
};
