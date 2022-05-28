import * as React from "react";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";
import Box from "@mui/material/Box";

export default function DatePicker({ date = null, setDate, label = "", sx }) {
  const [value, setValue] = React.useState(date);

  return (
    <Box sx={sx}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MuiDatePicker
          label={label}
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
    </Box>
  );
}
