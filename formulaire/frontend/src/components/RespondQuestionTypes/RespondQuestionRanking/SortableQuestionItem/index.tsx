import { Box, IconButton, Typography } from "@cgi-learning-hub/ui";
import { useSortable } from "@dnd-kit/sortable";
import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import { FC, useMemo } from "react";

import { getTransformStyle } from "~/components/CreationSortableItem/utils";

import { buttonsBoxStyle, buttonStyle, GrapableBox, grapableBoxStyle, leftBoxStyle, SortableQuestionPaper } from "./style";
import { ISortableQuestionItemProps } from "./types";

export const SortableItem: FC<ISortableQuestionItemProps> = ({
  id,
  label,
  handleMoveQuestion,
  isFirst,
  isLast,
  isPreview,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: id?.toString() ?? "0",
    animateLayoutChanges: () => true,
  });

  const style = useMemo(() => getTransformStyle(transform, transition), [transform, transition]);

  if (!id) return null;

  return (
    <SortableQuestionPaper
      ref={setNodeRef}
      elevation={2}
      sx={grapableBoxStyle(isPreview)}
      style={style}
      {...listeners}
      {...attributes}
    >
      <Box sx={leftBoxStyle}>
        <DragIndicatorRoundedIcon />
        <Typography variant="body1">{label}</Typography>
      </Box>
      <Box
        sx={buttonsBoxStyle}
        onPointerDown={(e) => {
          e.stopPropagation();
        }}
      >
        {!isFirst && (
          <IconButton
            sx={{ marginRight: isLast ? "4.6rem" : "0" }}
            onClick={() => {
              handleMoveQuestion?.(id, true);
            }}
          >
            <KeyboardArrowUpRoundedIcon sx={buttonStyle} />
          </IconButton>
        )}
        {!isLast && (
          <IconButton
            onClick={() => {
              handleMoveQuestion?.(id, false);
            }}
          >
            <KeyboardArrowDownRoundedIcon sx={buttonStyle} />
          </IconButton>
        )}
      </Box>
    </SortableQuestionPaper>
  );
};
