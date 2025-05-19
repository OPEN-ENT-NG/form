import { ChangeEvent, FC, MouseEvent, useEffect, useState } from "react";

import { DEFAULT_PAGINATION_LIMIT, FORMULAIRE } from "~/core/constants";
import { useTranslation } from "react-i18next";
import { useHome } from "~/providers/HomeProvider";
import {
  Box,
  Checkbox,
  EllipsisWithTooltip,
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
import { useFormItemsIcons } from "~/hook/useFormItemsIcons";
import { iconBoxStyle, tableCheckboxStyle, tablePaginationStyle } from "./style";
import { IHomeMainFormsTableProps } from "./types";
import { ColumnId } from "./enums";

export const HomeMainFormsTable: FC<IHomeMainFormsTableProps> = ({ forms }) => {
  const { selectedForms, setSelectedForms } = useHome();
  const { t } = useTranslation(FORMULAIRE);
  const columns = useColumns();
  const totalCount = forms.length;
  const [tablePaginationProps, setTablePaginationProps] = useState(initialTableProps);
  const displayedForms = getPageForms(forms, tablePaginationProps);
  const { getIcons } = useFormItemsIcons();
  const { limit, page } = tablePaginationProps;
  const [isAllSelected, setAllSelected] = useState<boolean>(false);

  const isSelected = (formId: number) => selectedForms.some((form) => form.id === formId);

  const handleClick = (form: IForm) => {
    const isAlreadySelected = selectedForms.some((item) => item.id === form.id);
    const currentSelectedForms = isAlreadySelected
      ? selectedForms.filter((item: IForm) => item.id !== form.id)
      : [...selectedForms, form];
    setSelectedForms(currentSelectedForms);
  };

  const handleChangePage = (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setTablePaginationProps({ ...tablePaginationProps, page: newPage });
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    const newLimit = parseInt(event.target.value);
    setTablePaginationProps({ limit: newLimit, page: 0 });
  };

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedForms(displayedForms);
      setAllSelected(true);
      return;
    }
    setAllSelected(false);
    setSelectedForms([]);
  };

  useEffect(() => {
    const allSelected = displayedForms.every((form) =>
      selectedForms.some((selectedForm) => selectedForm.id === form.id),
    );
    setAllSelected(allSelected);
  }, [selectedForms, page]);

  useEffect(() => {
    const maxPage = Math.ceil(totalCount / limit) - 1;
    if (page > maxPage) {
      setTablePaginationProps((prev) => ({
        ...prev,
        page: Math.max(maxPage, 0),
      }));
    }
  }, [totalCount, limit, page]);

  return (
    <Box>
      <TableContainer>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.id} align="center" style={{ width: column.width }}>
                {column.id === ColumnId.SELECT && (
                  <Checkbox
                    checked={isAllSelected}
                    sx={tableCheckboxStyle}
                    onChange={(e) => {
                      handleSelectAllClick(e);
                    }}
                  />
                )}
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
                onClick={() => {
                  handleClick(form);
                }}
                sx={{ cursor: "pointer" }}
              >
                <TableCell sx={tableCheckboxStyle} padding="checkbox" align="center">
                  <Checkbox
                    checked={isItemSelected}
                    onChange={() => {
                      handleClick(form);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  />
                </TableCell>
                <TableCell align="center">
                  <EllipsisWithTooltip
                    typographyProps={{
                      variant: TypographyVariant.BODY2,
                      sx: { maxWidth: "30rem" },
                    }}
                  >
                    {form.title}
                  </EllipsisWithTooltip>
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
                  <Box sx={iconBoxStyle}>
                    {getIcons(form).map(({ text, icon }) => (
                      <Tooltip key={text} title={text} placement="top" arrow>
                        {icon}
                      </Tooltip>
                    ))}
                  </Box>
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
    </Box>
  );
};
