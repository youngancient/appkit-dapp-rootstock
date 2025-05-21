import { useAppKitAccount } from "@reown/appkit/react";
import { useTokenContract } from "../useContracts";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import { ErrorDecoder, DecodedError } from "ethers-decode-error";

// will contain write functions
export const useWriteFunctions = () => {
  const tokenContract = useTokenContract(true);
  const { address } = useAppKitAccount();
  const [isMinting, setIsMinting] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const errorDecoder = ErrorDecoder.create();

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
        console.error(error);
        const decodedError: DecodedError = await errorDecoder.decode(error);
        toast.error(decodedError.reason);
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
        const decodedError: DecodedError = await errorDecoder.decode(error);
        toast.error(decodedError.reason);
        return false;
      } finally {
        setIsTransferring(false);
      }
    },
    [tokenContract]
  );

  return { mintToken, transferToken, isMinting, isTransferring };
};
