import type { FC } from "react";

import { CustomSVGProps } from "../types";

export const FreeTextIcon: FC<CustomSVGProps> = ({ height = "100%" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    fill="#5b6472"
    width={height}
    height={height}
    viewBox="0 0 24 24"
  >
    <path d="M21,6V8H3V6H21M3,18H12V16H3V18M3,13H21V11H3V13Z" />
  </svg>
);
