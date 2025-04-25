import { ChangeEvent, FC, useState } from "react";

import { IHomeMainTableProps } from "./types";
import { DEFAULT_PAGINATION_LIMIT, FORMULAIRE } from "~/core/constants";
import { useTranslation } from "react-i18next";
import { useHome } from "~/providers/HomeProvider";
import {
  Checkbox,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
} from "@cgi-learning-hub/ui";
import { getPageForms, initialTableProps, useColumns } from "./utils";
import { Typography } from "@cgi-learning-hub/ui";
import { TypographyVariant } from "~/core/style/themeProps";
import { IForm } from "~/core/models/form/types";
import dayjs from "dayjs";
import { DateFormat } from "~/core/enums";
import { tablePaginationStyle } from "./style";
import { useFormItemsIcons } from "~/hook/useFormItemsIcons";

export const HomeMainTable: FC<IHomeMainTableProps> = ({ forms }) => {
  const { selectedForms, setSelectedForms } = useHome();
  const { t } = useTranslation(FORMULAIRE);
  const columns = useColumns();
  const totalCount = forms.length;
  const [tablePaginationProps, setTablePaginationProps] = useState(initialTableProps);
  const displayedForms = getPageForms(forms, tablePaginationProps);

  const isSelected = (formId: number) => selectedForms.some((form) => form.id === formId);
  const { getIcons } = useFormItemsIcons();

  const handleClick = (event: ChangeEvent<HTMLInputElement>, form: IForm) => {
    const currentSelectedForms = event.target.checked
      ? [...selectedForms, form]
      : selectedForms.filter((item: IForm) => item.id !== form.id);
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
                  <Checkbox
                    checked={isItemSelected}
                    onChange={(event) => {
                      handleClick(event, form);
                    }}
                  />
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
                  {getIcons(form).map(({ text, icon }, idx) => (
                    <Tooltip key={idx} title={text} placement="top" arrow>
                      {icon}
                    </Tooltip>
                  ))}
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
