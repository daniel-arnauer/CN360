import React, { useState, useEffect } from "react";
import { Box, Button, Typography, IconButton } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ProjectTable from "../components/ProjectTable";
import AddOwnerProjectDialog from "../components/AddOwnerProjectDialog";

import { getProjects } from "../assets/js/near/utils";

const OwnerOverview = ({ setCurrentPage }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [projects, setProjects] = useState([]);
  const [accountId, setAccountId] = useState("");

  useEffect(() => {
    setAccountId(window?.walletConnection._authData.accountId);
  }, [window.walletConnection]);

  useEffect(() => {
    async function fetch() {
      const projectResolved = await getProjects();
      const projectsOwnedByUser = projectResolved.filter(
        (p) => p.contractor === accountId
      );
      setProjects(projectsOwnedByUser);
    }
    fetch().then(() => setShowProjects(true));
  }, [setProjects]);

  return (
    <>
      <title>Owner overview</title>

      <Typography variant="h6">
        {" "}
        <IconButton onClick={() => setCurrentPage("landing")} aria-label="home">
          <HomeIcon sx={{ color: "white" }} />
        </IconButton>{" "}
        My issued projects
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
              width: "50rem",
              marginTop: "30px",
            }}
          >
            {showProjects && (
              <ProjectTable projects={projects} viewMode={"owner"} />
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              variant="outlined"
              onClick={() => setOpenDialog(true)}
              sx={{ marginTop: "30px" }}
            >
              Add Project
            </Button>
          </Box>
        </Box>
      </Box>
      <AddOwnerProjectDialog open={openDialog} setOpen={setOpenDialog} />
    </>
  );
};

export default OwnerOverview;
