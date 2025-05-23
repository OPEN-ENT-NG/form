import { FC, useState } from "react";
import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography } from "@cgi-learning-hub/ui";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { IDistributionTableProps } from "./types";
import {
  tableStyle,
  containerStyle,
  paperStyle,
  headerRowStyle,
  headerCellStyle,
  tableBodyStyle,
  tableRowStyle,
  emptyRowMessageStyle,
  seeMoreButtonStyle,
} from "./style";
import { BoxComponentType } from "~/core/style/themeProps";

export const DistributionTable: FC<IDistributionTableProps> = ({ distributions }) => {
  const { t } = useTranslation(FORMULAIRE);
  const [maxRows, setMaxRows] = useState<number>(8);

  const handleSeeMore = () => {
    setMaxRows((prev) => prev + 8);
  };

  const displayedDatas = distributions.slice(0, maxRows);
  const hasMoreToShow = distributions.length > maxRows;
  const nameColumnTitle = `${t("formulaire.checkremind.table.name")}, ${t("formulaire.checkremind.table.surname")}`;

  return (
    <Box sx={containerStyle}>
      <Paper sx={paperStyle}>
        <Table sx={tableStyle}>
          <TableHead>
            <TableRow sx={headerRowStyle}>
              <TableCell sx={headerCellStyle} width="80%">
                {nameColumnTitle}
              </TableCell>
              <TableCell align="right" sx={headerCellStyle} width="20%">
                {t("formulaire.number.responses")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={tableBodyStyle}>
            {displayedDatas.map((person) => (
              <TableRow key={person.responderId} sx={tableRowStyle}>
                <TableCell component={BoxComponentType.TH} scope="row" width="80%">
                  {person.responderName}
                </TableCell>
                <TableCell align="center" width="20%">
                  {person.responseCount}
                </TableCell>
              </TableRow>
            ))}
            {!displayedDatas.length && (
              <TableRow sx={tableRowStyle}>
                <TableCell colSpan={2} align="center">
                  <Typography sx={emptyRowMessageStyle}>{t("formulaire.results.empty")}</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {hasMoreToShow && (
        <Box mt={1}>
          <Button color="primary" variant="text" onClick={handleSeeMore} sx={seeMoreButtonStyle}>
            {t("formulaire.seeMore")}
          </Button>
        </Box>
      )}
    </Box>
  );
};
