import { toast } from "react-toastify";
import { useTokenContract } from "../useContracts";
import { useCallback, useState } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import { ethers } from "ethers";

// will contain read functions
export const useReadFunctions = () => {
  const tokenContract = useTokenContract();
  const { address } = useAppKitAccount();
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const getBalance = useCallback(async () => {
    if (!tokenContract) {
      toast.error("token contract not found!");
      return;
    }
    if (!address) {
      toast.error("address is not found!");
      return;
    }
    try {
      const balance = await tokenContract.balances(address);
      return ethers.formatUnits(balance, 18);
    } catch (error) {
      toast.error("Failed to fetch balance");
      console.error(error);
      return null;
    }
  }, [tokenContract, address]);

  const getOwner = useCallback(async () => {
    if (!tokenContract) {
      toast.error("token contract not found!");
      return;
    }
    try {
      setIsLoadingBalance(true);
      const owner = await tokenContract.owner();
      return owner;
    } catch (error) {
      toast.error("Failed to fetch token owner");
      console.error(error);
      return null;
    } finally {
      setIsLoadingBalance(false);
    }
  }, [tokenContract]);

  const getTokenDetail = useCallback(async () => {
    if (!tokenContract) {
      toast.error("token contract not found!");
      return;
    }
    try {
      setIsLoadingDetails(true);
      const [name, symbol, currentSupply, maxSupply] =
        await tokenContract.getTokenDetail();
      return {
        name,
        symbol,
        currentSupply: ethers.formatUnits(currentSupply, 18),
        maxSupply: ethers.formatUnits(maxSupply, 18),
      };
    } catch (error) {
      toast.error("Failed to fetch token detail");
      console.error(error);
      return null;
    } finally {
      setIsLoadingDetails(false);
    }
  }, [tokenContract]);

  return {
    getBalance,
    getOwner,
    getTokenDetail,
    isLoadingBalance,
    isLoadingDetails,
  };
};
