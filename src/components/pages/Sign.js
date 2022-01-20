import Container from '../atoms/Container'
import Loading from '../molecules/Loading'
import { Br, Text } from '../atoms/Text'
import Button from '../atoms/Button'
import Fox from '../../assets/metamask-fox-cleaned.svg'
import ResizingTextarea from '../molecules/ResizingTextarea'

import { useAddress, getAddress, useENS, sign_message, verify_message } from '../../modules/web3'
import { useEffect, useState } from 'react'
import { log, dev } from '../../modules/helpers'
import { useNavigate } from 'react-router-dom'

export default function Sign() {

	const navigate = useNavigate()

	// ///////////////////////////////
	// States
	// ///////////////////////////////
	const [ loading, setLoading ] = useState( 'Detecting web3 wallet' )
	const [ message, setMessage ] = useState(  )
	const address = useAddress()
	const ENS = useENS()

	/* ///////////////////////////////
	// Lifecycle
	// /////////////////////////////*/

	// On mount wait a second, but if there is no address, forward to login
	useEffect( f => {

			setTimeout( f => {

				if( !address ) {
					log( `Address is missing`, address )
					return navigate( '/' )
				}

				setLoading( false )

			}, 1000 )

	}, [] )

	// ///////////////////////////////
	// Functions
	// ///////////////////////////////
	async function signMessage(  ) {
		
		try {

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

	if( loading ) return <Loading message={ loading } />

	return <Container align='flex-start'>

			<Text>I { ENS ? `${ ENS } (aka ${ address.slice( 0, 9 ) })` : address } hereby sign,</Text>

			<ResizingTextarea minRows={ 10 } onChange={ ( { target } ) => setMessage( target.value ) } value={ message } autoFocus />

			<Br />
			<Button icon={ Fox } onClick={ signMessage }>
				<Text>Sign message & get sharable link</Text>
			</Button>

	</Container>

}