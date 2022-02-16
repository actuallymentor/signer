import Container from '../atoms/Container'
import Loading from '../molecules/Loading'
import { H1, H2, Text, Br } from '../atoms/Text'
import Button from '../atoms/Button'
import Fox from '../../assets/metamask-fox-cleaned.svg'
import Menu from '../molecules/Menu'
import Footer from '../molecules/Footer'

import { useAddress, getAddress, useIsConnected } from '../../modules/web3'
import { useState, useEffect } from 'react'
import { log, dev } from '../../modules/helpers'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { log_event } from '../../modules/firebase'

export default function Login() {

		const navigate = useNavigate()


	// ///////////////////////////////
	// States
	// ///////////////////////////////
	const [ loading, setLoading ] = useState( false )
	const [ error, setError ] = useState( undefined )
	const isConnected = useIsConnected(  )
	const address = useAddress()
	const { signature_request } = useParams()

	/* ///////////////////////////////
	// Lifecycle
	// /////////////////////////////*/

	// Redirect if metamask is connected
	// useEffect( f => {

	// 	// If missing data, ask for login
	// 	if( !isConnected || !address ) {
	// 		setLoading( false )
	// 	}

	// 	// If an address is available, move to signing interface
	// 	if( isConnected && address ) {
	// 		log( `Metamask connected with ${ address }` )
	// 		return navigate( '/sign' )
	// 	}


	// }, [ isConnected, navigate, address ] ) // Not adding timer on purpose, causes loop

	// ///////////////////////////////
	// Functions
	// ///////////////////////////////

	// Handle user login interaction
	async function metamasklogin( e ) {

		e.preventDefault()

		try {

			setLoading( 'Connecting to Metamask' )
			const address = await getAddress()
			log( 'Received: ', address )
			log_event( 'login_metamask' )
			return navigate( `/sign/${ signature_request || '' }` )

		} catch( e ) {
			setError( `Metamask error: ${ e.message || JSON.stringify( e ) }. Please reload the page.` )
		} finally {
			setLoading( false )
		}

	}

	/* ///////////////////////////////
	// Render component
	// /////////////////////////////*/

	if( loading ) return <Loading message={ loading } />

	return <Container align={ 'flex-start' } gutter={ true }>
			
			<Menu />

			<H1>Sign and share a cryptographic message</H1>
			<H2>Speak on behalf of your wallet and get a sharable link</H2>
			<Text>It is free and costs no gas</Text>

			<Br />
			{ error && <Text>{ error }</Text> }
			<Button icon={ Fox } onClick={ metamasklogin }>
				Connect wallet
			</Button>

			<Footer />

	</Container>

}