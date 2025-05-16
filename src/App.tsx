import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import "./connection.ts";
import { useAppKitAccount } from "@reown/appkit/react";
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
        {isConnected && (
          <button onClick={() => console.log("hello world")}>Send Token</button>
        )}
      </div>
      <div className="flex mt">
        <div>
          {isConnected ? (
            isLoadingBalance ? (
              <p>Loading...</p>
            ) : (
              <div>
                <p>
                  Token Balance:{" "}
                  {tokenBalance != null
                    ? Number(
                        ethers.formatUnits(tokenBalance.toString(), 18)
                      ).toLocaleString()
                    : 0}
                </p>
                <p>Token Name: {tokenDetail?.name}</p>
                <p>Token symbol: {tokenDetail?.symbol}</p>
                <p>Token currentSupply: {tokenDetail?.currentSupply}</p>
                <p>MAX_SUPPLY: {tokenDetail?.maxSupply}</p>
              </div>
            )
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
