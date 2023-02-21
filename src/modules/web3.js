import { log, wait } from './helpers'

// Ethers and web3 sdk
import { ethers } from "ethers"
import { useDisconnect, useEnsName } from 'wagmi'
import { useEffect, useState } from 'react'
const { providers: { Web3Provider }, utils } = ethers

/* ///////////////////////////////
// Signing
// /////////////////////////////*/
function getSigner() {
    const provider = getProvider()
    return provider && provider.getSigner()
}

function getProvider() {
    const provider = window.ethereum && new Web3Provider( window.ethereum )
    return provider
}


export async function sign_message( claimed_message, claimed_signatory, parent_signer ) {

    const signer = parent_signer || getSigner()
    log( parent_signer, signer )
    if( !signer ) throw new Error( `Can't connect to wallet, please make sure you're connected` )
    const signed_message = await signer.signMessage( claimed_message )
    const formatted_signature = {
        claimed_message,
        signed_message,
        claimed_signatory
    }

    log( `Signed `, formatted_signature )
    return formatted_signature

}

export async function verify_message( claimed_message, signed_message, claimed_signatory ) {

    try {

        log( `Verifying claimed message `, claimed_message, ` on behalf of `, claimed_signatory )

        // Check that the signed message equals the claimed message
        const confirmed_signatory = utils.verifyMessage( claimed_message, signed_message ).toLowerCase()

        // Verify that the claimed signatory is the one that signed the message
        const message_valid = confirmed_signatory.toLowerCase() === claimed_signatory.toLowerCase()

        log( `Message was signed by ${ confirmed_signatory }, valid: `, message_valid )

        // Verify that the claimed signatory is the one that signed the message
        return message_valid


    } catch ( e ) {

        log( `Verification error: `, e )
        return false

    }

}

export function useDisconnectWallets( reload_page=true, clear_cache=true ) {

    const { disconnect } = useDisconnect()

    return function() {

        // Defautl wagmi disconnect
        disconnect()

        // Clear localstorage of caches
        if( !window.localStorage ) return
        if( clear_cache ) {
            window.localStorage.removeItem( 'walletconnect' )
            window.localStorage.removeItem( 'wagmi.store' )
            window.localStorage.removeItem( 'wagmi.cache' )
            window.localStorage.removeItem( 'wagmi.wallet' )
        }
        if( reload_page ) window?.location?.reload()

    }


}


export function useENS( address ) {

    const [ internal_ENS, set_internal_ENS ] = useState( '' )
    const { data: wagmi_ENS } = useEnsName( { address: address?.toLowerCase(), chainId: 1 } )

    // Set ENS based on wagmi
    useEffect( () => {
        if( wagmi_ENS ) {
            log( `Setting ENS ${ wagmi_ENS } based on wagmi hook` )
            return set_internal_ENS( wagmi_ENS )
        }
    }, [ wagmi_ENS ] )

    // If no wagmi ENS, try to get it manually
    useEffect( (  ) => {

        // No need to continue if Wagmi got the ENS
        if( wagmi_ENS || !address ) return
        let cancelled = false;
	
        ( async () => {
	
            try {
	
                // Wait for a second to give wagmi time to resolve the ENS
                await wait( 2000 )

                // Manually attempt to get the ENS
                log( `Manually getting ENS` )
                const ENS = await ens_from_address( address )
                if( cancelled ) return
                if( wagmi_ENS ) return
                if( ENS ) {
                    log( `Setting ENS ${ ENS } based on manual resolution` )
                    return set_internal_ENS( ENS.toLowerCase() )
                }
	
            } catch ( e ) {
                log( `Error getting ENS: `, e )
            }
	
        } )( )
	
        return () => cancelled = true
	
    }, [ wagmi_ENS, address ] )

    return internal_ENS

}

export async function ens_from_address( address ) {

    try {	

        if( !address ) return false
        const provider = getProvider()
        if( !provider ) return false
        const ens = await provider.lookupAddress( address )
        return ens

    } catch ( e ) {
        log( `Error resolving ENS `, e )
        return false
    }

}