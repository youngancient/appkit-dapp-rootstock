import { useMemo } from "react";
import useRunners from "./useRunners";
import { Contract } from "ethers";
import TOKEN_ABI from "../ABI/token.json";


export const useTokenContract = (withSigner = false) => {
    const { readOnlyProvider, signer } = useRunners();

    return useMemo(() => {
        if (withSigner) {
            if (!signer) return null;
            return new Contract(
                import.meta.env.VITE_TOKEN_CONTRACT_ADDRESS,
                TOKEN_ABI,
                signer
            );
        }
        return new Contract(
            import.meta.env.VITE_TOKEN_CONTRACT_ADDRESS,
            TOKEN_ABI,
            readOnlyProvider
        );
    }, [readOnlyProvider, signer, withSigner]);
};
