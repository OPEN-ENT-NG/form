import { ChangeEvent, FC, useState } from "react";

import { HomeMainTableProps } from "./types";
import { DEFAULT_PAGINATION_LIMIT, FORMULAIRE } from "~/core/constants";
import { useTranslation } from "react-i18next";
import { useHome } from "~/providers/HomeProvider";
import { Checkbox, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
import { initTableProps, useColumns } from "./utils";
import { Typography } from "@cgi-learning-hub/ui";
import { TypographyVariant } from "~/core/style/themeProps";
import { Form } from "~/core/models/form/types";
import ShareIcon from "@mui/icons-material/Share";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import PublicIcon from "@mui/icons-material/Public";
import NotificationsIcon from "@mui/icons-material/Notifications";
import dayjs from "dayjs";
import { DateFormat } from "~/core/enums";
import { tablePaginationStyle } from "./style";

export const HomeMainTable: FC<HomeMainTableProps> = ({ forms }) => {
  const { selectedForms, setSelectedForms } = useHome();
  const { t } = useTranslation(FORMULAIRE);
  const columns = useColumns();
  const totalCount = forms.length ?? 0;
  const [tablePaginationProps, setTablePaginationProps] = useState(initTableProps());
  const displayedForms =
    tablePaginationProps.limit > 0
      ? forms.slice(
          tablePaginationProps.page * tablePaginationProps.limit,
          (tablePaginationProps.page + 1) * tablePaginationProps.limit,
        )
      : forms;

  const isSelected = (formId: number) => selectedForms.some((form) => form.id === formId);

  const handleClick = (event: ChangeEvent<HTMLInputElement>, form: Form) => {
    const currentSelectedForms = event.target.checked
      ? [...selectedForms, form]
      : selectedForms.filter((item: Form) => item.id !== form.id);
    setSelectedForms(currentSelectedForms);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setTablePaginationProps({ ...tablePaginationProps, page: newPage });
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = parseInt(event.target.value);
    setTablePaginationProps({ limit: newLimit, page: 0 });
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
          {displayedForms.map((form) => {
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
                  <Typography variant={TypographyVariant.BODY2}>{form.nb_responses ?? 0}</Typography>
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
      {totalCount > DEFAULT_PAGINATION_LIMIT && (
        <TablePagination
          component={"div"}
          count={totalCount}
          page={tablePaginationProps.page}
          rowsPerPage={tablePaginationProps.limit}
          rowsPerPageOptions={[10, 25, 50]}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={t("formulaire.table.rows.per.page")}
          sx={tablePaginationStyle}
        />
      )}
    </>
  );
};
