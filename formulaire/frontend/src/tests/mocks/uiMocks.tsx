import { Button, TextField, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

jest.mock("@cgi-learning-hub/ui", () => ({
  Button: Button,
  TextField: TextField,
  Typography: Typography,
  Dialog: Dialog,
  DialogTitle: DialogTitle,
  DialogContent: DialogContent,
  DialogActions: DialogActions,
}));
