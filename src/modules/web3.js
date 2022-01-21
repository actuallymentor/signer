import { log, setListenerAndReturnUnlistener } from './helpers'
import { useState, useEffect } from "react"

// Ethers and web3 sdk
import { ethers } from "ethers"
const { providers: { Web3Provider }, Contract, utils } = ethers

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


export async function sign_message( claimed_message, claimed_signatory ) {

	const signer = getSigner()
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
		const message_valid = confirmed_signatory === claimed_signatory

		log( `Message was signed by ${ confirmed_signatory }, valid: `, message_valid )

		// Verify that the claimed signatory is the one that signed the message
		return message_valid


	} catch( e ) {

		log( `Verification error: `, e )
		return false

	}

}

// ///////////////////////////////
// Wallet interactors
// ///////////////////////////////

export function useIsConnected() {

	// Check for initial status
	const [ isConnected, setIsConnected ] = useState( window.ethereum?.isConnected() )

	// Listen to disconnects
	useEffect( f => setListenerAndReturnUnlistener( window.ethereum, 'disconnect', f => setIsConnected( false ) ), [] )

	// Listen to connects
	useEffect( f => setListenerAndReturnUnlistener( window.ethereum, 'connect', f => setIsConnected( true ) ), [] )

	return isConnected

}

// Get address through metamask
export async function getAddress() {

	// Check if web3 is exposed
	if( !window.ethereum ) throw new Error( 'No web3 provider detected, please install metamask' )

	// Get the first address ( which is the selected address )
	const [ address ] = await window.ethereum.request( { method: 'eth_requestAccounts' } )

	if( !window.ethereum.isConnected() ) throw new Error( 'Please connect an account' )

	return address

}

// Address hook
export function useAddress() {

	const [ address, setAddress ] = useState( window.ethereum?.selectedAddress )
	const isConnected = useIsConnected()

	// Set initial value if known
	useEffect( f => {
		log( 'useAddress setting: ', window.ethereum && window.ethereum.selectedAddress, ` based on `, window.ethereum )
		if( window.ethereum && window.ethereum.selectedAddress ) {
			setAddress( window.ethereum.selectedAddress )
		}
	}, [] )

	// Create listener to accounts change
	useEffect( f => setListenerAndReturnUnlistener( window.ethereum, 'accountsChanged', addresses => {

			log( 'Addresses changed to ', addresses )
			const [ newAddress ] = addresses

			// No new address? Change nothing
			if( !newAddress ) return

			// New address? Set it to state and stop interval
			setAddress( newAddress )
			
	} ), [ isConnected ] )


	return address

}

/* ///////////////////////////////
// ENS
// /////////////////////////////*/
export function useENS(  ) {

	const address = useAddress()
	const [ ENS, setENS ] = useState(  )

	useEffect( (  ) => {


	( async () => {

			try {

				const ens = await ens_from_address( address )
				if( ens ) setENS( ens )

			} catch( e ) {
				log( `Error in useENS: `, e )
			}

		} )( )


	}, [ address ] )

	return ENS

}

export async function ens_from_address( address ) {

	try {	

		if( !address ) return false
		const provider = getProvider()
		if( !provider ) return false
		const ens = await provider.lookupAddress( address )
		return ens

	} catch( e ) {
		log( `Error resolving ENS `, e )
		return false
	}

}