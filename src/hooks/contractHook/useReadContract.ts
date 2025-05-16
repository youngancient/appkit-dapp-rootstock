import { toast } from "react-toastify";
import { useTokenContract } from "../useContracts";
import { useCallback } from "react";
import { useAppKitAccount } from "@reown/appkit/react";

// will contain read functions
export const useReadFunctions = () => {
  const tokenContract = useTokenContract();
  const { address } = useAppKitAccount();

  const getBalance = useCallback(async () => {
    if (!tokenContract) {
      toast.error("token contract not found!");
      return;
    }
    try {
      const balance = await tokenContract.balances(address);
      return balance;
    } catch (error) {
      toast.error("Failed to fetch balance");
      console.error(error);
      return null;
    }
  }, [tokenContract]);

  const getOwner = useCallback(async () => {
    if (!tokenContract) {
      toast.error("token contract not found!");
      return;
    }
    try {
      const owner = await tokenContract.owner();
      return owner;
    } catch (error) {
      toast.error("Failed to fetch token owner");
      console.error(error);
      return null;
    }
  }, [tokenContract]);

  const getTokenDetail = useCallback(async () => {
    if (!tokenContract) {
      toast.error("token contract not found!");
      return;
    }
    try {
      const [name, symbol, currentSupply, maxSupply] =
        await tokenContract.getTokenDetail();
      return { name, symbol, currentSupply, maxSupply };
    } catch (error) {
      toast.error("Failed to fetch token detail");
      console.error(error);
      return null;
    }
  }, [tokenContract]);

  return { getBalance, getOwner, getTokenDetail };
};
