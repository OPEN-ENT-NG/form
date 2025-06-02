import type { FC } from "react";
import { CustomSVGProps } from "../types";

export const LongAnswerIcon: FC<CustomSVGProps> = ({ height = "100%" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    fill="#5b6472"
    width={height}
    height={height}
    viewBox="0 0 24 24"
  >
    <path d="M4,5H20V7H4V5M4,9H20V11H4V9M4,13H20V15H4V13M4,17H14V19H4V17Z" />
  </svg>
);
