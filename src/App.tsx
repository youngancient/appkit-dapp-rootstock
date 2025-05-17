import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import "./connection.ts";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { formatAddress } from "./utils.ts";
import { useState } from "react";
import { ethers } from "ethers";

interface ITokenDetail {
  name: string;
  symbol: string;
  currentSupply: number;
  maxSupply: number;
}
function App() {
  const { isConnected, address } = useAppKitAccount();
  const [tokenDetail] = useState<ITokenDetail | null>(null);
  const [tokenBalance] = useState<number | null>(null);

  // controls popup of wallet connect monal
  const { open } = useAppKit();

  // mock loading state for read contract calls
  const [isLoadingBalance] = useState(false);
  const [isLoadingDetails] = useState(false);

  // mock loading state for write contract calls
  const [isMinting] = useState(false);
  const [isTransferring] = useState(false);

  return (
    <>
      <div className="img">
        <img src="/rootstock.png" className="logo" alt="" />
      </div>
      <div className="flex">
        <button onClick={() => open()}>
          {isConnected ? formatAddress(address ?? "") : <>Connect Wallet</>}
        </button>
      </div>
      <div className="flex mt">
        {isConnected && <p>Token Balance: {12000}</p>}
      </div>
      <div className="flex mt">
        <div>
          {isConnected ? (
            <div>
              {/* Token Balance Section */}
              {isLoadingBalance ? (
                <p>Loading balance...</p>
              ) : (
                <p>
                  Token Balance:{" "}
                  {tokenBalance != null
                    ? Number(
                        ethers.formatUnits(tokenBalance.toString(), 18)
                      ).toLocaleString()
                    : 0}
                </p>
              )}

              {/* Token Detail Section */}
              {isLoadingDetails ? (
                <p>Loading token details...</p>
              ) : (
                tokenDetail && (
                  <div>
                    <p>Token Name: {tokenDetail.name}</p>
                    <p>Token Symbol: {tokenDetail.symbol}</p>
                    <p>Token Current Supply: {tokenDetail.currentSupply}</p>
                    <p>MAX_SUPPLY: {tokenDetail.maxSupply}</p>
                  </div>
                )
              )}
            </div>
          ) : (
            <p>Please connect your wallet to see token details.</p>
          )}
        </div>
        <div className="flex-2">
          {isConnected && (
            <>
              {" "}
              <button onClick={() => console.log("call mint")}>
                {isMinting ? "Minting" : "Mint Token"}
              </button>
              <button onClick={() => console.log("calling transfer")}>
                {isTransferring ? "Sending" : "Transfer"}
              </button>
            </>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default App;
