import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useNetwork } from "wagmi"
import { clipboard, json_from_url_safe_base64, log } from "../../modules/helpers"
import { useMakeTransaction } from "../../modules/hooks/transactions"
import { chain_id_to_chain_name } from "../../modules/web3/chains"
import { eth_or_ens_address_regex } from "../../modules/web3/validations"
import Button from "../atoms/Button"
import Container from "../atoms/Container"
import QR from "../atoms/QR"
import { Br, H2, Sidenote, Text } from "../atoms/Text"
import Address from "../molecules/Address"
import ENSAvatar from "../molecules/ENSAvatar"
import Footer from "../molecules/Footer"
import Input from "../molecules/Input"
import Loading from "../molecules/Loading"
import Menu from "../molecules/Menu"
import MetamaskButton from "../molecules/MetamaskButton"

export default ( { ...props } ) => {

    const { payment_string, share } = useParams()
    const [ request, set_request ] = useState(  )
    const [ error, set_error ] = useState(  )
    const { pay_recipient, pay_token, pay_amount, pay_enable_l2 } = request || {}
    const [ loading, set_loading ] = useState(  )

    // Decode url string
    useEffect( () => {
        
        try {
            
            // Decode URL
            const decoded_request = json_from_url_safe_base64( payment_string )

            // Validate URl content
            const { pay_recipient, pay_token, pay_amount, pay_enable_l2 } = decoded_request
            if( !pay_recipient.match( eth_or_ens_address_regex ) ) throw new Error( `Invalid ETH address, please check for typos or better yet: connect your wallet so you don't have to type yourself.` )
            if( !pay_token.symbol || !pay_token.chain_ids || !pay_token.address ) throw new Error( `Invalid token data.` )
            if( !pay_amount ) throw new Error( `Missing payment amount` )
            if( !pay_enable_l2 ) throw new Error( `L2 preferences missing` )

            set_request( decoded_request )

        } catch( e ) {
            log( `Error decoding payment data: `, e )
            set_error( `This link appears corrupted or tampered with.` )
        }

    }, [ payment_string ] )

    // Transaction handling
    const { on_right_chain, make_transaction } = useMakeTransaction( pay_recipient, pay_token, pay_amount, pay_enable_l2 )
    async function transact_with_feedback() {

        try {

            set_loading( `Waiting for wallet confirmation` )
            await make_transaction()

        } catch( e ) {
            log( `Transaction error: `, e )
            set_error( `Transaction error: ${ e.message }` )
        } finally {
            set_loading( false )
        }

    }

    // Render loading screen
    if( loading ) return <Loading message={ loading } />

    // Render errors
    if( error ) return <Container>
        <Text>{ error }</Text>
        <Button onClick={ () => set_error( undefined ) }>Try again</Button>
    </Container>

    // If request was not loaded yet
    if( !request ) return

    // If this is a sharing request, display it
    if ( share ) return <Container>

        <Menu />
        
        <H2>Share this payment link</H2>
        <Text>Anyone with this link can pay you in 1 click.</Text>
        <Text>This link is not saved. If you lose it you will have to generate a new link.</Text>
        <QR value={ window.location.href.replace( '/share', '' ) } />
        <Br />
        <Input id='pay-share-link' expand={ true } label='Sharable link' value={ window.location.href.replace( '/share', '' ) } readOnly />
        <Button onClick={ f => clipboard( window.location.href.replace( '/share', '' ) ) }>Copy link</Button>

    </Container>

    // Display payment info
    return <Container>

        <ENSAvatar />
        <Text align="center"><Address>{ pay_recipient }</Address> has requested { pay_amount } { pay_token.symbol }.</Text>
        <Sidenote margin="2rem 0">Accepted networks: { pay_token?.chain_ids?.map( chain_id_to_chain_name ).join( ', ' ) }</Sidenote>
        { !on_right_chain && <Text align="center">You are connected to an unsupported network.</Text> }
        { on_right_chain && <MetamaskButton onClick={ transact_with_feedback }>Transfer { pay_amount } { pay_token.symbol }</MetamaskButton> }

        <Footer />

    </Container>
}