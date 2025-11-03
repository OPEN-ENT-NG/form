import { FC } from "react";
import { IModalProps } from "~/core/types";
import { Box, DialogActions, DialogContent, DialogTitle, Button } from "@cgi-learning-hub/ui";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { BoxComponentType, ComponentVariant, TypographyFontStyle, TypographyVariant } from "~/core/style/themeProps";
import { useHome } from "~/providers/HomeProvider";
import { IDistribution } from "~/core/models/distribution/types";
import { getFormDistributions } from "~/core/models/form/utils";
import { useFormatDateWithTime } from "~/hook/useFormatDateWithTime";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { SECONDARY_MAIN_COLOR, TEXT_PRIMARY_COLOR } from "~/core/style/colors";
import { getHrefRecapFormPath } from "~/core/pathHelper";
import { DistributionStatus } from "~/core/models/distribution/enums";
import { ResponsiveDialog } from "~/components/ResponsiveDialog";
import { IconButtonTooltiped } from "~/components/IconButtonTooltiped/IconButtonTooltiped";

export const MyAnswersModal: FC<IModalProps> = ({ isOpen, handleClose }) => {
  const { t } = useTranslation(FORMULAIRE);
  const { selectedSentForm, distributions } = useHome();
  const formatDateWithTime = useFormatDateWithTime();
  if (!selectedSentForm) return;
  const formDistributions: IDistribution[] = getFormDistributions(selectedSentForm, distributions);

  return (
    <ResponsiveDialog open={isOpen} onClose={handleClose} fullWidth>
      <DialogTitle color={TEXT_PRIMARY_COLOR} variant={TypographyVariant.H2} fontWeight={TypographyFontStyle.BOLD}>
        {t("formulaire.myResponses") + " - " + selectedSentForm.title}
      </DialogTitle>
      <DialogContent>
        <Box component={BoxComponentType.OL}>
          {formDistributions
            .filter((distribution: IDistribution) => distribution.status === DistributionStatus.FINISHED)
            .map((distribution: IDistribution) => (
              <Box component={BoxComponentType.LI} key={distribution.id}>
                <Box display="flex" alignItems="center">
                  <Box>{formatDateWithTime(distribution.dateSending, "formulaire.responded.date")}</Box>
                  <IconButtonTooltiped
                    key={distribution.id}
                    icon={<VisibilityIcon />}
                    onClick={() => {
                      window.location.href = getHrefRecapFormPath(distribution.formId, distribution.id);
                    }}
                    tooltipI18nKey={"formulaire.response.open"}
                    ariaLabel="edit"
                    arrow
                    slotProps={{ iconButton: { color: SECONDARY_MAIN_COLOR } }}
                  />
                </Box>
              </Box>
            ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant={ComponentVariant.OUTLINED} onClick={handleClose}>
          {t("formulaire.cancel")}
        </Button>
      </DialogActions>
    </ResponsiveDialog>
  );
};
