import { Box, Button, DialogActions, DialogContent, DialogTitle, Typography } from "@cgi-learning-hub/ui";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { CreationSortableItem } from "~/components/CreationSortableItem";
import { ResponsiveDialog } from "~/components/ResponsiveDialog";
import { FORMULAIRE } from "~/core/constants";
import { TEXT_PRIMARY_COLOR } from "~/core/style/colors";
import { BreakpointVariant, TypographyFontStyle, TypographyVariant } from "~/core/style/themeProps";
import { isEnterPressed } from "~/core/utils";
import { useCreation } from "~/providers/CreationProvider";
import { useGlobal } from "~/providers/GlobalProvider";

import { ITreeEditDialogProps } from "./types";

export const TreeEditDialog: FC<ITreeEditDialogProps> = ({ onClose, onSave, onNavigateToQuestion }) => {
  const { t } = useTranslation(FORMULAIRE);
  const { currentEditingElement } = useCreation();
  const {
    displayModals: { showTreeFormUpdate },
  } = useGlobal();

  return (
    <ResponsiveDialog
      open={currentEditingElement !== null && showTreeFormUpdate}
      onClose={onClose}
      maxWidth={BreakpointVariant.MD}
      fullWidth
      onKeyDown={(e) => {
        if (isEnterPressed(e) && !e.shiftKey) {
          e.preventDefault();
          onSave();
        }
      }}
    >
      <DialogTitle color={TEXT_PRIMARY_COLOR} variant={TypographyVariant.H2} fontWeight={TypographyFontStyle.BOLD}>
        {t("formulaire.form.edit.question")}
      </DialogTitle>
      <DialogContent>
        {currentEditingElement && showTreeFormUpdate && (
          <CreationSortableItem key={currentEditingElement.id} formElement={currentEditingElement} isPreview={false} />
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between" }}>
        <Button onClick={onNavigateToQuestion} variant="text">
          <Typography color="secondary">{t("formulaire.form.edit.redirection")}</Typography>
        </Button>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button onClick={onClose}>{t("formulaire.cancel")}</Button>
          <Button variant="contained" onClick={onSave}>
            {t("formulaire.save")}
          </Button>
        </Box>
      </DialogActions>
    </ResponsiveDialog>
  );
};
