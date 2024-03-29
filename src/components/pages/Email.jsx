import Container from '../atoms/Container'
import Loading from '../molecules/Loading'
import { Br, Text, H1, Sidenote } from '../atoms/Text'
import MetamaskButton from '../molecules/MetamaskButton'
import Fox from '../../assets/metamask-fox-cleaned.svg'
import Input from '../molecules/Input'
import Message from '../organisms/Message'

import { sign_message } from '../../modules/web3'
import { useEffect, useState } from 'react'
import { log } from '../../modules/helpers'
import { useNavigate, useParams } from 'react-router-dom'
import { log_event, register_alias_with_backend } from '../../modules/firebase'
import { useAccount, useEnsName, useWalletClient } from 'wagmi'
import { email_regex } from '../../modules/web3/validations'

export default function Sign() {

    const navigate = useNavigate()

    // ///////////////////////////////
    // States
    // ///////////////////////////////
    const [ loading, setLoading ] = useState( )
    const [ message, setMessage ] = useState(  )
    const [ email, setEmail ] = useState( '' )
    const { address } = useAccount()
    const { data: ENS } = useEnsName( { address } )
    const { notice } = useParams()
    const { data: signer, isError, isLoading } = useWalletClient()

    /* ///////////////////////////////
	// Functions
	// /////////////////////////////*/
    async function sign_and_register_forwarder( ) {

        try {

            if( !email.match( email_regex ) ) throw new Error( `Please enter a valid email address` )

            setLoading( `Requesting signature` )
            log( `Starting signature` )
            log_event( `email_forward_register` )
            const message = JSON.stringify( { ENS, address, email } )
            const signature = await sign_message( message, address, signer )
            setLoading( `Registering with Signer.is` )
            log( `Message signed: `, message )
            log( `Resulting signature: `, signature )
            const { data: result } = await register_alias_with_backend( signature )
            log( `Signer responded with: `, result )
            const { error } = result
            if( error ) throw new Error( `Error creating email forward: ${ error }` )
            log_event( `email_forward_success` )
            return navigate( `/email/verify_email` )

        } catch ( e ) {
            log_event( `email_forward_fail` )
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

        if( notice === 'verify_email' ) setMessage( `Please open your ${ email } inbox and click the verification link to activate your forwarder.` )
        if( notice === 'email_verified' ) setMessage( `Your email has been verified! People and apps can now email you at your wallet address!` )

    }, [ notice ] )


    /* ///////////////////////////////
	// Render component
	// /////////////////////////////*/

    if( loading ) return <Loading message={ loading } />
    if( message ) return <Message message={ message } />

    return <Container align='flex-start'>

        <H1>Email forwarding for your wallet</H1>

        { address && <>

            <Text>Forward { ENS ? ` ${ ENS }@signer.is and ${ address }@signer.is` : `${ address }@signer.is` } to:</Text>

            <Input id="forward-input-email" type="email" autoComplete="email" label="Your email address" onChange={ ( { target } ) => setEmail( target.value ) } value={ email } placeholder='vitalik@gmail.com' autoFocus />

            <Br />

        </> }
        <MetamaskButton icon={ Fox } onClick={ sign_and_register_forwarder } airdrop_tag="register_email">
            <Text>Sign message to set email forwarder</Text>
        </MetamaskButton>

        <Sidenote align="left">*The email service is off-chain, there is no on-chain link between your wallet and email address.</Sidenote>

    </Container>

}