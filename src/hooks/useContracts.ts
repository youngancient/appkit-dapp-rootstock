import { useMemo } from "react";
import useRunners from "./useRunners";
import { Contract } from "ethers";
import { proposalVotingABI } from "../ABI/proposal";

export const useTokenContract = (withSigner = false) => {
  const { readOnlyProvider, signer } = useRunners();

  return useMemo(() => {
    if (withSigner) {
      if (!signer) return null;
      return new Contract(
        import.meta.env.VITE_PROPOSAL_CONTRACT_ADDRESS,
        proposalVotingABI,
        signer
      );
    }
    return new Contract(
      import.meta.env.VITE_PROPOSAL_CONTRACT_ADDRESS,
      proposalVotingABI,
      readOnlyProvider
    );
  }, [readOnlyProvider, signer, withSigner]);
};
