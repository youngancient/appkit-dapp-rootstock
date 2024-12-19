import {
  useAppKit,
  useAppKitAccount,
  useAppKitNetwork,
  useAppKitProvider,
} from "@reown/appkit/react";
import "./App.css";
import "./connection.ts";
import { BrowserProvider, Eip1193Provider, ethers } from "ethers";
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState, useCallback } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useTokenFunctions } from "./hooks/contractHook/useTokenContract.ts";
import { formatAddress } from "./utils.ts";

function App() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const [bal, setBal] = useState<string | null>("0");
  const { walletProvider } = useAppKitProvider("eip155");
  const { chainId } = useAppKitNetwork();
  // test sign message

  const onSignMessage = async () => {
    if (!address) {
      toast.error("Please connect wallet");
      return;
    }
    const provider = new BrowserProvider(walletProvider as Eip1193Provider);
    const signer = await provider.getSigner();
    const message = "Hello, this is Appkit Example";
    try {
      const signature = await signer?.signMessage(message);
      // signature, address , message -> you can send this to your backend
      console.log({ signature, address, message });
    } catch (error) {
      console.log(error);
    }
  };

  // send kaia to another address
  const onSendKaia = async () => {
    console.log(chainId);
    if (!address) {
      toast.error("Please connect wallet");
      return;
    }
    if (chainId !== 1001) {
      toast.error("Please connect to Kaia network");
      return;
    }
    const provider = new BrowserProvider(walletProvider as Eip1193Provider);
    const signer = await provider.getSigner();

    const to = "0x1234567890123456789012345678901234567890"; // Change to any address, or could be based on input

    const amount = "1000000000000000000"; // 1 kaia
    try {
      const tx = await signer?.sendTransaction({
        to,
        value: amount,
      });
      tx.wait();
      console.log(tx);
      toast.success(
        `${ethers.formatEther(amount)} KAIA sent to ${formatAddress(to)}`
      );
      getKaiaBalance();
    } catch (error) {
      console.log(error);
    }
  };

  const getKaiaBalance = useCallback(async () => {
    if (!address) return;
    if (chainId !== 1001) {
      return;
    }
    try {
      const provider = new BrowserProvider(walletProvider as Eip1193Provider);

      // Get the balance of the given address
      const balance = await provider.getBalance(address);

      // Convert the balance from wei to ether (Kaia)
      const formattedBalance = ethers.formatEther(balance);
      setBal(formattedBalance);
      console.log(`Balance of ${address}: ${formattedBalance} Kaia`);
    } catch (error) {
      console.error("Error fetching balance:", error);
      setBal(null);
    }
  }, [address, walletProvider, chainId]);

  useEffect(() => {
    getKaiaBalance();
  }, [address, getKaiaBalance]);

  // read from contract
  const {
    isLoading,
    tokenBalance,
    tokenDetail,
    mint,
    transfer,
    isMinting,
    isTransferring,
  } = useTokenFunctions();

  return (
    <>
      <div className="img">
        <img src="/kaia.png" className="logo" alt="" />
      </div>
      <div className="flex">
        <button onClick={() => open()}>
          {isConnected ? formatAddress(address ?? "") : <>Connect Wallet</>}
        </button>
        {isConnected && <button onClick={onSignMessage}>Sign Message</button>}
      </div>
      <div className="flex mt">
        {isConnected && <p>Kaia Balance: {bal}</p>}
        {isConnected && <button onClick={onSendKaia}>Send Kaia</button>}
      </div>
      <div className="flex mt">
        <div>
          {isConnected ? (
            isLoading ? (
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
                <p>Token Decimal: {tokenDetail?.decimals}</p>
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
              <button onClick={() => mint()}>
                {isMinting ? "Minting" : "Mint Token"}
              </button>
              <button onClick={() => transfer()}>
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
