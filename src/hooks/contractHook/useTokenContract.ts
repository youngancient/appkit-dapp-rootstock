import { useCallback, useEffect, useState } from "react";
import { useTokenContract } from "../useContracts";
import { useAppKitAccount } from "@reown/appkit/react";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import { formatAddress } from "../../utils";


interface TokenDetail {
  name: string;
  decimals: number;
  symbol: string;
}

export const useTokenFunctions = () => {
  const [tokenBalance, setTokenBalance] = useState<bigint | null>(null);
  const [tokenDetail, setTokenDetail] = useState<TokenDetail | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [isMinting, setIsMinting] = useState(false);

  const [isTransferring, setIsTransferring] = useState(false);

  const { address } = useAppKitAccount();
  // read only contract object
  const readOnlyTokenContract = useTokenContract();

  // write contract object
  const tokenContract = useTokenContract(true);

  const resetState = () => {
    setTokenDetail(null);
    setTokenBalance(null);
  };

  const fetchTokenData = useCallback(async () => {
    if (!readOnlyTokenContract) {
      resetState();
      return;
    }
    if (!address) {
      // toast.error("Please connect your wallet");
      resetState();
      return;
    }
    try {
      setIsLoading(true);
      // fetch token details from contract
      const balance = await readOnlyTokenContract.balanceOf(address);
      const name = await readOnlyTokenContract.name();
      const symbol = await readOnlyTokenContract.symbol();
      const decimals = await readOnlyTokenContract.decimals();

      setTokenBalance(balance);
      setTokenDetail({ name, symbol, decimals: Number(decimals) });
    } catch (error) {
      resetState();
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [readOnlyTokenContract, address]);

  const mint = useCallback(async () => {
    if (!address) {
      toast.error("Please connect your wallet");
      resetState();
      return;
    }
    if (!tokenContract) {
      return;
    }
    try {
      setIsMinting(true);
      // call mint function from contract
      const amount = ethers.parseUnits("1000", 18);
      const tx = await tokenContract.mint(amount, {
        gasLimit: 1000000,
      });
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        console.log(receipt, "receipt");
        toast.success(`Minted ${ethers.formatUnits(amount, 18)} tokens`);
        fetchTokenData();
        return;
      }
    } catch (error) {
      toast.error("Error minting token");
      console.log(error);
    } finally {
      setIsMinting(false);
    }
  }, [address, fetchTokenData, tokenContract]);

  const transfer = useCallback(async () => {
    if (!address) {
      toast.error("Please connect your wallet");
      resetState();
      return;
    }
    if (!tokenContract) {
      return;
    }
    try {
      setIsTransferring(true);
      // call transfer function
      const to = "0x1234567890123456789012345678901234567890"; // Change to any address, or could be based on input
    
      const amount = ethers.parseUnits("1000", 18);
      const tx = await tokenContract.transfer(to, amount, {
        gasLimit: 1000000,
      });
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        console.log(receipt, "receipt");
        toast.success(
          `Sent ${ethers.formatUnits(
            amount,
            18
          )} tokens to ${formatAddress(to)}`
        );
        fetchTokenData();
        return;
      }
    } catch (error) {
      toast.error("Error transferring token");
      console.log(error);
    } finally {
      setIsTransferring(false);
    }
  }, [address, tokenContract,fetchTokenData]);

  useEffect(() => {
    fetchTokenData();
  }, [fetchTokenData]);

  return {
    isLoading,
    tokenBalance,
    tokenDetail,
    mint,
    transfer,
    isMinting,
    isTransferring,
  };
};
