import Container from '../atoms/Container'
import { H1, Text } from '../atoms/Text'
import Section from '../atoms/Section'
import ResizingTextarea from '../molecules/ResizingTextarea'

import { useDebounce } from 'use-debounce'
import { verify_message } from '../../modules/web3'
import { useEffect, useState } from 'react'
import { log, to_url_safe_base64 } from '../../modules/helpers'
import Button from '../atoms/Button'
import { useNavigate } from 'react-router-dom'
import Address from '../molecules/Address'
import { ErrorLine } from '../atoms/ErrorLine'

export default function ManualVerify() {

    const [ message, setMessage ] = useState(  )
    const [ debounced_message ] = useDebounce( message, 1000 )
    const [ result, setResult ] = useState(  )
    const [ error, setError ] = useState(  )
    const [ sharableUrl, setSharableUrl ] = useState(  )
    const [ verifiedMessage, setVerifiedMessage ] = useState(  )
    const [ signature, setSignature ] = useState(  )
    const navigate = useNavigate()

    useEffect( (  ) => {

        if( !debounced_message ) return
        let cancelled = false;
    
        ( async () => {
    
            try {
    
                // Destructure input
                const json = JSON.parse( message )
                const claimed_message = json.msg || json.message || json.claimed_message
                const signed_message = json.sig || json.signature || json.signed_message
                const claimed_signatory = json.address || json.addr || json.claimed_signatory

                // Verify signature validity
                const is_valid = await verify_message( claimed_message, signed_message, claimed_signatory )

                // Restructure sig in the way signer uses it
                const structured_signature = {
                    claimed_message,
                    claimed_signatory,
                    signed_message
                }

                // If cancelled or invalid, exit
                if( cancelled ) return
                if( !is_valid ) throw new Error( `cannot verify that this message was signed by this address` )

                // Set states based on outcome
                setVerifiedMessage( claimed_message )
                setResult( `All good, ${ claimed_signatory } signed this message: ` )
                setSignature( structured_signature )
                setError( undefined )
                const url_safe_base64 = to_url_safe_base64( structured_signature )
                setSharableUrl( `/verify/${ url_safe_base64 }/share` )
    
            } catch ( e ) {

                // On error, register and reset states
                log( `Error verifying signature: `, e )
                setError( `${ e.message }` )
                setVerifiedMessage( undefined )
                setResult( undefined )
                setSignature( undefined )
                setSharableUrl( undefined )
            }
    
        } )( )
    
        return () => cancelled = true
    
    }, [ debounced_message ] )


    /* ///////////////////////////////
	// Render component
	// /////////////////////////////*/

    return <Container align='flex-start' width="800px">

        <Section align='flex-start' width="900px">
            <H1>Input a signature to verify</H1>
            <Text>This tool allows you to verify whether a signature is valid.</Text>
            <Text>The syntax is JSON, it needs the keys: sig/signature, addr/address, msg/message</Text>
            <ResizingTextarea id="message-to-verify" minRows={ 10 } onChange={ ( { target } ) => setMessage( target.value ) } value={ message } autoFocus />

            { error && <ErrorLine>Error: { error }</ErrorLine> }

            { result && <>
                <Text><Address>{ signature?.claimed_signatory }</Address> verifyably signed:</Text>
                <ResizingTextarea value={ verifiedMessage } />
            </> }

            { sharableUrl && <Button onClick={ () => navigate( sharableUrl ) }>
                <Text>Get sharable link</Text>
            </Button> }
        </Section>

    </Container>

}