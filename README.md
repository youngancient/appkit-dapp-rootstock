# Token Minting dApp

This is a React + TypeScript + Vite dApp that interacts with a [Deployed Token contract on Rootstock Testnet](https://rootstock-testnet.blockscout.com/address/0x2ad44265185A6E739B53cbF6b190B43726553627#code). Users can connect their wallet and claim test tokens on the Rootstock network.

---

## 🚀 Project Overview

- Connect your wallet (MetaMask, Rabby, etc.)
- Switch to Rootstock Testnet
- Claim free test tokens from a deployed contract

Built with:
- React
- TypeScript
- Vite
- ethers.js

---

## ⚙️ Setup & Run Instructions

1. Clone the repo: `git clone https://github.com/yourusername/free-token-dapp.git`
2. Navigate to the folder: `cd free-token-dapp`
3. Install dependencies: `npm install`
4. Get the `.env` ready following the `.env.example`
5. Start the app: `npm run dev`
6. Build for production: `npm run build`


---

## 🌐 Rootstock Testnet Configuration

To use the dApp, your wallet must be connected to the Rootstock Testnet. This network simulates the Rootstock mainnet using test BTC (tRBTC), allowing safe development and testing.

### Wallet Configuration (MetaMask, Rabby, etc.)

You can add the Rootstock Testnet manually or via [Chainlist](https://chainlist.org/). To add it manually, use the following details:

- **Network Name**: Rootstock Testnet  
- **RPC URL**: https://public-node.testnet.rsk.co  
- **Chain ID**: 31  
- **Currency Symbol**: tRBTC  
- **Block Explorer URL**: https://explorer.testnet.rsk.co/

⚠️ Public RPCs may occasionally timeout due to high traffic. For a more stable experience, consider using a provider like Alchemy or Infura.

### Get Test Funds

You can request free tRBTC for testing from the official Rootstock faucet:

- [https://faucet.rsk.co/](https://faucet.rsk.co/)

---

## 🔗 Useful Links

- Smart Contract (Free Token): https://rootstock-testnet.blockscout.com/address/0x2ad44265185A6E739B53cbF6b190B43726553627#code  
- Rootstock Faucet: https://faucet.rsk.co/  
- RSK Testnet Explorer: https://explorer.testnet.rsk.co  
- Reown Documentation: https://docs.reown.dev
