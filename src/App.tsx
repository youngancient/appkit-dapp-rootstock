import { ToastContainer } from "react-toastify";
import "./App.css";
import "./connection.ts";
import { formatAddress } from "./utils.ts";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { useEffect, useState } from "react";
import {
  IProposal,
  useReadFunctions,
} from "./hooks/contractHook/useReadContract.ts";
import { ProposalCard } from "./components/ProposalCard.tsx";

function App() {
  const { isConnected, address } = useAppKitAccount();
  // controls popup of wallet connect monal
  const { open } = useAppKit();
  const { fetchProposals, isFetching } = useReadFunctions();

  const [proposals, setProposals] = useState<IProposal[] | null>(null);
  useEffect(() => {
    const loadProposals = async () => {
      if (!isConnected || !address) return;

      const result = await fetchProposals();
      if (result) {
        setProposals(result.filter((p): p is IProposal => p !== null));
      }
    };
    loadProposals();
  }, [isConnected, address]);
  return (
    <>
      <div className="img">
        <img src="/rootstock.png" className="logo" alt="Logo" />
      </div>
      <div className="">
        <button onClick={() => open()}>
          {isConnected ? formatAddress(address ?? "") : <>Connect Wallet</>}
        </button>
      </div>

      {isConnected && <h1>PROPOSALS</h1>}

      {isConnected && (
        <div className="mt">
          {isFetching ? (
            <p className="loading">Loading proposals...</p> // loading state
          ) : proposals === null || proposals.length === 0 ? (
            <p className="loading">No proposals found.</p>
          ) : (
            <div className="grid">
              {proposals.map((proposal, index) => (
                <ProposalCard key={index} {...proposal} id={index} />
              ))}
            </div>
          )}
        </div>
      )}

      <ToastContainer />
    </>
  );
}

export default App;