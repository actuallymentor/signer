import { dev } from "../helpers";


export const tokens = [

    // Native ETH
    {
        symbol: 'ETH',
        chain_ids: dev ? [ 1, 5, 42161 ] : [ 1, 42161 ]
    },

    // USDC
    // {
    //     symbol: 'USDC',
    //     address: {
    //         1: `0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48`
    //     },
    //     chain_ids: [ 1 ]
    // }

]