import { useCallback, useState } from "react";
import { useTokenContract } from "../useContracts";
import { toast } from "react-toastify";
import { ErrorDecoder } from "ethers-decode-error";

// will contain write functions
export const useWriteFunctions = () => {
  const proposalContract = useTokenContract(true);
  const errorDecoder = ErrorDecoder.create();
  const [isVoting, setIsVoting] = useState(false);

  const vote = useCallback(
    async (proposalId: number) => {
      if (!proposalContract) return;
      try {
        setIsVoting(true);
        const voteTx = await proposalContract.vote(proposalId);
        const receipt = await voteTx.wait();
        return receipt.status === 1;
      } catch (error) {
        const decodedError = await errorDecoder.decode(error);
        toast.error(decodedError.reason);
        return false;
      } finally {
        setIsVoting(false);
      }
    },
    [proposalContract]
  );

  return { vote, isVoting };
};
