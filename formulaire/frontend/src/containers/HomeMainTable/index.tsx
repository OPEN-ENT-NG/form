import { FC } from "react";

import { HomeMainTableProps } from "./types";
import { FORMULAIRE } from "~/core/constants";
import { useTranslation } from "react-i18next";
import { useHome } from "~/providers/HomeProvider";
import { Box, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
import { useColumns } from "./utils";

export const HomeMainTable: FC<HomeMainTableProps> = ({ forms }) => {
  const { selectedForms, setSelectedForms } = useHome();
  const { t } = useTranslation(FORMULAIRE);

  const columns = useColumns();
  return (
    <>
      <Box>yo</Box>
      <TableContainer>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.id} align="center" style={{ width: column.width }}>
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          
        </TableBody>
      </TableContainer>
    </>
  );
};
