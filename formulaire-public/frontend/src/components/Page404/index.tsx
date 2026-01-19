import { useRouteError } from "react-router-dom";
import { Box, Typography } from "@cgi-learning-hub/ui";

export default function Page404() {
  const error = useRouteError() as { message: string };
  console.error("an error has occured: " + error.message);

  //TODO
  return (
    <Box>
      <Typography>404</Typography>
    </Box>
  );
}
