import { Box, Button, Paper, Stack, Typography } from "@cgi-learning-hub/ui";
import dayjs from "dayjs";
import { FC, useMemo } from "react";

import RGPDInfoBox from "~/components/RgpdInfoBox";
import { IRGPDData } from "~/components/RgpdInfoBox/types";
import { ResponsePageType } from "~/core/enums";
import { flexEndBoxStyle } from "~/core/style/boxStyles";
import { TEXT_PRIMARY_COLOR } from "~/core/style/colors";
import { ComponentVariant, TypographyVariant } from "~/core/style/themeProps";
import { t } from "~/i18n";
import { useResponse } from "~/providers/ResponseProvider";
import { useGetDelegatesQuery } from "~/services/api/formulaireApi/delegateApi";

import { rgpdLayoutStyle, rgpdStackStyle } from "./style";
import { buildDelegatesParam } from "./utils";

export const RgpdLayout: FC = () => {
  const { form, setPageType } = useResponse();
  const { data: delegatesDatas } = useGetDelegatesQuery();

  const rgpdExpirationDate = useMemo(() => {
    if (!form) return;
    return dayjs(form.date_opening).add(form.rgpd_lifetime, "month");
  }, [form]);

  const delegatesParam = useMemo(() => {
    if (!form || !form.rgpd_goal) return {} as IRGPDData;
    return buildDelegatesParam(delegatesDatas ?? null, form.rgpd_goal, rgpdExpirationDate);
  }, [delegatesDatas, rgpdExpirationDate]);

  const startForm = () => {
    setPageType(form?.description ? ResponsePageType.DESCRIPTION : ResponsePageType.FORM_ELEMENT);
    return;
  };

  return (
    <Box sx={rgpdLayoutStyle}>
      <Stack component={Paper} sx={rgpdStackStyle}>
        <Typography variant={TypographyVariant.H6}>{t("formulaire.public.rgpd.title")}</Typography>
        <RGPDInfoBox params={delegatesParam} hideBorder sx={{ color: TEXT_PRIMARY_COLOR }} />
      </Stack>
      <Box sx={flexEndBoxStyle}>
        <Button variant={ComponentVariant.CONTAINED} onClick={startForm}>
          {t(`formulaire.public.respond.form`)}
        </Button>
      </Box>
    </Box>
  );
};
