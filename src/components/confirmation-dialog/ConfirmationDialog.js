import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function ConfirmationDialog({
  title,
  actionBtnText,
  confirmationText,
  handleClose,
}) {
  return (
    <div>
      <Dialog
        open
        onClose={() => handleClose(null)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {confirmationText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(null)}>Cancel</Button>
          <Button onClick={() => handleClose(true)} autoFocus>
            {actionBtnText}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
