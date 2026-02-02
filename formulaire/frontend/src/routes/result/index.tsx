import { FC } from "react";

import { ResultProvider } from "~/providers/ResultProvider";

export const Result: FC = () => {
  return (
    <ResultProvider>
        page result
    </ResultProvider>
  );
};
