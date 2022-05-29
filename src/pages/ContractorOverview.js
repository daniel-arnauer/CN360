import React, { useState, useEffect } from "react";
import { Box, Button, Typography, IconButton } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ProjectTable from "../components/ProjectTable";
import { getProjects } from "../assets/js/near/utils";

const ContractorOverview = ({ setCurrentPage, currentPage }) => {
  const [showProjects, setShowProjects] = useState(false);
  const [projects, setProjects] = useState([]);
  const [accountId, setAccountId] = useState("");

  useEffect(() => {
    setAccountId(window?.walletConnection._authData.accountId);
    console.log("Current Wallet: " + window?.walletConnection);
  }, [window.walletConnection]);

  useEffect(() => {
    async function fetch() {
      console.log("fetching projects ...");
      const projectResolved = await getProjects();
      const projectsWithOfferFromUser = projectResolved.filter(p => {
        return p.offers?.some(o => o.contractor === accountId) || false;
      });
      console.log("projectsWithOfferFromUser: " + projectsWithOfferFromUser);
      setProjects(projectsWithOfferFromUser);
    }
    fetch().then(() => setShowProjects(true));
  }, [setProjects, getProjects, accountId, currentPage]);

  return (
    <>
      <title>Contractor overview</title>

      <Typography variant="h6">
        {" "}
        <IconButton onClick={() => setCurrentPage("landing")} aria-label="home">
          <HomeIcon sx={{ color: "white" }} />
        </IconButton>{" "}
        Projects where I draft a contract
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Box>
          <Box
            sx={{
              width: "50rem",
              marginTop: "30px"
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
              alignItems: "center"
            }}
          ></Box>
        </Box>
      </Box>
    </>
  );
};

export default ContractorOverview;
