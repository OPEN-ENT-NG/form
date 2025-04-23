import {
  Button,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  TablePagination,
  Table,
  Box,
  Tooltip,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { Dayjs } from "dayjs";
import { ComponentPropsWithoutRef, FC } from "react";

type MyMockedDatePickerProps = Omit<ComponentPropsWithoutRef<typeof Box>, "onChange" | "value"> & {
  slotProps?: {
    textField?: {
      error?: boolean;
    };
  };
  minDate?: Dayjs;
  value?: Dayjs;
  onChange?: (value: Dayjs) => void;
};

const MockedDatePicker: FC<MyMockedDatePickerProps> = ({ slotProps, minDate, value, onChange, ...boxProps }) => {
  void slotProps;
  void minDate;
  void value;
  void onChange;

  return <Box {...boxProps} />;
};

jest.mock("@cgi-learning-hub/ui", () => ({
  Button: Button,
  TextField: TextField,
  Typography: Typography,
  Dialog: Dialog,
  DialogTitle: DialogTitle,
  DialogContent: DialogContent,
  DialogActions: DialogActions,
  TableContainer: TableContainer,
  TableHead: TableHead,
  TableRow: TableRow,
  TableCell: TableCell,
  TableBody: TableBody,
  Checkbox: Checkbox,
  TablePagination: TablePagination,
  Table: Table,
  Box: Box,
  DatePicker: MockedDatePicker,
  Tooltip: Tooltip,
  FormControl: FormControl,
  Select: Select,
  MenuItem: MenuItem,
}));
