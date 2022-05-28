import React, { useState, useEffect } from "react";
import { Box, Button, Typography, IconButton } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ProjectTable from "../components/ProjectTable";
import AddOwnerProjectDialog from "../components/AddOwnerProjectDialog";

const projects = [
  {
    name: "my_project_name",
    owner: "my_name",
    status: "5 Investors registered",
    street: "my_street 5",
    city: "my_city",
    documentUploaded: false,
  },
  {
    name: "Solar Panel 1",
    owner: "Otto",
    status: "5 Investors registered",
    street: "Hausgasse 5",
    city: "Wien",
    documentUploaded: true,
  },
];

const InvestorOverview = ({ setCurrentPage }) => {
  const [openDialog, setOpenDialog] = useState(false);
  return (
    <>
      <title>Investor overview</title>

      <Typography variant="h6">
        {" "}
        <IconButton onClick={() => setCurrentPage("landing")} aria-label="home">
          <HomeIcon sx={{ color: "white" }} />
        </IconButton>{" "}
        Available projects
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box>
          <Box
            sx={{
              maxWidth: "80rem",
              marginTop: "30px",
            }}
          >
            <ProjectTable projects={projects} viewMode={"investor"} />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          ></Box>
        </Box>
      </Box>
    </>
  );
};

export default InvestorOverview;
