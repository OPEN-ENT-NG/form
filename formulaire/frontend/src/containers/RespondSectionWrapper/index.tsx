import { FC } from "react";
import { IRespondSectionWrapperProps } from "./types";
import { Box, Paper, Stack, Typography } from "@cgi-learning-hub/ui";
import { COMMON_WHITE_COLOR } from "~/core/style/colors";
import { RespondQuestionWrapper } from "../RespondQuestionWrapper";
import { Editor } from "@edifice.io/react/editor";
import { EditorMode, EditorVariant } from "~/core/enums";
import { descriptionStyle, sectionContentStyle } from "~/components/CreationSection/style";
import { sectionHeaderWrapperStyle, sectionStackStyle } from "./style";

export const RespondSectionWrapper: FC<IRespondSectionWrapperProps> = ({ section }) => {
  return (
    <Stack component={Paper} sx={sectionStackStyle}>
      <Box sx={sectionHeaderWrapperStyle}>
        <Typography color={COMMON_WHITE_COLOR}>{section.title}</Typography>
      </Box>
      <Box sx={sectionContentStyle}>
        <Box sx={descriptionStyle}>
          <Editor content={section.description} mode={EditorMode.READ} variant={EditorVariant.GHOST} />
        </Box>
        <Stack>
          {section.questions.map((question) => {
            return <RespondQuestionWrapper key={question.id} question={question} />;
          })}
        </Stack>
      </Box>
    </Stack>
  );
};
