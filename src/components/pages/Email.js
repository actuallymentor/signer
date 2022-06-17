import Container from '../atoms/Container'
import Loading from '../molecules/Loading'
import { Br, Text, H1, Sidenote } from '../atoms/Text'
import Button from '../atoms/Button'
import MetamaskButton from '../molecules/MetamaskButton'
import Fox from '../../assets/metamask-fox-cleaned.svg'
import Input from '../molecules/Input'
import Menu from '../molecules/Menu'
import Footer from '../molecules/Footer'

import { useAddress, useENS, sign_message, getAddress } from '../../modules/web3'
import { useEffect, useState } from 'react'
import { log, wait, dev } from '../../modules/helpers'
import { useNavigate, useParams } from 'react-router-dom'
import { log_event, register_alias_with_backend } from '../../modules/firebase'

export default function Sign() {

	const navigate = useNavigate()

	// ///////////////////////////////
	// States
	// ///////////////////////////////
	const [ loading, setLoading ] = useState( )
	const [ email, setEmail ] = useState( '' )
	const address = useAddress()
	const ENS = useENS()
	const { notice } = useParams()

	/* ///////////////////////////////
	// Functions
	// /////////////////////////////*/
	async function sign_and_register_forwarder( ) {

		try {

			setLoading( `Requesting signature` )
			log( `Starting signature` )
			const message = JSON.stringify( { ENS, address, email } )
			const signature = await sign_message( message, address )
			setLoading( `Registering with Signer.is` )
			const { data: result } = await register_alias_with_backend( signature )

			if( !dev ) return navigate( `/email/verify_email` )

		} catch( e ) {
			log( `Signing error: `, e )
			alert( `Error: ${ e.message }` )
		} finally {
			setLoading( false )
		}

	}


	/* ///////////////////////////////
	// Lifecycle
	// /////////////////////////////*/
	useEffect( f => {

		if( notice == 'verify_email' ) setLoading( `Please open your ${ email } inbox and click the verification link to activate your forwarder.` )

	}, [ notice ] )

	// Once account is selected, connect to metamask
	useEffect( f => {

		if( address ) getAddress(address)

	}, [ address ] )


	/* ///////////////////////////////
	// Render component
	// /////////////////////////////*/
	log( address, ENS )

	if( loading ) return <Loading message={ loading } />

	return <Container align='flex-start'>

			<Menu />

			<H1>Email forwarding for your wallet</H1>

			{ address && <>

				<Text>Forward { ENS ? ` ${ ENS }@signer.is and ${ address }@signer.is` : `${ address }@signer.is` } to:</Text>

				<Input type="email" autocomplete="email" label="Your email address" onChange={ ( { target } ) => setEmail( target.value ) } value={ email } placeholder='vitalik@gmail.com' autoFocus />

				<Br />

			</> }
			<MetamaskButton icon={ Fox } onClick={ sign_and_register_forwarder }>
				<Text>Sign message to set email forwarder</Text>
			</MetamaskButton>

			<Sidenote align="left">*The email service is off-chain, there is no in-chain link between your wallet and email address.</Sidenote>

			<Footer />

	</Container>

}