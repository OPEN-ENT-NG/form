import { Box, Button, Paper, Stack, TextField, Typography } from "@cgi-learning-hub/ui";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { IconButtonTooltiped } from "~/components/IconButtonTooltiped/IconButtonTooltiped";
import { ModalType, ResponsePageType, TagName } from "~/core/enums";
import { ICaptcha } from "~/core/models/captcha/types";
import { spaceBetweenBoxStyle } from "~/core/style/boxStyles";
import { COMMON_WHITE_COLOR } from "~/core/style/colors";
import { ComponentVariant, TypographyVariant } from "~/core/style/themeProps";
import { t } from "~/i18n";
import { useGlobal } from "~/providers/GlobalProvider";
import { useResponse } from "~/providers/ResponseProvider";
import { useGetCaptchaQuery } from "~/services/api/formulaireApi/captchaApi";
import { emptySplitFormulaireApi } from "~/services/api/formulaireApi/emptySplitFormulaireApi";

import { questionStackStyle } from "../RespondQuestionWrapper/style";
import {
  descriptionStyle,
  sectionContentStyle,
  sectionHeaderWrapperStyle,
  sectionStackStyle,
} from "../RespondSectionWrapper/style";
import { SendingConfirmationModal } from "../SendingConfirmationModal";

export const CaptchaLayout: FC = () => {
  const { form, setPageType } = useResponse();
  const {
    displayModals: { showSendingConfirmation },
    toggleModal,
  } = useGlobal();
  const dispatch = useDispatch();
  const [captcha, setCaptcha] = useState<ICaptcha>();
  const [distributionCaptchaId, setDistributionCaptchaId] = useState<number | undefined>(form?.distribution_captcha);

  // Fetch datas
  const { data: captchaData } = useGetCaptchaQuery(
    {
      distributionKey: form?.distribution_key ?? "",
      distributionCaptcha: distributionCaptchaId,
    },
    { skip: !form || !form.distribution_key },
  );

  useEffect(() => {
    if (!captchaData) return;
    setCaptcha(captchaData);
    sessionStorage.setItem("distributionCaptcha", JSON.stringify(captchaData.captchaId));
  }, [captchaData]);

  const goBackToRecap = () => {
    setPageType(ResponsePageType.RECAP);
  };

  const reloadCaptcha = () => {
    setDistributionCaptchaId(undefined);
    dispatch(emptySplitFormulaireApi.util.invalidateTags([TagName.CAPTCHA]));
  };

  const sendForm = () => {
    toggleModal(ModalType.SENDING_CONFIRMATION);
  };

  return (
    <>
      <Box>
        <Stack sx={sectionStackStyle}>
          <Box sx={sectionHeaderWrapperStyle}>
            <Typography color={COMMON_WHITE_COLOR}>{t("formulaire.public.captcha.title")}</Typography>
          </Box>
          <Box sx={sectionContentStyle}>
            <Box sx={descriptionStyle}>
              <Typography>{t("formulaire.public.captcha.description")}</Typography>
            </Box>
            <Stack component={Paper} sx={questionStackStyle}>
              <Box sx={spaceBetweenBoxStyle}>
                <Typography variant={TypographyVariant.H6}>{captcha?.title}</Typography>
                <IconButtonTooltiped
                  icon={<ReplayRoundedIcon />}
                  onClick={reloadCaptcha}
                  tooltipI18nKey={"formulaire.public.captcha.reload.description"}
                  ariaLabel="reload"
                />
              </Box>
              <TextField
                variant={ComponentVariant.OUTLINED}
                fullWidth
                placeholder={t("formulaire.public.captcha.placeholder")}
              />
            </Stack>
          </Box>
        </Stack>
        <Box sx={spaceBetweenBoxStyle}>
          <Button variant={ComponentVariant.OUTLINED} onClick={goBackToRecap}>
            {t("formulaire.public.prev")}
          </Button>
          <Button
            variant={ComponentVariant.CONTAINED}
            onClick={() => {
              sendForm();
            }}
          >
            {t("formulaire.public.send")}
          </Button>
        </Box>
      </Box>
      {showSendingConfirmation && (
        <SendingConfirmationModal
          isOpen={showSendingConfirmation}
          handleClose={() => {
            toggleModal(ModalType.SENDING_CONFIRMATION);
          }}
        />
      )}
    </>
  );
};
