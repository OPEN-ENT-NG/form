import { FC } from "react";
import { Step, StepLabel, Stepper } from "@cgi-learning-hub/ui";
import { IProgressBarProps } from "./types";
import CircleRoundedIcon from "@mui/icons-material/CircleRounded";
import { GREY_MAIN_COLOR, PRIMARY_LIGHT_COLOR, PRIMARY_MAIN_COLOR } from "~/core/style/colors";

export const ProgressBar: FC<IProgressBarProps> = ({ nbActiveSteps, nbRemainingSteps }) => {
  const steps = Array.from({ length: nbActiveSteps + nbRemainingSteps });

  return (
    <Stepper alternativeLabel activeStep={nbActiveSteps - 1}>
      {steps.map((step, index) => (
        <Step key={index}>
          <StepLabel
            slots={{ stepIcon: CircleRoundedIcon }} // avoid CircleIcon with checked symbol inside
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
