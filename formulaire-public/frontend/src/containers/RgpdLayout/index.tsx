import { Box, Button, Paper, Stack, Typography } from "@cgi-learning-hub/ui";
import dayjs from "dayjs";
import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";

import RGPDInfoBox from "~/components/RgpdInfoBox";
import { IRGPDI18nParams } from "~/components/RgpdInfoBox/types";
import { FORMULAIRE_PUBLIC } from "~/core/constants";
import { ResponsePageType } from "~/core/enums";
import { flexEndBoxStyle } from "~/core/style/boxStyles";
import { TEXT_PRIMARY_COLOR } from "~/core/style/colors";
import { ComponentVariant, TypographyVariant } from "~/core/style/themeProps";
import { useResponse } from "~/providers/ResponseProvider";
import { useGetDelegatesQuery } from "~/services/api/formulaireApi/delegateApi";

import { rgpdLayoutStyle, rgpdStackStyle } from "./style";
import { buildDelegatesParam } from "./utils";

export const RgpdLayout: FC = () => {
  const { form, setPageType } = useResponse();
  const { t } = useTranslation(FORMULAIRE_PUBLIC);
  const { data: delegatesData } = useGetDelegatesQuery();

  const rgpdExpirationDate = useMemo(() => {
    if (!form) return;
    return dayjs(form.date_opening).add(form.rgpd_lifetime, "month");
  }, [form]);

  const delegatesParam = useMemo(() => {
    if (!form || !form.rgpd_goal) return {} as IRGPDI18nParams;
    return buildDelegatesParam(delegatesData ?? null, form.rgpd_goal, rgpdExpirationDate);
  }, [delegatesData, rgpdExpirationDate]);

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
