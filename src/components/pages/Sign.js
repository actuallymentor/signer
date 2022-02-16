import Container from '../atoms/Container'
import Loading from '../molecules/Loading'
import { Br, Text } from '../atoms/Text'
import Button from '../atoms/Button'
import Fox from '../../assets/metamask-fox-cleaned.svg'
import ResizingTextarea from '../molecules/ResizingTextarea'
import Menu from '../molecules/Menu'
import Footer from '../molecules/Footer'

import { useAddress, getAddress, useENS, sign_message, verify_message } from '../../modules/web3'
import { useEffect, useState } from 'react'
import { log, dev, wait } from '../../modules/helpers'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { log_event } from '../../modules/firebase'

export default function Sign() {

	const navigate = useNavigate()

	// ///////////////////////////////
	// States
	// ///////////////////////////////
	const [ loading, setLoading ] = useState( 'Detecting web3 wallet' )
	const [ message, setMessage ] = useState(  )
	const { signature_request } = useParams()
	const address = useAddress()
	const ENS = useENS()

	/* ///////////////////////////////
	// Lifecycle
	// /////////////////////////////*/

	useEffect( (  ) => {

		let cancelled = false;

		( async () => {


			// Check for the address, if there is one stop loading, if there is none try a few times
			if( address ) return setLoading( false )

			await wait( 1000 )
			if( address ) return setLoading( false )
			log( `No address after 1 second` )
			if( cancelled ) return

			await wait( 2000 )
			if( address ) return setLoading( false )
			log( `No address after 2 seconds` )
			if( cancelled ) return

			await wait( 3000 )
			if( address ) return setLoading( false )
			log( `No address after 3 seconds` )
			if( cancelled ) return

			log_event( 'sign_wallet_failed' )

			return navigate( `/${ signature_request || '' }` )


		} )( )

		return () => cancelled = true

	}, [ address ] )


	useEffect( f => {

		try {

			if( !signature_request ) return log( `No signature request in URL` )

			log_event( 'sign_signature_request' )

			const decoded_request = JSON.parse( decodeURIComponent( atob( signature_request ) ) )
			log( `Requested message signature: `, decoded_request )

			// Decode in lowercase
			let { requested_message, requested_signatory='' } = decoded_request
			requested_signatory = requested_signatory.toLowerCase()

			// if no requested message, exit
			if( !requested_message ) return

			// If this request was not meant for the current address
			if( requested_signatory && ( requested_signatory != address ) ) return alert( `This link was requests a signature from ${ requested_signatory }.\n\nYou are currently connected as ${ address }.\n\nYou can still sign, but the requester might not accept your signature as valid.` )
			
			// Set the requested message to the interface
			if( requested_message ) setMessage( requested_message )

		} catch( e ) {

			log( `Error parsing signature request `, e )

		}

	}, [ signature_request , address ] )

	// ///////////////////////////////
	// Functions
	// ///////////////////////////////
	async function signMessage(  ) {
		
		try {

			if( !message ) throw new Error( `No message input` )

			setLoading( 'Signing message...' )
			const signature = await sign_message( message, address )
			log( `Signed message: `, signature )

			// Verify signing
			if( dev ) {

				const { claimed_message, signed_message, claimed_signatory } = signature
				const valid_signature = await verify_message( claimed_message, signed_message, claimed_signatory )
				log( `State is valid as message compared to signed object: `, valid_signature )
			}

			// Forward to reading URL
			const url_safe_base64 = btoa( encodeURIComponent( JSON.stringify( signature ) ) )
			log_event( 'sign_message_signed' )
			return navigate( `/verify/${ url_safe_base64 }/share` )

		} catch( e ) {
			log( `Signing error: `, e )
			alert( e.message )
		} finally {
			setLoading( false )
		}

	}

	/* ///////////////////////////////
	// Render component
	// /////////////////////////////*/
	log( address, ENS )

	if( loading ) return <Loading message={ loading } />

	return <Container align='flex-start'>

			<Menu />

			<Text>I { ENS ? `${ ENS } (aka ${ address.slice( 0, 9 ) })` : address } hereby sign,</Text>

			<ResizingTextarea minRows={ 10 } onChange={ ( { target } ) => setMessage( target.value ) } value={ message } autoFocus />

			<Br />
			<Button icon={ Fox } onClick={ signMessage }>
				<Text>Sign message & get sharable link</Text>
			</Button>

			<Footer />

	</Container>

}