import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import "./connection.ts";
import { useAppKitAccount } from "@reown/appkit/react";
import { formatAddress } from "./utils.ts";

function App() {
  const { isConnected, address } = useAppKitAccount();
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
      <ToastContainer />
    </>
  );
}

export default App;
