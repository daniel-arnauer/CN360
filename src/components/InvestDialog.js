import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";

export default function InvestDialog({ open = false, setOpen }) {
  //   const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Invest in a project"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Set the amount of money you want to contribute
          </DialogContentText>
          <TextField label="Investment" variant="outlined" sx={{ m: "5px" }} />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Submit
          </Button>
          <Button onClick={handleClose} autoFocus sx={{ color: "red" }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
