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
import DatePicker from "./DatePicker";

import { createOffer } from "../assets/js/near/utils";

export default function MakeOfferDialog({ open = false, setOpen, projectId }) {
  //   const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [price, setPrice] = React.useState("");
  const [finishDate, setFinishDate] = React.useState(null);

  React.useEffect(() => {
    if (!open) {
      setPrice("");
      setFinishDate(null);
    }
  }, [open]);

  const handleSubmit = async () => {
    console.log("SUBMITTING OFFER");
    console.log({ projectId, price, finishDate });
    await createOffer({ projectId, price, finishDate });
    setOpen(false);
  };

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
          {"Make an offer"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>
          <TextField
            label="Price"
            variant="outlined"
            sx={{ m: "5px" }}
            onChange={(e) => setPrice(e.target.value)}
          />

          <DatePicker
            label="Completion date"
            sx={{ m: "5px" }}
            date={finishDate}
            setDate={setFinishDate}
          />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleSubmit}>
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
