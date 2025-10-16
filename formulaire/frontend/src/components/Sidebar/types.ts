import { ReactNode } from "react";

export interface ISidebarProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}
