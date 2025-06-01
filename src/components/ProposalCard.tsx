import { useAppKitAccount } from "@reown/appkit/react";
import {
  IProposal,
  useReadFunctions,
} from "../hooks/contractHook/useReadContract";
import { formatAddress } from "../utils";
import { useEffect, useState } from "react";
import { useWriteFunctions } from "../hooks/contractHook/useWriteContract";
import { toast } from "react-toastify";

interface ProposalFunc extends IProposal {
  id: number;
}
export const ProposalCard: React.FC<ProposalFunc> = ({
  description,
  recipient,
  amount,
  voteCount,
  minVotesToPass,
  executed,
  id,
}) => {
  const { address } = useAppKitAccount();
  const { isChecking, checkHasVotedForProposal } = useReadFunctions();
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const checkFunction = async () => {
      const hasVoted = await checkHasVotedForProposal(id);
      setHasVoted(hasVoted);
    };
    checkFunction();
  }, [address]);

  const { vote, isVoting } = useWriteFunctions();
  const handleVoting = async () => {
    const hasVoted = await vote(id);
    if (!hasVoted) return;
    toast.success("voted successfully!");
  };
  return (
    <div className="card" key={id}>
      <h3>Proposal {id + 1}</h3>
      <p>
        <strong>Description:</strong> {description}
      </p>
      <p>
        <strong>Recipient:</strong> {formatAddress(recipient)}
      </p>
      <p>
        <strong>Amount:</strong> {amount}
      </p>
      <p>
        <strong>Vote Count:</strong> {voteCount}
      </p>
      <p>
        <strong>Min Votes to Pass:</strong> {minVotesToPass}
      </p>
      <p>
        <strong>Executed:</strong> {executed ? "Yes" : "No"}
      </p>
      <button
        className="wide-button"
        disabled={hasVoted || isChecking || isVoting}
        onClick={handleVoting}
      >
        {isChecking
          ? "Checking..."
          : isVoting
          ? "Voting..."
          : hasVoted
          ? "Voted"
          : "Vote"}
      </button>
    </div>
  );
};
