import "regenerator-runtime/runtime";
import React, { useState, useEffect } from "react";
import "./assets/css/global.css";
import { login, logout } from "./assets/js/near/utils";
import LandingPage from "./pages/LandingPage";
import InvestorOverview from "./pages/InvestorOverview";
import OwnerOverview from "./pages/OwnerOverview";
import ContractorOverview from "./pages/ContractorOverview";

export const PAGE = {
  LANDING: "landing",
  OWNER_OVERVIEW: "owner-overview",
  OWNER_NEW_REQUEST: "owner-new-request",
  INVESTOR_OVERVIEW: "investor-overview",
  INVESTOR_NEW_INVESTMENT: "investor-new-investment",
  CONTRACTOR_OVERVIEW: "contactor-overview",
  CONTRACTOR_NEW_CONTRACT: "contactor-new-contract"
};

export default function App() {
  const [currentPage, setCurrentPage] = useState(PAGE.LANDING);

  useEffect(() => {
    console.log("currentPage: " + currentPage);
  }, [currentPage]);

  // if not signed in, return early with sign-in prompt
  if (!window.walletConnection.isSignedIn()) {
    return (
      <main>
        <title>CN360</title>
        <h1>Welcome to CN360, PLEASE SIGN IN</h1>
        <p>
          Your contract is storing a greeting message in the NEAR blockchain. To
          change it you need to sign in using the NEAR Wallet. It is very
          simple, just use the button below.
        </p>
        <p>
          Do not worry, this app runs in the test network ("testnet"). It works
          just like the main network ("mainnet"), but using NEAR Tokens that are
          only for testing!
        </p>
        <p style={{ textAlign: "center", marginTop: "2.5em" }}>
          <button onClick={login}>Sign in</button>
        </p>
      </main>
    );
  }

  return (
    <>
      <button className="link" style={{ float: "right" }} onClick={logout}>
        Sign out
      </button>
      {currentPage === PAGE.LANDING && (
        <LandingPage setCurrentPage={setCurrentPage} />
      )}
      {currentPage === PAGE.INVESTOR_OVERVIEW && (
        <InvestorOverview
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      )}
      {currentPage === PAGE.OWNER_OVERVIEW && (
        <OwnerOverview
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      )}
      {currentPage === PAGE.CONTRACTOR_OVERVIEW && (
        <ContractorOverview
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      )}
    </>
  );
}
