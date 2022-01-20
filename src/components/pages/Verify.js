import Container from '../atoms/Container'
import Loading from '../molecules/Loading'
import { H1, H2, Sidenote, Text, Br } from '../atoms/Text'
import Button from '../atoms/Button'
import Fox from '../../assets/metamask-fox-cleaned.svg'
import ResizingTextarea from '../molecules/ResizingTextarea'
import Input from '../molecules/Input'

import { ens_from_address, verify_message } from '../../modules/web3'
import { useEffect, useState } from 'react'
import { log, dev } from '../../modules/helpers'
import { useParams } from 'react-router-dom'

export default function Verify() {

	const [ loading, setLoading ] = useState( 'Verifying' )
	const [ signature, setSignature ] = useState( { } )
	const [ authenticated, setAuthenticated ] = useState( false )
	const [ showSource, setShowSource ] = useState( false )
	const [ ENS, setENS ] = useState(  )
	const { message, share } = useParams()

	// ///////////////////////////////
	// States
	// ///////////////////////////////
	useEffect( (  ) => {

		let cancelled = false;

		( async () => {

			try {

				// Decode url parameter
				const signature = JSON.parse( decodeURIComponent( atob( message ) ) )
				log( message, ` decodes to `, signature )
				const { claimed_message, signed_message, claimed_signatory } = signature
				if( cancelled ) return
				setSignature( signature )

				// Check signature authenticity
				const authentic_message = await verify_message( claimed_message, signed_message, claimed_signatory )
				if( cancelled ) return

				// Set data to state
				setAuthenticated( authentic_message )


			} catch( e ) {

				log( `Decoding error: `, e )
				alert( e.message )

			} finally {

				setLoading( false )

			}

		} )( )

		return () => cancelled = true

	}, [ message ] )

	useEffect( (  ) => {

		let cancelled = false;

		( async () => {

			try {

				if( !signature ) return

				// Attempt to get ENS
				const { claimed_signatory } = signature
				const ens = await ens_from_address( claimed_signatory )
				if( cancelled ) return
				setENS( ens )
				

			} catch( e ) {

				log( 'Error getting ENS ', e )

			}

		} )( )

		return () => cancelled = true

	}, [ signature ] )

	/* ///////////////////////////////
	// Functions
	// /////////////////////////////*/
	const clipboard = async text => {
		if( !navigator.clipboard ) return alert( `Your browser doesn't support auto-copying text, please manually copy the link.` )
		await navigator.clipboard?.writeText( text )
		alert( 'Copied to clipboard!' )
	}


	/* ///////////////////////////////
	// Render component
	// /////////////////////////////*/

	if( loading ) return <Loading message={ loading } />

	if( !authenticated ) return <Container align='flex-start'>

			<Text>This message appears corrupted or tampered with.</Text>

	</Container>

	const { claimed_signatory, claimed_message, signed_message } = signature
	return <Container align='flex-start'>

			{ !share && <>
				
				<H1>Message verification</H1>
				<Text>Signer { ENS ? `${ claimed_signatory } (aka ${ ENS })` : claimed_signatory } has verifiably signed:</Text>

				<ResizingTextarea value={ claimed_message } readOnly />

				<Sidenote onClick={ f => setShowSource( !showSource ) }>
					{ showSource ? 'Hide' : 'Show' } cryptographic source
				</Sidenote>

				{ showSource && <>
					<ResizingTextarea value={ JSON.stringify( signature, null, 2 ) } readOnly />
				</> }

			</> }

			{ share && <>
				
				<H2>Share this message</H2>
				<Text>Anyone with this link can see the source message and signature that { ENS || claimed_signatory } left here.</Text>
				<Text>This link is not saved. If you lose it you will have to generate a new link.</Text>
				<Br />
				<Input label='Sharable link' value={ window.location.href.replace( '/share', '' ) } readOnly />
				<Button onClick={ f => clipboard( window.location.href.replace( '/share', '' ) ) }>Copy link</Button>

			</> }
			
			

	</Container>

}