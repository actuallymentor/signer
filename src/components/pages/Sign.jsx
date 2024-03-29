import Container from '../atoms/Container'
import Loading from '../molecules/Loading'
import { Br, Text } from '../atoms/Text'
import MetamaskButton from '../molecules/MetamaskButton'
import ResizingTextarea from '../molecules/ResizingTextarea'

import { sign_message, verify_message } from '../../modules/web3'
import { useEffect, useState } from 'react'
import { log, dev, to_url_safe_base64 } from '../../modules/helpers'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { log_event } from '../../modules/firebase'
import { useAccount, useWalletClient } from 'wagmi'
import Address from '../molecules/Address'

export default function Sign() {

    const navigate = useNavigate()

    // ///////////////////////////////
    // States
    // ///////////////////////////////
    const [ loading, setLoading ] = useState( )
    const [ message, setMessage ] = useState(  )
    const { signature_request } = useParams()
    const { address } = useAccount()
    const { data: signer, isError, isLoading } = useWalletClient()
	

    /* ///////////////////////////////
	// Lifecycle
	// /////////////////////////////*/


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
            if( requested_signatory &&  requested_signatory != address  ) return alert( `This link requests a signature from ${ requested_signatory }.\n\nYou are currently connected as ${ address }.\n\nYou can still sign, but the requester might not accept your signature as valid.` )
			
            // Set the requested message to the interface
            if( requested_message ) setMessage( requested_message )

        } catch ( e ) {

            log( `Error parsing signature request `, e )

        }

    }, [ signature_request , address ] )

    // ///////////////////////////////
    // Functions
    // ///////////////////////////////
    async function signMessage(  ) {
		
        try {

            if( !message ) throw new Error( `No message input` )
            if( !address ) throw new Error( `No wallet appears to be connected. If you are sure you connected your wallet, please refresh the page.` )

            setLoading( 'Signing message...' )
            log( `Starting signature` )
            const signature = await sign_message( message, address, signer )
            log( `Signed message: `, signature )

            // Verify signing
            if( dev ) {

                const { claimed_message, signed_message, claimed_signatory } = signature
                const valid_signature = await verify_message( claimed_message, signed_message, claimed_signatory )
                log( `State is valid as message compared to signed object: `, valid_signature )
            }

            // Forward to reading URL
            const url_safe_base64 = to_url_safe_base64( signature )
            log_event( 'sign_message_signed' )
            return navigate( `/verify/${ url_safe_base64 }/share` )

        } catch ( e ) {
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

    return <Container justify='center' align='flex-start'>

        <Text>I <Address>{ address }</Address> hereby sign,</Text>

        <ResizingTextarea id="sign-message-input" minRows={ 10 } onChange={ ( { target } ) => setMessage( target.value ) } value={ message } autoFocus />

        <Br />
        <MetamaskButton onClick={ signMessage } airdrop_tag="sign_message">
            <Text>Sign message & get sharable link</Text>
        </MetamaskButton>


    </Container>

}