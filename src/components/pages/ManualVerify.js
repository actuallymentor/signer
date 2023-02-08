import Container from '../atoms/Container'
import Loading from '../molecules/Loading'
import { H1, Text } from '../atoms/Text'
import Section from '../atoms/Section'
import ResizingTextarea from '../molecules/ResizingTextarea'

import { useDebounce } from 'use-debounce'
import { verify_message } from '../../modules/web3'
import { useEffect, useState } from 'react'

export default function ManualVerify() {

	const [ loading, setLoading ] = useState( false )
    const [ message, setMessage ] = useState(  )
    const [ debounced_message ] = useDebounce( message, 1000 )
    const [ result, setResult ] = useState(  )
    const [ verifiedMessage, setVerifiedMessage ] = useState(  )

    useEffect( (  ) => {

        if( !debounced_message ) return
        let cancelled = false;
    
        ( async () => {
    
            try {
    
                const json = JSON.parse( message )
                const claimed_message = json.msg || json.message || json.claimed_message
                const signed_message = json.sig || json.signature || json.signed_message
                const claimed_signatory = json.address || json.addr || json.claimed_signatory
                const is_valid = await verify_message( claimed_message, signed_message, claimed_signatory )
                if( cancelled ) return
                if( !is_valid ) throw new Error( `Message was not valid` )
                setVerifiedMessage( claimed_message )
                setResult( `All good, ${ claimed_signatory } signed this message: ` )
    
            } catch( e ) {
                setResult( `Error: ${ e.message }` )
            }
    
        } )( )
    
        return () => cancelled = true
    
    }, [ debounced_message ] )


	/* ///////////////////////////////
	// Render component
	// /////////////////////////////*/

	if( loading ) return <Loading message={ loading } />

	return <Container align='flex-start' width="800px">

			<Section align='flex-start' width="900px">
                <H1>Input a signature to verify</H1>
                <Text>This tool allows you to verify whether a signature is valid.</Text>
                <Text>The syntax is JSON, it needs the keys: sig/signature, addr/address, msg/message</Text>
                <ResizingTextarea id="sign-message-input" minRows={ 10 } onChange={ ( { target } ) => setMessage( target.value ) } value={ message } autoFocus />

                { result && <>
                    <Text>{ result }</Text>
                    <Text>{ verifiedMessage }</Text>
                </> }
            </Section>

	</Container>

}