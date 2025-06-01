export const proposalVotingABI = [
  "function createProposal(string _description, address _recipient, uint256 _amount, uint256 _minVotesToPass) external",
  "function vote(uint256 _proposalId) external",
  "function executeProposal(uint256 _proposalId) external",
  "function proposalCount() view returns (uint256)",
  "function proposals(uint256) view returns (string description, address recipient, uint256 amount, uint256 voteCount, uint256 minVotesToPass, bool executed)",
  "function hasVoted(address, uint256) view returns (bool)",
];
