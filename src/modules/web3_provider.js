// Rainbow components
import '@rainbow-me/rainbowkit/styles.css'
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'

// WAGMI components
import { WagmiConfig, createClient, configureChains } from 'wagmi'
import { mainnet, goerli, arbitrum, polygon } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { log } from './helpers'

const { name } = require( '../../package.json' )

/* ///////////////////////////////
// Chain configuration
// /////////////////////////////*/
const { REACT_APP_alchemy_eth_mainnet_api_key, REACT_APP_alchemy_arbitrum_mainnet_api_key, REACT_APP_alchemy_polygon_mainnet_api_key } = process.env

// Select chains 
const enabled_chains = [ mainnet, goerli, arbitrum, polygon ]

// Cnfigure connectors 
const enabled_providers = [

    // Backup provider to the built-in one
    ... REACT_APP_alchemy_eth_mainnet_api_key ? [ alchemyProvider( { apiKey: REACT_APP_alchemy_eth_mainnet_api_key } ) ] : [] ,
    ... REACT_APP_alchemy_arbitrum_mainnet_api_key ? [ alchemyProvider( { apiKey: REACT_APP_alchemy_arbitrum_mainnet_api_key } ) ] : [] ,
    ... REACT_APP_alchemy_polygon_mainnet_api_key ? [ alchemyProvider( { apiKey: REACT_APP_alchemy_polygon_mainnet_api_key } ) ] : [] ,

    // The provider already exposed in this user's browser
    publicProvider()

]

log( `Set up provider with ${ enabled_chains.length } chains and ${ enabled_providers.length } providers: `, enabled_chains, enabled_providers )
const { chains, provider } = configureChains( enabled_chains, enabled_providers )

/* ///////////////////////////////
// Rainbow configuration
// /////////////////////////////*/
const { connectors } = getDefaultWallets( {
    appName: name,
    chains
} )

/* ///////////////////////////////
// Wagmi client
// /////////////////////////////*/
const wagmiClient = createClient( {
    autoConnect: false,
    provider,
    connectors
} )

export default props => <WagmiConfig client={ wagmiClient }>
    <RainbowKitProvider coolMode chains={ chains } { ...props } />
</WagmiConfig>