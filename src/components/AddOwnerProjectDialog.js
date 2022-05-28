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
import { createProject } from "../assets/js/near/utils";

export default function AddOwnerProjectDialog({ open = false, setOpen }) {
  const [name, setName] = React.useState("");
  const [area, setArea] = React.useState(0);
  const [street, setStreet] = React.useState("");
  const [postCode, setPostCode] = React.useState("");
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  React.useEffect(() => {
    if (!open) {
      setName("");
      setArea(0);
      setStreet("");
      setPostCode("");
    }
  }, [open]);

  const handleSubmit = () => {
    console.log(name);
    console.log(area);
    console.log(street);
    console.log(postCode);
    createProject({
      area: area,
      location: street,
      postCode: postCode,
      name: name,
    });
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
          {"Create a new project"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add all information and press "Submit" to create a new project
          </DialogContentText>
          <TextField
            label="Name"
            variant="outlined"
            sx={{ m: "5px" }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Area"
            variant="outlined"
            sx={{ m: "5px" }}
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />
          <TextField
            label="Street"
            variant="outlined"
            sx={{ m: "5px" }}
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />
          <TextField
            label="City"
            variant="outlined"
            sx={{ m: "5px" }}
            value={postCode}
            onChange={(e) => setPostCode(e.target.value)}
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
