import { Step, StepLabel, Stepper } from "@cgi-learning-hub/ui";
import CircleRoundedIcon from "@mui/icons-material/CircleRounded";
import { FC } from "react";

import { GREY_MAIN_COLOR, PRIMARY_LIGHT_COLOR, PRIMARY_MAIN_COLOR } from "~/core/style/colors";

import { IProgressBarProps } from "./types";

export const ProgressBar: FC<IProgressBarProps> = ({ nbActiveSteps, nbRemainingSteps }) => {
  const steps = Array.from({ length: nbActiveSteps + nbRemainingSteps });

  const SafeCircleRoundedIcon = (props) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unused-vars
    const { active, completed, error, icon, disabled, ...rest } = props;
    return <CircleRoundedIcon {...rest} />;
  };

  return (
    <Stepper alternativeLabel activeStep={nbActiveSteps - 1}>
      {steps.map((step, index) => (
        <Step key={index}>
          <StepLabel
            slots={{ stepIcon: SafeCircleRoundedIcon }} // avoid CircleIcon with checked symbol inside
            slotProps={{ stepIcon: { sx: { color: "inherit" } } }}
            sx={{
              color: GREY_MAIN_COLOR, // color when step not completed neither active
              ">.Mui-completed": { color: PRIMARY_MAIN_COLOR }, // color when step is completed
              ">.Mui-active": { color: PRIMARY_LIGHT_COLOR }, // color when step is active
              ".MuiStepIcon-text ": { display: "none" }, // we hide the text inside
            }}
          ></StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};
