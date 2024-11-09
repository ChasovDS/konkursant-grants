import React from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";

export const ConfirmationDialog = ({ open, onClose, onConfirm, message }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Подтверждение удаления</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Отмена
        </Button>
        <Button onClick={onConfirm} color="secondary">
          Удалить
        </Button>
      </DialogActions>
    </Dialog>
  );
};