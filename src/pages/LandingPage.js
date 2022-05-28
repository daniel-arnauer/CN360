import { Box, Button, Typography } from "@mui/material";
import { PAGE } from "../App";
import ProjectTable, { VIEW_MODES } from "../components/ProjectTable";

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

const LandingPage = ({ setCurrentPage }) => {
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
      <Box
        sx={{
          maxWidth: "80rem",
          marginTop: "30px",
        }}
      >
        <ProjectTable projects={projects} viewMode={VIEW_MODES.ALL} />
      </Box>
    </>
  );
};

export default LandingPage;
