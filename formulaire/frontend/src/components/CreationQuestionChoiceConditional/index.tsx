import { EllipsisWithTooltip, FormControl, MenuItem, Select } from "@cgi-learning-hub/ui";
import { FC, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FORMULAIRE, TARGET_RECAP } from "~/core/constants";
import { FormElementType } from "~/core/models/formElement/enum";
import { IQuestionChoice } from "~/core/models/question/types";
import { getParent } from "~/core/models/question/utils";
import { ComponentVariant } from "~/core/style/themeProps";
import { updateNextTargetElements } from "~/hook/dnd-hooks/useCreationDnd/utils";
import { useTargetNextElement } from "~/hook/targetNextElement/useTargetNextElement";
import { useCreation } from "~/providers/CreationProvider";
import { isCurrentEditingElement, preventPropagation } from "~/providers/CreationProvider/utils";
import { nextElementSelectorStyle } from "../CreationSection/style";
import { nextElementSelectorWrapperStyle } from "./style";
import { ICreationQuestionChoiceConditionalProps } from "./types";

export const CreationQuestionChoiceConditional: FC<ICreationQuestionChoiceConditionalProps> = ({
  question,
  choice,
  choiceIndex,
  updateChoiceNextFormElement,
}) => {
  const { t } = useTranslation(FORMULAIRE);
  const { currentEditingElement, formElementsList, updateFormElementsList } = useCreation();

  const onSaveChoiceNextElement = useCallback(
    (_: IQuestionChoice, targetElementId: number | undefined, targetElementType: FormElementType | undefined) => {
      if (updateChoiceNextFormElement && choiceIndex !== undefined) {
        updateChoiceNextFormElement(choiceIndex, targetElementId, targetElementType);
      }
    },
    [choiceIndex, updateChoiceNextFormElement],
  );

  const [isUpdatingNextTarget, setIsUpdatingNextTarget] = useState(false);

  const {
    followingElement,
    elementsTwoPositionsAheadList,
    onChange: handleNextFormElementChange,
  } = useTargetNextElement({
    entity: choice,
    positionReferenceElement: getParent(question, formElementsList) || question,
    onSave: onSaveChoiceNextElement,
  });

  useEffect(() => {
    if (
      !question.isNew &&
      followingElement &&
      !followingElement.isNew &&
      followingElement.position === formElementsList.length &&
      question.choices?.find((choice) => choice.isNextFormElementDefault && !choice.nextFormElementId)
    ) {
      if (!isUpdatingNextTarget) {
        setIsUpdatingNextTarget(true);
        void updateFormElementsList(updateNextTargetElements(formElementsList));
      }
    } else {
      setIsUpdatingNextTarget(false);
    }
  }, [followingElement, formElementsList]);

  return (
    <FormControl fullWidth sx={{ paddingLeft: "3rem" }}>
      <Select
        variant={ComponentVariant.OUTLINED}
        value={choice.nextFormElementId != null && followingElement ? String(choice.nextFormElementId) : TARGET_RECAP}
        onChange={handleNextFormElementChange}
        onClick={(e) => {
          if (isCurrentEditingElement(question, currentEditingElement)) {
            preventPropagation(e);
          }
        }}
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
