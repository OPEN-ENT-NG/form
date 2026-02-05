import { Button, EmptyState, Link, Paper, Select, Stack, Typography } from "@cgi-learning-hub/ui";
import { FC } from "react";

import { Header } from "~/components/Header";
import { EmptyResult } from "~/components/SVG/EmptyResult";
import { ModalType } from "~/core/enums";
import { FRONT_ROUTES } from "~/core/frontRoutes";
import { ComponentVariant } from "~/core/style/themeProps";
import { t } from "~/i18n";
import { useGlobal } from "~/providers/GlobalProvider";
import { useResult } from "~/providers/ResultProvider";

import { paperStyle } from "./style";
import { getHeaderButtonsProps } from "./utils";

export const ResultView: FC = () => {
  const { form, countDistributions } = useResult();
  const { toggleModal } = useGlobal();

  const buttons = countDistributions
    ? getHeaderButtonsProps(
        () => {
          toggleModal(ModalType.FORM_RESULT_PDF);
        },
        () => {
          toggleModal(ModalType.FORM_RESULT_CSV);
        },
      )
    : [];

  return (
    <Stack width="100%">
      <Header items={[form.title, t("formulaire.results")]} buttons={buttons} displaySeparator />
      {countDistributions ? (
        <Stack margin={"1rem 10rem"}>
          <Paper elevation={2} sx={paperStyle}></Paper>
          <Stack direction="row" justifyContent="space-between" mt={3}>
            <Button variant={ComponentVariant.CONTAINED}>{t("formulaire.prev")}</Button>
            <Stack direction="row" alignItems="center" gap={2}>
              <Typography>{t("formulaire.goTo")}</Typography>
              <Select></Select>
            </Stack>
            <Button variant={ComponentVariant.CONTAINED}>{t("formulaire.next")}</Button>
          </Stack>
        </Stack>
      ) : (
        <Stack width="100%" alignItems="center" gap={2}>
          <EmptyState
            mt={6}
            image={<EmptyResult />}
            title={t("formulaire.results.empty")}
            description={t("formulaire.results.reminder")}
            color="primary.main"
            imageHeight={250}
          />
          <Link href={FRONT_ROUTES.home.path} color="primary">
            {t("formulaire.error.backToMenu")}
          </Link>
        </Stack>
      )}
    </Stack>
  );
};
