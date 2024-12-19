export const formatAddress = (walletAddress: string): string => {
    const firstPart = walletAddress.slice(0, 4);
    const lastPart = walletAddress.slice(-6);
    return `${firstPart}...${lastPart}`;
  };