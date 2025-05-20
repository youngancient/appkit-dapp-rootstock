import { useAppKitAccount } from "@reown/appkit/react";
import { useTokenContract } from "../useContracts";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { ethers } from "ethers";

// will contain write functions
export const useWriteFunctions = () => {
  const tokenContract = useTokenContract(true);
  const { address } = useAppKitAccount();
  const [isMinting, setIsMinting] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);

  const mintToken = useCallback(
    async (amount: string) => {
      if (!tokenContract) {
        toast.error("token contract not found!");
        return;
      }
      if (!address) {
        toast.error("address is not found!");
        return;
      }
      try {
        // call mint function
        setIsMinting(true);
        const amt = ethers.parseUnits(amount, 18);
        const mintTx = await tokenContract.mintToken(amt, address);
        const reciept = await mintTx.wait();
        return reciept.status === 1;
      } catch (error) {
        toast.error("Failed to fetch balance");
        console.error(error);
        return false;
      } finally {
        setIsMinting(false);
      }
    },
    [tokenContract, address]
  );

  const transferToken = useCallback(
    async (amount: string, receiver: string) => {
      if (!tokenContract) {
        toast.error("token contract not found!");
        return;
      }
      try {
        // call transfer function
        setIsTransferring(true);
        const amt = ethers.parseUnits(amount, 18);
        const transferTx = await tokenContract.transferToken(amt, receiver);
        const reciept = await transferTx.wait();
        return reciept.status === 1;
      } catch (error) {
        toast.error("Failed to fetch balance");
        console.error(error);
        return false;
      } finally{
        setIsTransferring(false);
      }
    },
    [tokenContract]
  );

  return { mintToken, transferToken, isMinting, isTransferring };
};
