import { dev } from "../helpers";
import { chain_ids } from "./chains";

const ethereum_chain_ids = dev ? [ chain_ids.ethereum, chain_ids.goerli ] : [ chain_ids.ethereum ]

export const tokens = [

    // Native ETH
    {
        symbol: 'ETH',
        chain_ids: [ ...ethereum_chain_ids, chain_ids.arbitrum_one ]
    },

    // USDC
    {
        symbol: 'USDC',
        decimals: 6,
        address: {
            [ chain_ids.ethereum ]: `0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48`,
            [ chain_ids.arbitrum_one ]: `0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8`,
            [ chain_ids.goerli ]: `0x07865c6E87B9F70255377e024ace6630C1Eaa37F`,
            [ chain_ids.polygon ]: `0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174`
        },
        chain_ids: [ ...ethereum_chain_ids, chain_ids.arbitrum_one, chain_ids.polygon ]
    }

]