import { SxProps } from "@cgi-learning-hub/ui";

export const sentFormWrapperStyle: SxProps = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(min(30rem, 100%), 1fr))",
  gap: "1.6rem",
  width: "100%",
  maxWidth: "100rem",
};

export const sentFormWrapperMobileStyle: SxProps = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(30rem, 100%), 1fr))",
  gap: "1.6rem",
  width: "100%",
};
