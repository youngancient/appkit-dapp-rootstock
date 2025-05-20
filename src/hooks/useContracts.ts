import { useMemo } from "react";
import useRunners from "./useRunners";
import { Contract } from "ethers";
import { TOKEN_ABI } from "../ABI/token";
import { getAddress } from "ethers";

export const useTokenContract = (withSigner = false) => {
  const { readOnlyProvider, signer } = useRunners();

  return useMemo(() => {
    if (withSigner) {
      if (!signer) return null;
      return new Contract(
        getAddress(import.meta.env.VITE_TOKEN_CONTRACT_ADDRESS),
        TOKEN_ABI,
        signer
      );
    }
    return new Contract(
      getAddress(import.meta.env.VITE_TOKEN_CONTRACT_ADDRESS),
      TOKEN_ABI,
      readOnlyProvider
    );
  }, [readOnlyProvider, signer, withSigner]);
};
