import Container from '../atoms/Container'
import Loading from '../molecules/Loading'
import { H1, H2, Sidenote, Text, Br } from '../atoms/Text'
import Button from '../atoms/Button'
import ResizingTextarea from '../molecules/ResizingTextarea'
import Input from '../molecules/Input'

import { verify_message } from '../../modules/web3'
import { useEffect, useState } from 'react'
import { clipboard, json_from_url_safe_base64, log } from '../../modules/helpers'
import { useParams } from 'react-router-dom'
import { log_event } from '../../modules/firebase'
import Address from '../molecules/Address'

export default function Verify() {

    const [ loading, setLoading ] = useState( 'Verifying' )
    const [ signature, setSignature ] = useState( { } )
    const [ authenticated, setAuthenticated ] = useState( false )
    const [ showSource, setShowSource ] = useState( false )
    const { message, share } = useParams()

    // ///////////////////////////////
    // States
    // ///////////////////////////////
    useEffect( (  ) => {

        let cancelled = false;

        ( async () => {

            try {

                // Decode url parameter
                const signature = json_from_url_safe_base64( message )
                log( message, ` decodes to `, signature )
                const { claimed_message, signed_message, claimed_signatory } = signature
                if( cancelled ) return
                setSignature( signature )

                // Check signature authenticity
                const authentic_message = await verify_message( claimed_message, signed_message, claimed_signatory )
                if( cancelled ) return

                log_event( 'verify_signature_verified' )

                // Set data to state
                setAuthenticated( authentic_message )


            } catch ( e ) {
                log_event( 'verify_signature_failed' )
                log( `Decoding error: `, e )
                alert( `Invalid signature link.\n\nDeveloper details: ${ e.message }` )

            } finally {

                setLoading( false )

            }

        } )( )

        return () => cancelled = true

    }, [ message ] )


    /* ///////////////////////////////
	// Render component
	// /////////////////////////////*/

    if( loading ) return <Loading message={ loading } />

    if( !authenticated ) return <Container align='flex-start'>

        <Text>This message appears corrupted or tampered with.</Text>

    </Container>

    const { claimed_signatory, claimed_message } = signature
    return <Container align='flex-start'>

        { !share && <>
				
            <H1>Message verification</H1>
            <Text>Signer <Address>{ claimed_signatory }</Address> has verifiably signed:</Text>

            <ResizingTextarea id="verify-message" value={ claimed_message } readOnly />

            <Sidenote onClick={ f => setShowSource( !showSource ) }>
                { showSource ? 'Hide' : 'Show' } cryptographic source
            </Sidenote>

            { showSource && <ResizingTextarea value={ JSON.stringify( signature, null, 2 ) } readOnly /> }

        </> }

        { share && <>
				
            <H2>Share this message</H2>
            <Text>Anyone with this link can see the source message and signature that <Address>{ claimed_signatory }</Address> left here.</Text>
            <Text>This link is not saved. If you lose it you will have to generate a new link.</Text>
            <Br />
            <Input id='verify-share-input' expand={ true } label='Sharable link' value={ window.location.href.replace( '/share', '' ) } readOnly />
            <Button onClick={ f => clipboard( window.location.href.replace( '/share', '' ) ) }>Copy link</Button>

        </> }
			
    </Container>

}