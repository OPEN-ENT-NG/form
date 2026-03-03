import {
  Box,
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
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { FC } from "react";

import { Header } from "~/components/Header";
import { EmptyResult } from "~/components/SVG/EmptyResult";
import { ModalType } from "~/core/enums";
import { TEXT_SECONDARY_COLOR } from "~/core/style/colors";
import { ComponentVariant } from "~/core/style/themeProps";
import { useFormulaireNavigation } from "~/hook/useFormulaireNavigation";
import { t } from "~/i18n";
import { useGlobal } from "~/providers/GlobalProvider";
import { useResult } from "~/providers/ResultProvider";

import { FormElementResult } from "../FormElementResult";
import { CsvResultModal } from "../modal/CsvResultModal";
import { PdfResultModal } from "../modal/PdfResultModal";
import { selectStyle } from "./style";
import { getHeaderButtonsProps } from "./utils";

export const ResultView: FC = () => {
  const { form, countDistributions, formElementList, selectedFormElement, setSelectedFormElement } = useResult();
  const { toggleModal, isTablet } = useGlobal();
  const { navigateToHome } = useFormulaireNavigation();

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

  const headerItems = [
    <Stack direction="row" gap={2} alignItems="center">
      <Typography fontSize="2.4rem">{form.title}</Typography>
      <Box color={TEXT_SECONDARY_COLOR}>
        <NavigateNextIcon sx={{ height: "2.4rem" }} />
      </Box>
      <Typography fontSize="2.4rem">{t("formulaire.results")}</Typography>
    </Stack>,
  ];

  const getSelect = () => (
    <Stack direction="row" alignItems="center" gap={2} width={isTablet ? "100%" : "40%"} minWidth={0}>
      <Typography>{t("formulaire.goTo")}</Typography>
      <Select sx={selectStyle} value={selectedFormElement?.id || ""} onChange={handleChangeSelectedFormElement}>
        {formElementList.map((formElement, index) => (
          <MenuItem key={formElement.id} value={formElement.id ?? 0}>
            {`${index + 1}. ${formElement.title}`}
          </MenuItem>
        ))}
      </Select>
    </Stack>
  );

  return (
    <Stack width="100%">
      <Header items={headerItems} buttons={buttons} displaySeparator />
      {countDistributions ? (
        <Stack margin={isTablet ? "2rem 1rem 4rem 1rem" : "2rem 8rem 4rem 8rem"}>
          {selectedFormElement ? <FormElementResult formElement={selectedFormElement} /> : <Loader />}
          {isTablet && <Box mt={3}>{getSelect()}</Box>}
          <Stack direction="row" justifyContent="space-between" mt={3} alignItems="center">
            <Box>
              <Button
                onClick={handlePrev}
                variant={ComponentVariant.CONTAINED}
                disabled={!selectedFormElement || selectedFormElement.position === 1}
              >
                {t("formulaire.prev")}
              </Button>
            </Box>
            {!isTablet && getSelect()}
            <Box>
              <Button
                onClick={handleNext}
                variant={ComponentVariant.CONTAINED}
                disabled={!selectedFormElement || selectedFormElement.position === formElementList.length}
              >
                {t("formulaire.next")}
              </Button>
            </Box>
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
          <Link
            onClick={() => {
              navigateToHome();
            }}
            color="primary"
            sx={{ "&:hover": { cursor: "pointer" } }}
          >
            {t("formulaire.error.backToMenu")}
          </Link>
        </Stack>
      )}
      <PdfResultModal />
      <CsvResultModal />
    </Stack>
  );
};
