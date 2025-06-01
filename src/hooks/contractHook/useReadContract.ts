import { useCallback, useState } from "react";
import { useTokenContract } from "../useContracts";
import { Contract, formatEther, Interface } from "ethers";
import useRunners from "../useRunners";
import { proposalVotingABI } from "../../ABI/proposal";
import { toast } from "react-toastify";
import { ErrorDecoder } from "ethers-decode-error";
import { useAppKitAccount } from "@reown/appkit/react";

// interfaces

interface Call {
  target: string;
  callData: string;
}
interface Result {
  success: boolean;
  returnData: string;
}

export interface IProposal {
  description: string;
  recipient: string;
  amount: string;
  voteCount: number;
  minVotesToPass: number;
  executed: boolean;
}

// will contain read functions
export const useReadFunctions = () => {
  const readOnlyProposalContract = useTokenContract();
  const { readOnlyProvider } = useRunners();

  const [isFetching, setIsFetching] = useState(false);
  const errorDecoder = ErrorDecoder.create();
  const { address } = useAppKitAccount();

  const multiCallABI = [
    "function tryAggregate(bool requireSuccess, (address target, bytes callData)[] calls) returns ((bool success, bytes returnData)[] returnData)",
  ];
  const multicallContract = new Contract(
    import.meta.env.VITE_ROOTSTOCK_MULTICALL_ADDRESS.toLowerCase(),
    multiCallABI,
    readOnlyProvider
  );

  const fetchProposals = useCallback(async (): Promise<
    (IProposal | null)[] | null | undefined
  > => {
    if (!readOnlyProposalContract) return;
    if (!multicallContract) return;

    const iface = new Interface(proposalVotingABI);
    try {
      setIsFetching(true);
      const proposalNo = await readOnlyProposalContract.proposalCount();
      const proposalIdArray = Array.from(
        { length: Number(proposalNo) },
        (_, i) => i
      );

      const calls: Call[] = proposalIdArray.map(
        (id: number): Call => ({
          target: import.meta.env.VITE_PROPOSAL_CONTRACT_ADDRESS,
          callData: iface.encodeFunctionData("proposals", [id]),
        })
      );

      const results = await multicallContract.tryAggregate.staticCall(
        true,
        calls
      );

      const decoded: (IProposal | null)[] = results.map(
        (res: Result, idx: number): IProposal | null => {
          if (!res.success) {
            console.warn(
              `Call failed for proposal Id: ${proposalIdArray[idx]}`
            );
            return null;
          }

          const [
            description,
            recipient,
            amount,
            voteCount,
            minVotesToPass,
            executed,
          ] = iface.decodeFunctionResult("proposals", res.returnData);

          return {
            description,
            recipient,
            amount: formatEther(amount),
            voteCount: Number(voteCount),
            minVotesToPass: Number(minVotesToPass),
            executed,
          };
        }
      );

      return decoded;
    } catch (error) {
      const decodedError = await errorDecoder.decode(error);
      toast.error(decodedError.reason);
      return null;
    } finally {
      setIsFetching(false);
    }
  }, [readOnlyProposalContract, multicallContract]);

  const [isChecking, setIsChecking] = useState(false);

  const checkHasVotedForProposal = useCallback(
    async (proposalId: number) => {
      if (!readOnlyProposalContract) return;
      try {
        setIsChecking(true);
        const hasVotedForProposal = await readOnlyProposalContract.hasVoted(
          address,
          proposalId
        );
        return hasVotedForProposal;
      } catch (error) {
        const decodedError = await errorDecoder.decode(error);
        toast.error(decodedError.reason);
        return false;
      } finally {
        setIsChecking(false);
      }
    },
    [readOnlyProposalContract, address]
  );

  return { fetchProposals, isFetching, checkHasVotedForProposal, isChecking };
};
