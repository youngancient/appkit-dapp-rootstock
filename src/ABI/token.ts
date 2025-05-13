export const TOKEN_ABI = [
  "function balances(address) view returns (uint256)",
  "function owner() view returns (address)",
  "function mintToken(uint256 amount, address to)",
  "function transferToken(uint256 amount, address to)",
  "function getTokenDetail() view returns (string _name, string _symbol, uint256 _currentSupply, uint256 _maxSupply)",
];
