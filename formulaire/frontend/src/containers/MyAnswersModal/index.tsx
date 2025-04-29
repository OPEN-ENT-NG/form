import { FC } from "react";
import { IModalProps } from "~/core/types";
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Button, IconButton } from "@cgi-learning-hub/ui";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { BoxComponentType, ComponentVariant, TypographyFont, TypographyVariant } from "~/core/style/themeProps";
import { useHome } from "~/providers/HomeProvider";
import { IDistribution } from "~/core/models/distribution/types";
import { getFormDistributions } from "~/core/models/form/utils";
import { useFormatDateWithTime } from "~/hook/useFormatDateWithTime";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { SECONDARY_MAIN_COLOR } from "~/core/style/colors";
import { getRecapFormPath } from "~/core/pathHelper";
import { DistributionStatus } from "~/core/models/distribution/enums";

export const MyAnswersModal: FC<IModalProps> = ({ isOpen, handleClose }) => {
  const { t } = useTranslation(FORMULAIRE);
  const { selectedSentForm, distributions } = useHome();
  const formatDateWithTime = useFormatDateWithTime();
  if (!selectedSentForm) return;
  const formDistributions: IDistribution[] = getFormDistributions(selectedSentForm, distributions);

  return (
    <Dialog open={isOpen} onClose={handleClose} fullWidth>
      <DialogTitle variant={TypographyVariant.H2} fontWeight={TypographyFont.BOLD}>
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
                  <IconButton
                    sx={{ color: SECONDARY_MAIN_COLOR }}
                    onClick={() => {
                      window.location.href = getRecapFormPath(distribution.formId, distribution.id);
                    }}
                  >
                    <VisibilityIcon />
                  </IconButton>
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
    </Dialog>
  );
};
