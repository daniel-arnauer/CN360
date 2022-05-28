import React, { useState, useEffect } from "react";
import { Box, Button, Typography, IconButton } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ProjectTable from "../components/ProjectTable";
import { getProjects } from "../assets/js/near/utils";

const ContractorOverview = ({ setCurrentPage }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [projects, setProjects] = useState([]);
  const [accountId, setAccountId] = useState("");

  useEffect(() => {
    setAccountId(window?.walletConnection._authData.accountId);
  }, [window.walletConnection]);

  useEffect(() => {
    console.log(window?.walletConnection);
    async function fetch() {
      const projectResolved = await getProjects();
      const projectsWithOfferFromUser = projectResolved.filter((p) => {
        return p.offer?.some((o) => o.contractor === accountId) || false;
      });
      setProjects(projectsWithOfferFromUser);
    }
    fetch().then(() => setShowProjects(true));
  }, [setProjects]);

  return (
    <>
      <title>Contractor overview</title>

      <Typography variant="h6">
        {" "}
        <IconButton onClick={() => setCurrentPage("landing")} aria-label="home">
          <HomeIcon sx={{ color: "white" }} />
        </IconButton>{" "}
        Available projects to make an offer
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
              <ProjectTable projects={projects} viewMode={"contractor"} />
            )}
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

export default ContractorOverview;
