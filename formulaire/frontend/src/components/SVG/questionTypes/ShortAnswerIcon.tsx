import type { FC } from "react";
import { CustomSVGProps } from "../types";

export const ShortAnswerIcon: FC<CustomSVGProps> = ({ height = "100%" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    fill="#5b6472"
    width={height}
    height={height}
    viewBox="0 0 24 24"
  >
    <path d="M4,9H20V11H4V9M4,13H14V15H4V13Z" />
  </svg>
);
