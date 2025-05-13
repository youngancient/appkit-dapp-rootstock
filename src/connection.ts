import { CaipNetwork, createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { rootstockTestnet as rawRootstock } from "@reown/appkit/networks";


// 1. Get projectId
const projectId = import.meta.env.VITE_APPKIT_PROJECT_ID;

export const rootstockTestnet: CaipNetwork = {
  ...rawRootstock,
  id: 31,
  chainNamespace: "eip155",
  caipNetworkId: "eip155:31",
};

// 2. Set the networks
const networks: [CaipNetwork, ...CaipNetwork[]] = [
  rootstockTestnet,
];

// 3. Create a metadata object - optional
const metadata = {
  name: "Token Minting Dapp",
  description: "A token minting dapp built on Rootstock",
  url: "https://mywebsite.com",
  icons: ["https://avatars.mywebsite.com/"],
};

// 4. Create a AppKit instance
export const appkit = createAppKit({
  adapters: [new EthersAdapter()],
  networks,
  metadata,
  projectId,
  allowUnsupportedChain: false,
  allWallets: "SHOW",
  defaultNetwork: rootstockTestnet,
  enableEIP6963: true,
  features: {
    analytics: true,
    allWallets: true,
    email: false,
    socials: [],
  },
});

appkit.switchNetwork(rootstockTestnet);