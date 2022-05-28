import "regenerator-runtime/runtime";
import React, { useState, useEffect } from "react";

import "./assets/css/global.css";

import { login, logout } from "./assets/js/near/utils";
import getConfig from "./assets/js/near/config";

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
  CONTRACTOR_NEW_CONTRACT: "contactor-new-contract",
};

export default function App() {
  // use React Hooks to store greeting in component state
  const [greeting, setGreeting] = React.useState();

  // when the user has not yet interacted with the form, disable the button
  const [buttonDisabled, setButtonDisabled] = React.useState(true);

  // after submitting the form, we want to show Notification
  const [showNotification, setShowNotification] = React.useState(false);

  // The useEffect hook can be used to fire side-effects during render
  // Learn more: https://reactjs.org/docs/hooks-intro.html
  React.useEffect(
    () => {
      // get_greeting is in near/utils.js
      /* get_greeting().then((greetingFromContract) => {
        setGreeting(greetingFromContract);
      }); */
    },

    // The second argument to useEffect tells React when to re-run the effect
    // Use an empty array to specify "only run on first render"
    // This works because signing into NEAR Wallet reloads the page
    []
  );

  // if not signed in, return early with sign-in prompt
  if (!window.walletConnection.isSignedIn()) {
    return (
      <main>
        <h1>
          <label
            htmlFor="greeting"
            style={{
              color: "var(--secondary)",
              borderBottom: "2px solid var(--secondary)",
            }}
          >
            {greeting}
          </label>
          Welcome to our App, PLEASE SIGN IN
        </h1>
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

  const [currentPage, setCurrentPage] = useState(PAGE.LANDING);

  useEffect(() => {
    console.log("currentPage: " + currentPage);
  }, [currentPage]);

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

      {showNotification && <Notification />}
    </>
  );
}

// this component gets rendered by App after the form is submitted
function Notification() {
  const { networkId } = getConfig(process.env.NODE_ENV || "development");
  const urlPrefix = `https://explorer.${networkId}.near.org/accounts`;

  return (
    <aside>
      <a
        target="_blank"
        rel="noreferrer"
        href={`${urlPrefix}/${window.accountId}`}
      >
        {window.accountId}
      </a>
      {
        " " /* React trims whitespace around tags; insert literal space character when needed */
      }
      called method: 'set_greeting' in contract:{" "}
      <a
        target="_blank"
        rel="noreferrer"
        href={`${urlPrefix}/${window.contract.contractId}`}
      >
        {window.contract.contractId}
      </a>
      <footer>
        <div>✔ Succeeded</div>
        <div>Just now</div>
      </footer>
    </aside>
  );
}
