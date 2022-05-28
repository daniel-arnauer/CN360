import * as React from "react";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";
import Box from "@mui/material/Box";

export default function DatePicker({ date = null, setDate, label = "", sx }) {
  return (
    <Box sx={sx}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MuiDatePicker
          label={label}
          value={date}
          onChange={(newValue) => {
            setDate(newValue);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
    </Box>
  );
}
