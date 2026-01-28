import type { FC } from "react";

import { CustomSVGProps } from "../types";

export const CursorIcon: FC<CustomSVGProps> = () => (
  <svg width="3rem" height="3rem" viewBox="0 0 36 37" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="36" height="36" transform="translate(0 0.695129)" fill="white" />
    <g clipPath="url(#clip0_662_6611)">
      <path
        d="M5 18.6951C5 18.1428 5.44771 17.6951 6 17.6951H31C31.5523 17.6951 32 18.1428 32 18.6951C32 19.2474 31.5523 19.6951 31 19.6951H6C5.44771 19.6951 5 19.2474 5 18.6951Z"
        fill="#383D3E"
      />
      <path
        d="M21 18.6951C21 20.352 19.6569 21.6951 18 21.6951C16.3431 21.6951 15 20.352 15 18.6951C15 17.0383 16.3431 15.6951 18 15.6951C19.6569 15.6951 21 17.0383 21 18.6951Z"
        fill="#383D3E"
      />
    </g>
    <defs>
      <clipPath id="clip0_662_6611">
        <rect width="27" height="6" fill="white" transform="translate(5 15.6951)" />
      </clipPath>
    </defs>
  </svg>
);
