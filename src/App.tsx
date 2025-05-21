import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import "./connection.ts";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { formatAddress } from "./utils.ts";
import { useCallback, useEffect, useState } from "react";
import { useReadFunctions } from "./hooks/contractHook/useReadContract.ts";
import { useWriteFunctions } from "./hooks/contractHook/useWriteContract.ts";

interface ITokenDetail {
  name: string;
  symbol: string;
  currentSupply: string;
  maxSupply: string;
}
function App() {
  const { isConnected, address } = useAppKitAccount();
  const [tokenDetail, setTokenDetail] = useState<ITokenDetail | null>(null);
  const [tokenBalance, setTokenBalance] = useState<string | null>(null);

  // controls popup of wallet connect monal
  const { open } = useAppKit();

  const { getBalance, getTokenDetail, isLoadingBalance, isLoadingDetails } =
    useReadFunctions();

  const fetchData = useCallback(async () => {
    const bal = await getBalance();
    const detail = await getTokenDetail();
    if (!bal || !detail) return;
    setTokenBalance(bal);
    setTokenDetail(detail);
  }, [getBalance, getTokenDetail]);

  useEffect(() => {
    if (!isConnected || !address) {
      return;
    }
    fetchData();
  }, [isConnected, address, fetchData]);

  const { mintToken, transferToken, isMinting, isTransferring } =
    useWriteFunctions();

  const handleMinting = async () => {
    const amount = "1000";
    const isMintingSuccessful = await mintToken(amount);
    if (!isMintingSuccessful) {
      toast.error("Minting Failed!!!");
      return;
    }
    toast.success("Minting successful!");
    fetchData();
  };

  const handleTransfer = async () => {
    const amount = "1000";
    const receiver = "0xd3e0d7fa9ac7253c18ccac87f643e61baf1da3ea";
    const isTransferSuccessful = await transferToken(amount, receiver);
    if (!isTransferSuccessful) {
      toast.error("Transfer Failed!!!");
      return;
    }
    toast.success("Transfer Successful!");
    fetchData();
  };

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
      <div className="flex mt">
        <div>
          {isConnected ? (
            <div>
              {/* Token Balance Section */}
              {isLoadingBalance ? (
                <p>Loading balance...</p>
              ) : (
                <p>Token Balance: {tokenBalance != null ? tokenBalance : 0}</p>
              )}

              {/* Token Detail Section */}
              {isLoadingDetails ? (
                <p>Loading token details...</p>
              ) : tokenDetail != null ? (
                <div>
                  <p>Token Name: {tokenDetail.name}</p>
                  <p>Token Symbol: {tokenDetail.symbol}</p>
                  <p>Token Current Supply: {tokenDetail.currentSupply}</p>
                  <p>MAX_SUPPLY: {tokenDetail.maxSupply}</p>
                </div>
              ) : (
                <div>
                  <p>Token Name: None</p>
                  <p>Token Symbol: None</p>
                  <p>Token Current Supply: 0</p>
                  <p>MAX_SUPPLY: 0</p>
                </div>
              )}
            </div>
          ) : (
            <p>Please connect your wallet to see token details.</p>
          )}
        </div>
        <div className="flex-2">
          {isConnected && (
            <>
              <button onClick={handleMinting} disabled={isMinting}>
                {isMinting ? "Minting" : "Mint Token"}
              </button>
              <button onClick={handleTransfer} disabled={isTransferring}>
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
