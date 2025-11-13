import { FC, useCallback } from "react";
import { EllipsisWithTooltip, FormControl, MenuItem, Select } from "@cgi-learning-hub/ui";
import { ICreationQuestionChoiceConditionalProps } from "./types";
import { ComponentVariant } from "~/core/style/themeProps";
import { nextElementSelectorStyle } from "../CreationSection/style";
import { useTranslation } from "react-i18next";
import { FORMULAIRE, TARGET_RECAP } from "~/core/constants";
import { useTargetNextElement } from "~/hook/targetNextElement/useTargetNextElement";
import { FormElementType } from "~/core/models/formElement/enum";
import { IQuestionChoice } from "~/core/models/question/types";
import { nextElementSelectorWrapperStyle } from "./style";
import { useCreation } from "~/providers/CreationProvider";
import { isCurrentEditingElement } from "~/providers/CreationProvider/utils";

export const CreationQuestionChoiceConditional: FC<ICreationQuestionChoiceConditionalProps> = ({
  question,
  choice,
  choiceIndex,
  updateChoiceNextFormElement,
}) => {
  const { t } = useTranslation(FORMULAIRE);
  const { currentEditingElement } = useCreation();

  const onSaveChoiceNextElement = useCallback(
    (_: IQuestionChoice, targetElementId: number | undefined, targetElementType: FormElementType | undefined) => {
      if (updateChoiceNextFormElement && choiceIndex !== undefined)
        updateChoiceNextFormElement(choiceIndex, targetElementId, targetElementType);
    },
    [choiceIndex, updateChoiceNextFormElement],
  );

  const {
    targetNextElementId,
    followingElement,
    elementsTwoPositionsAheadList,
    onChange: handleNextFormElementChange,
  } = useTargetNextElement({ entity: choice, positionReferenceElement: question, onSave: onSaveChoiceNextElement });

  return (
    <FormControl fullWidth sx={{ paddingLeft: "3rem" }}>
      <Select
        variant={ComponentVariant.OUTLINED}
        value={targetNextElementId != null ? String(targetNextElementId) : TARGET_RECAP}
        onChange={handleNextFormElementChange}
        displayEmpty
        MenuProps={{
          PaperProps: {
            sx: nextElementSelectorStyle,
          },
        }}
        sx={nextElementSelectorWrapperStyle}
        disabled={!isCurrentEditingElement(question, currentEditingElement)}
      >
        {followingElement && (
          <MenuItem value={followingElement.id != null ? String(followingElement.id) : ""}>
            <EllipsisWithTooltip>{t("formulaire.access.next")}</EllipsisWithTooltip>
          </MenuItem>
        )}

        {elementsTwoPositionsAheadList.map((el) => (
          <MenuItem key={el.id} value={el.id != null ? String(el.id) : ""}>
            <EllipsisWithTooltip> {t("formulaire.access.element") + (el.title ?? "")}</EllipsisWithTooltip>
          </MenuItem>
        ))}

        <MenuItem value={TARGET_RECAP}>
          <EllipsisWithTooltip> {t("formulaire.access.recap")}</EllipsisWithTooltip>
        </MenuItem>
      </Select>
    </FormControl>
  );
};
