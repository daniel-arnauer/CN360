import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { PAGE } from "../App";
import ProjectTable, { VIEW_MODES } from "../components/ProjectTable";

import { getProjects } from "../assets/js/near/utils";

const LandingPage = ({ setCurrentPage }) => {
  const [showProjects, setShowProjects] = useState(false);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function fetch() {
      const projectResolved = await getProjects();
      setProjects(projectResolved);
    }
    fetch().then(() => setShowProjects(true));
  }, [setProjects]);
  return (
    <>
      <title>Solar contractor app</title>

      <Typography variant="h6">Select your role</Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <Button
          variant="outlined"
          onClick={() => setCurrentPage(PAGE.INVESTOR_OVERVIEW)}
        >
          Investor
        </Button>
        <Button
          variant="outlined"
          onClick={() => setCurrentPage(PAGE.OWNER_OVERVIEW)}
        >
          Owner
        </Button>
        <Button
          variant="outlined"
          onClick={() => setCurrentPage(PAGE.CONTRACTOR_OVERVIEW)}
        >
          CONTRACTOR
        </Button>
      </Box>
      <Typography variant="h6">All projects where I am involved</Typography>
      <Box
        sx={{
          marginTop: "30px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "50rem",
          }}
        >
          {showProjects && (
            <ProjectTable projects={projects} viewMode={VIEW_MODES.ALL} />
          )}
        </Box>
      </Box>
    </>
  );
};

export default LandingPage;
