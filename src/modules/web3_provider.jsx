// Rainbow components
import '@rainbow-me/rainbowkit/styles.css'
import { connectorsForWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { coinbaseWallet, injectedWallet, metaMaskWallet, rainbowWallet, safeWallet, trustWallet, walletConnectWallet, } from '@rainbow-me/rainbowkit/wallets'

// WAGMI components
import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { mainnet, arbitrum, polygon } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

import { log } from './helpers'

/* ///////////////////////////////
// Chain configuration
// /////////////////////////////*/
const {
    VITE_eth_goerli_alchemy_api_key,
    VITE_eth_mainnet_alchemy_api_key,
    VITE_arbitrum_mainnet_alchemy_api_key,
    VITE_polygon_mainnet_alchemy_api_key,
    VITE_walletconnect_projectid,
    VITE_optimism_mainnet_alchemy_api_key,
    VITE_base_mainnet_alchemy_api_key
} = import.meta.env

// Select chains 
const enabled_chains = [ mainnet, arbitrum, polygon ]

// Cnfigure connectors 
const enabled_providers = [

    // Backup provider to the built-in one
    ... VITE_eth_goerli_alchemy_api_key ? [ alchemyProvider( { apiKey: VITE_eth_goerli_alchemy_api_key } ) ] : [] ,
    ... VITE_eth_mainnet_alchemy_api_key ? [ alchemyProvider( { apiKey: VITE_eth_mainnet_alchemy_api_key } ) ] : [] ,
    ... VITE_arbitrum_mainnet_alchemy_api_key ? [ alchemyProvider( { apiKey: VITE_arbitrum_mainnet_alchemy_api_key } ) ] : [] ,
    ... VITE_polygon_mainnet_alchemy_api_key ? [ alchemyProvider( { apiKey: VITE_polygon_mainnet_alchemy_api_key } ) ] : [] ,
    ... VITE_optimism_mainnet_alchemy_api_key ? [ alchemyProvider( { apiKey: VITE_optimism_mainnet_alchemy_api_key } ) ] : [] ,
    ... VITE_base_mainnet_alchemy_api_key ? [ alchemyProvider( { apiKey: VITE_base_mainnet_alchemy_api_key } ) ] : [] ,

    // The provider already exposed in this user's browser
    publicProvider()

]

const { chains, publicClient, webSocketPublicClient } = configureChains( enabled_chains, enabled_providers )
log( `Set up provider with ${ enabled_chains.length } chains and ${ enabled_providers.length } providers: `, enabled_chains, enabled_providers )

/* ///////////////////////////////
// Rainbow configuration
// /////////////////////////////*/
const projectId = VITE_walletconnect_projectid

const connectors = connectorsForWallets( [
    {
        groupName: 'Popular wallets',
        wallets: [
            metaMaskWallet( { projectId, chains } ),
            walletConnectWallet( { projectId, chains } ),
            safeWallet( { chains } ),
            injectedWallet( { chains } ),
        ]
    },
    {
        groupName: 'Other wallets',
        wallets: [
            trustWallet( { projectId, chains } ),
            coinbaseWallet( { projectId, chains } ),
            rainbowWallet( { projectId, chains } )
        ]
    }
] )

/* ///////////////////////////////
// Wagmi client
// /////////////////////////////*/
const wagmi_config = createConfig( {
    autoConnect: false,
    publicClient,
    webSocketPublicClient,
    connectors
} )

export default props => <WagmiConfig config={ wagmi_config }>
    <RainbowKitProvider coolMode chains={ chains } { ...props } />
</WagmiConfig>