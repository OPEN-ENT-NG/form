import { ReactNode } from "react";

import { ISection } from "~/core/models/section/types";

export interface SectionResultLayoutProps {
  section: ISection;
  children: ReactNode;
}
