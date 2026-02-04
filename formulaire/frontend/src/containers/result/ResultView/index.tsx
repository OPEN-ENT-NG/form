import { Button, Paper, Select, Stack, Typography } from "@cgi-learning-hub/ui";
import { FC } from "react";

import { Header } from "~/components/Header";
import { ModalType } from "~/core/enums";
import { ComponentVariant } from "~/core/style/themeProps";
import { t } from "~/i18n";
import { useGlobal } from "~/providers/GlobalProvider";
import { useResult } from "~/providers/ResultProvider";

import { paperStyle } from "./style";
import { getHeaderButtonsProps } from "./utils";

export const ResultView: FC = () => {
  const { form } = useResult();
  const { toggleModal } = useGlobal();

  return (
    <Stack width="100%">
      <Header
        items={[form.title, t("formulaire.results")]}
        buttons={getHeaderButtonsProps(
          () => {
            toggleModal(ModalType.FORM_RESULT_PDF);
          },
          () => {
            toggleModal(ModalType.FORM_RESULT_CSV);
          },
        )}
        displaySeparator
      />
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
    </Stack>
  );
};
