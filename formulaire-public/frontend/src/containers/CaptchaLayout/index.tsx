import { Box, Button, Paper, Stack, TextField, Typography } from "@cgi-learning-hub/ui";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { IconButtonTooltiped } from "~/components/IconButtonTooltiped/IconButtonTooltiped";
import { ModalType, ResponsePageType, TagName } from "~/core/enums";
import { ICaptcha } from "~/core/models/captcha/types";
import { DistributionStatus } from "~/core/models/distribution/enums";
import { transformDistribution } from "~/core/models/distribution/utils";
import { spaceBetweenBoxStyle } from "~/core/style/boxStyles";
import { COMMON_WHITE_COLOR } from "~/core/style/colors";
import { ComponentVariant, TypographyVariant } from "~/core/style/themeProps";
import { t } from "~/i18n";
import { useGlobal } from "~/providers/GlobalProvider";
import { useResponse } from "~/providers/ResponseProvider";
import { useGetCaptchaQuery } from "~/services/api/formulairePublicApi/captchaApi";
import { emptySplitFormulairePublicApi } from "~/services/api/formulairePublicApi/emptySplitFormulairePublicApi";
import { useSendResponsesMutation } from "~/services/api/formulairePublicApi/responseApi";

import { questionStackStyle } from "../RespondQuestionWrapper/style";
import {
  descriptionStyle,
  sectionContentStyle,
  sectionHeaderWrapperStyle,
  sectionStackStyle,
} from "../RespondSectionWrapper/style";
import { SendingConfirmationModal } from "../SendingConfirmationModal";

export const CaptchaLayout: FC = () => {
  const { formKey, form, setPageType, flattenResponses } = useResponse();
  const {
    displayModals: { showSendingConfirmation },
    toggleModal,
  } = useGlobal();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [captcha, setCaptcha] = useState<ICaptcha>();
  const [captchaResponse, setCaptchaResponse] = useState<string>("");
  const [distributionCaptchaId, setDistributionCaptchaId] = useState<number | undefined>(form?.distribution_captcha);
  const [sendResponses] = useSendResponsesMutation();

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
  }, [captchaData]);

  const handleChangeCaptchaResponse = (event: ChangeEvent<HTMLInputElement>) => {
    setCaptchaResponse(event.target.value);
  };

  const goBackToRecap = () => {
    setPageType(ResponsePageType.RECAP);
  };

  const reloadCaptcha = () => {
    setDistributionCaptchaId(undefined);
    dispatch(emptySplitFormulairePublicApi.util.invalidateTags([TagName.CAPTCHA]));
  };

  const openSendingFormConfirmationModal = () => {
    toggleModal(ModalType.SENDING_CONFIRMATION);
  };

  const sendForm = async () => {
    if (!form?.distribution_key || !flattenResponses.length) return;
    const { data: distributionData } = await sendResponses({
      formKey,
      distributionKey: form.distribution_key,
      captchaResponse,
      responses: flattenResponses,
    });

    toggleModal(ModalType.SENDING_CONFIRMATION);
    if (distributionData) {
      const distribution = transformDistribution(distributionData);
      if (distribution.status === DistributionStatus.FINISHED) {
        toast.success(t("formulaire.public.success.responses.save"));
        sessionStorage.clear();
        navigate("/thanks");
        return;
      }
    }

    toast.error(t("formulaire.public.error.captcha"));
    reloadCaptcha();
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
                value={captchaResponse}
                onChange={handleChangeCaptchaResponse}
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
              openSendingFormConfirmationModal();
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
          onSendingConfirmation={() => {
            void sendForm();
          }}
        />
      )}
    </>
  );
};
