import {
  Button,
  EmptyState,
  Link,
  Loader,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@cgi-learning-hub/ui";
import { FC } from "react";

import { Header } from "~/components/Header";
import { EmptyResult } from "~/components/SVG/EmptyResult";
import { ModalType } from "~/core/enums";
import { FRONT_ROUTES } from "~/core/frontRoutes";
import { ComponentVariant } from "~/core/style/themeProps";
import { t } from "~/i18n";
import { useGlobal } from "~/providers/GlobalProvider";
import { useResult } from "~/providers/ResultProvider";

import { FormElementResult } from "../FormElementResult";
import { CsvResultModal } from "../modal/CsvResultModal";
import { PdfResultModal } from "../modal/PdfResultModal";
import { getHeaderButtonsProps } from "./utils";

export const ResultView: FC = () => {
  const { form, countDistributions, formElementList, selectedFormElement, setSelectedFormElement } = useResult();
  const { toggleModal } = useGlobal();

  const handleChangeSelectedFormElement = (e: SelectChangeEvent<number>) => {
    const selectedFormElementId = e.target.value;
    const formElement = formElementList.find((formElement) => formElement.id === selectedFormElementId);
    if (formElement) setSelectedFormElement(formElement);
  };

  const handleNext = () => {
    if (selectedFormElement && selectedFormElement.position) {
      const currentSelectedPos = selectedFormElement.position;
      const nextFormElement = formElementList.find((formElement) => formElement.position === currentSelectedPos + 1);
      if (nextFormElement) setSelectedFormElement(nextFormElement);
    }
  };

  const handlePrev = () => {
    if (selectedFormElement && selectedFormElement.position) {
      const currentSelectedPos = selectedFormElement.position;
      const prevFormElement = formElementList.find((formElement) => formElement.position === currentSelectedPos - 1);
      if (prevFormElement) setSelectedFormElement(prevFormElement);
    }
  };

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
        <Stack margin={"2rem 8rem 4rem 8rem"}>
          {selectedFormElement ? <FormElementResult formElement={selectedFormElement} /> : <Loader />}
          <Stack direction="row" justifyContent="space-between" mt={3}>
            <Button
              onClick={handlePrev}
              variant={ComponentVariant.CONTAINED}
              disabled={!selectedFormElement || selectedFormElement.position === 1}
            >
              {t("formulaire.prev")}
            </Button>
            <Stack direction="row" alignItems="center" gap={2} width="40%">
              <Typography>{t("formulaire.goTo")}</Typography>
              <Select sx={{ flex: 1 }} value={selectedFormElement?.id || ""} onChange={handleChangeSelectedFormElement}>
                {formElementList.map((formElement, index) => (
                  <MenuItem key={formElement.id} value={formElement.id ?? 0}>
                    {`${index + 1}. ${formElement.title}`}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
            <Button
              onClick={handleNext}
              variant={ComponentVariant.CONTAINED}
              disabled={!selectedFormElement || selectedFormElement.position === formElementList.length}
            >
              {t("formulaire.next")}
            </Button>
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
      <PdfResultModal />
      <CsvResultModal />
    </Stack>
  );
};
