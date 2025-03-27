import { ChangeEvent, FC } from "react";

import { HomeMainTableProps } from "./types";
import { FORMULAIRE } from "~/core/constants";
import { useTranslation } from "react-i18next";
import { useHome } from "~/providers/HomeProvider";
import { Box, Checkbox, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useColumns } from "./utils";
import { Typography } from "@cgi-learning-hub/ui";
import { TypographyVariant } from "~/core/style/themeProps";
import { Form } from "~/core/models/form/types";
import ShareIcon from "@mui/icons-material/Share";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import PublicIcon from "@mui/icons-material/Public";
import NotificationsIcon from "@mui/icons-material/Notifications";
import dayjs from "dayjs";
import { DateFormat } from "~/core/enums";

export const HomeMainTable: FC<HomeMainTableProps> = ({ forms }) => {
  const { selectedForms, setSelectedForms } = useHome();
  const { t } = useTranslation(FORMULAIRE);
  const columns = useColumns();
  console.log(forms);

  const isSelected = (formId: number) => false;

  const handleClick = (event: ChangeEvent<HTMLInputElement>, form: Form) => {
    console.log("clicked");
  };

  return (
    <>
      <TableContainer>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.id} align="center" style={{ width: column.width }}>
                <Typography variant={TypographyVariant.BODY1}>{column.label}</Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {forms.map((form) => {
            const isItemSelected = isSelected(form.id);
            return (
              <TableRow
                key={form.id}
                selected={isItemSelected}
                aria-checked={isItemSelected}
                role="checkbox"
                tabIndex={-1}
                hover
              >
                <TableCell sx={{ padding: 0 }} padding="checkbox">
                  <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, form)} />
                </TableCell>
                <TableCell align="center">
                  <Typography variant={TypographyVariant.BODY2}>{form.title}</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant={TypographyVariant.BODY2}>{form.owner_name}</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant={TypographyVariant.BODY2}>{form.nb_responses}</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant={TypographyVariant.BODY2}>
                    {t("formulaire.modified") + dayjs(form.date_creation).format(DateFormat.DAY_MONTH_YEAR_HOUR_MIN)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  {form.reminded && <NotificationsIcon />}
                  {form.collab && <ShareIcon />}
                  {form.sent && <ForwardToInboxIcon />}
                  {form.is_public && <PublicIcon />}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </TableContainer>
      <Box>yo</Box>
    </>
  );
};
