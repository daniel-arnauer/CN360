import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import MakeOfferDialog from "./MakeOfferDialog";
import InvestDialog from "./InvestDialog";

export const VIEW_MODES = {
  ALL: "all",
  OWNER: "owner",
  CONTRACTOR: "contractor",
  INVESTOR: "investor"
};

const ProjectTable = ({ projects = [], viewMode = VIEW_MODES.ALL }) => {
  const [openOfferDialog, setOpenOfferDialog] = useState(false);
  const [openInvestDialog, setOpenInvestDialog] = useState(false);
  const [currentID, setCurrentID] = useState("");

  if (!Array.isArray(projects)) {
    console.log("is still fetching");
    return <div />;
  }
  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Creator</TableCell>
              <TableCell align="right">Location</TableCell>
              <TableCell align="right">PostCode</TableCell>
              {viewMode !== "owner" && (
                <>
                  <TableCell align="right">Actions</TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map(row => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.creator}</TableCell>
                <TableCell align="right">{row.location}</TableCell>
                <TableCell align="right">{row.postCode}</TableCell>

                {(viewMode === VIEW_MODES.CONTRACTOR ||
                  viewMode === VIEW_MODES.INVESTOR ||
                  viewMode === VIEW_MODES.ALL) && (
                  <TableCell align="right">
                    {(viewMode === VIEW_MODES.CONTRACTOR ||
                      viewMode === VIEW_MODES.ALL) && (
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setCurrentID(row.id);
                          setOpenOfferDialog(true);
                        }}
                        sx={{ margin: "5px" }}
                      >
                        Make an offer
                      </Button>
                    )}
                    {(viewMode === VIEW_MODES.INVESTOR ||
                      viewMode === VIEW_MODES.ALL) && (
                      <Button
                        variant="outlined"
                        onClick={() => setOpenInvestDialog(true)}
                        sx={{ margin: "5px" }}
                      >
                        Invest
                      </Button>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <MakeOfferDialog
        open={openOfferDialog}
        setOpen={setOpenOfferDialog}
        projectId={currentID}
      />
      <InvestDialog open={openInvestDialog} setOpen={setOpenInvestDialog} />
    </>
  );
};

export default ProjectTable;
