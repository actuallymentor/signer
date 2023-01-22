import Container from "../atoms/Container"
import Message from "../organisms/Message"
import Loading from "../molecules/Loading"
import { useNavigate, useParams } from "react-router-dom"
import { Text } from "../atoms/Text"
import { useEffect, useState } from "react"
import { confirm_email_forwarder, log_event } from "../../modules/firebase"
import { dev, log } from "../../modules/helpers"

export default function ConfirmEmail(  ) {

    const [ loading, setLoading ] = useState( 'Confirming your email...' )
    const { verification_uid } = useParams()
    const navigate = useNavigate()

    useEffect( (  ) => {

        let cancelled = false;
    
        ( async () => {
    
            try {
    
                const { data: status } = await confirm_email_forwarder( verification_uid )
                if( status.success ) {
                    if( cancelled ) return
                    log_event( `email_forward_confirm_success` )
                    return setLoading( false )
                }

                throw new Error( `Error registering with backend: ${ status.error }` )

    
            } catch( e ) {
                alert( e.message )
                if( !dev ) navigate( '/' )
                else log( `Not forwarding in dev` )
                setLoading( false )
                log_event( `email_forward_confirm_failed` )
            }
    
        } )( )
    
        return () => cancelled = true
    
    }, [ verification_uid ] )

    if( loading ) return <Loading message={ loading } />

    return <Container gutter={ false } menu={ false }>
        <Message>

            <Text margin='2rem 0'>Email forwarder now active.</Text>
            <Text margin='2rem 0'>🚨 IMPORTANT: we have sent an email with the subject "spam check" to your new email forwarder.</Text>
            <Text margin='2rem 0'>If this email is not in your inbox, please go to your spam folder and mark it as "not spam". Otherwise you might miss important messages.</Text>

        </Message>
    </Container>

}