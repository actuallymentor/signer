import { log, setListenerAndReturnUnlistener, wait } from './helpers'
import { useState, useEffect, useRef } from "react"
import useInterval from 'use-interval'

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
	const [ isConnected, setIsConnected ] = useState( false )
	const ID = useRef( `${ Math.random() }`.slice( 2, 8 ) ).current

	const update_connected = f => {
		const connected = window.ethereum?.isConnected()
		setIsConnected( connected )
		if( connected ) return log( `${ ID } 💡 Wallet connected` )
		log( `${ ID } 🔌 Wallet disconnected` )
	}

	// Listen to disconnects
	useEffect( f => setListenerAndReturnUnlistener( window.ethereum, 'disconnect', update_connected ), [] )
	useEffect( f => setListenerAndReturnUnlistener( window.ethereum, 'connect', update_connected ), [] )


	// Since the connect event doesn't get triggered when metamask actually connects, we are going to do a SUPER inelegant looped listener
	useInterval( () => {
		const connected = window.ethereum?.isConnected()
		if( connected != isConnected ) {
			log( `💡 Wallet connection status changed from ${ isConnected } to ${ connected }` )
			setIsConnected( connected )
		}
	}, isConnected ? null : 1000, true )

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
	const ID = useRef( `${ Math.random() }`.slice( 2, 8 ) ).current

	// Keep synced with provider
	useEffect( f => {

		log( `💳 Setting selected address to useAddress state: `, window.ethereum?.selectedAddress )
		setAddress( window.ethereum?.selectedAddress )

	}, [ isConnected ] )

	// Listen to accountschanged
	useEffect( f => {

		// If not connected, do not listen
		if( !isConnected ) return

		const unsubscribe = setListenerAndReturnUnlistener( window.ethereum, 'accountsChanged', addresses => {

				// Get address through listener
				log( `${ ID } ♻️ Selected address ${ window.ethereum?.selectedAddress }, all addresses changed to `, addresses )
				const [ newAddress ] = addresses

				// New address? Set it to state and stop interval
				if( address !== newAddress ) setAddress( newAddress )
				
		} )

		return () => {
			log( `${ ID } Stop address listener...` )
			unsubscribe()
		}

	}, [ isConnected ] )
	
	// Since metamask does not trigger reliable connect events, add a listener
	useInterval( () => {

		if( address !== window.ethereum?.selectedAddress ) setAddress( window.ethereum?.selectedAddress )

	}, address ? null : 1000, true )


	log( `${ ID } useAddress: `, address )
	return address

}

/* ///////////////////////////////
// ENS
// /////////////////////////////*/
export function useENS(  ) {

	const address = useAddress()
	const [ ENS, setENS ] = useState(  )

	useEffect( (  ) => {

		let cancelled = false;

		( async () => {

			try {

				const ens = await ens_from_address( address )
				if( cancelled ) return
				log( `ENS changed to `, ens )
				setENS( ens )

			} catch( e ) {
				log( `Error in useENS: `, e )
			}

		} )( )

		return () => cancelled = true


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