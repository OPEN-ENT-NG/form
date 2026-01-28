import { ChangeEvent, FC, useState } from "react";

import { IHomeMainSentFormTableProps } from "./types";
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
  Typography,
} from "@cgi-learning-hub/ui";
import { TypographyVariant } from "~/core/style/themeProps";
import { IForm } from "~/core/models/form/types";
import { getPageForms, initialTableProps } from "../HomeMainFormsTable/utils";
import { tablePaginationStyle } from "../HomeMainFormsTable/style";
import { getFormDistributions, getFormStatusText, isFormFilled } from "~/core/models/form/utils";
import { useFormatDateWithTime } from "~/hook/useFormatDateWithTime";
import { ERROR_MAIN_COLOR, SUCCESS_MAIN_COLOR } from "~/core/style/colors";
import { getFirstDistributionDate } from "~/core/models/distribution/utils";
import { useSentFormColumns } from "./utils";

export const HomeMainSentFormTable: FC<IHomeMainSentFormTableProps> = ({ sentForms, distributions }) => {
  const { selectedSentForm, setSelectedSentForm } = useHome();
  const { t } = useTranslation(FORMULAIRE);
  const columns = useSentFormColumns();
  const totalCount = sentForms.length;
  const [tablePaginationProps, setTablePaginationProps] = useState(initialTableProps);
  const displayedForms = getPageForms(sentForms, tablePaginationProps);
  const formatDateWithTime = useFormatDateWithTime();

  const isSelected = (formId: number) => !!selectedSentForm && selectedSentForm.id === formId;

  const handleClick = (event: ChangeEvent<HTMLInputElement>, form: IForm) => {
    setSelectedSentForm(form);
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
      <TableContainer sx={{ width: "100%", tableLayout: "fixed" }}>
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
            return (
              <TableRow
                key={form.id}
                selected={isSelected(form.id)}
                aria-checked={isSelected(form.id)}
                role="checkbox"
                tabIndex={-1}
                hover
              >
                <TableCell sx={{ padding: 0 }} padding="checkbox">
                  <Checkbox
                    checked={isSelected(form.id)}
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
                  <Typography variant={TypographyVariant.BODY2}>
                    {formatDateWithTime(
                      getFirstDistributionDate(getFormDistributions(form, distributions)),
                      "formulaire.sentAt",
                    )}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography
                    variant={TypographyVariant.BODY2}
                    color={isFormFilled(form, distributions) ? SUCCESS_MAIN_COLOR : ERROR_MAIN_COLOR}
                  >
                    {getFormStatusText(form, getFormDistributions(form, distributions), formatDateWithTime)}
                  </Typography>
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
