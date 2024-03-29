import { useEffect, useState } from "react"
import { useAccount } from "wagmi"
import Container from "../atoms/Container"
import { H1, Sidenote, Text } from "../atoms/Text"
import Input from "../molecules/Input"

import { tokens } from "../../modules/web3/accepted_tokens"
import { log, to_url_safe_base64 } from "../../modules/helpers"
import { chain_id_to_chain_name } from "../../modules/web3/chains"
import { eth_or_ens_address_regex, sanitize_common } from "../../modules/web3/validations"
import Button from "../atoms/Button"
import { useNavigate } from "react-router-dom"
import { log_event } from "../../modules/firebase"
import AddressInput from "../molecules/AddressInput"
import Section from "../atoms/Section"

export default ( { ...props } ) => {

    const { address } = useAccount()

    const [ recipient, set_recipient ] = useState( '' )
    const [ token, set_token ] = useState( tokens[ 0 ] )
    const [ amount, set_amount ] = useState( 0.001 )
    const [ message, set_message ] = useState( '' )
    const [ is_donation, set_is_donation ] = useState( false )
    const [ enable_l2, set_enable_l2 ] = useState( 'true' )
    const navigate = useNavigate()
    log( is_donation, location )

    // Handle wallet changes
    useEffect( () => {
        if( !recipient && address ) set_recipient( address )
    }, [ address ] )

    // Create payment link
    function generate_payment_link() {

        try {

            // Validations
            if( !recipient.match( eth_or_ens_address_regex ) ) throw new Error( `Invalid ETH address, please check for typos or better yet: connect your wallet so you don't have to type yourself.` )
            if( !token ) throw new Error( `No token selected, please select a token.` )
            if( !amount ) throw new Error( `Amount to receive is missing, please input how much you want to receive.` )

            // Sanitation
            const pay_recipient = sanitize_common( recipient )
            const pay_token = token
            const pay_amount = amount
            const pay_enable_l2 = enable_l2 == 'true'

            // Generate link schematic
            const base64_payment_string = to_url_safe_base64( {
                pay_recipient,
                pay_token,
                pay_amount,
                pay_enable_l2,
                is_donation,
                ... message.length && { message } 
            } )

            log_event( `payment_link_create`, {
                token: token.symbol,
                l2: pay_enable_l2,
                amount: pay_amount
            } )

            return navigate( `/pay/${ base64_payment_string }/${ is_donation ? 'donate' : 'share' }` )

        } catch ( e ) {
            log( `Payment link generation error: `, e )
            alert( `Error generating link: ${ e.message }` )
        }

    }

    return <Container gutter={ true } justify='center' align='center'>

        <Section width="600px">

            <H1 align="center">Create a { is_donation ? 'donation link' : 'payment link' }</H1>
            <Text align="center" margin='.2rem 0 2rem'>Make it easy for others to { is_donation ? 'donate to' : 'pay' } you in 1 click.</Text>

            { /* Address selection */ }
            <AddressInput 
                id="pay-create-recipient" 
                label={ `${ is_donation ? "Donation" : "Payment" } recipient address/ENS` }
                info="This address will receive payments triggered from this payment link."
                type="text"
                value={ recipient }
                onChange={ ( { target } ) => set_recipient( target.value ) }
            />

            

            <Section padding="0" width="450px" direction="row">

                <Input margin="0" label_only='true' label={ is_donation ? "What donation amount do you want to suggest?" : "How much do you want to receive?" } />

                { /* How much do you want to receive? */ }
                <Input
                    id="pay-create-amount"
                    grow="2"
                    min_width="120px"
                    margin=".5rem 0 0 0"
                    type="number"
                    min="0"
                    step={ token?.symbol == 'ETH' ? '0.001' : '1' }
                    // label={ is_donation ? "What donation amount do you want to suggest?" : "How much do you want to receive?" }
                    onChange={ ( { target } ) => set_amount( target.value ) }
                    value={ amount }
                />

                { /* Token to receive */ }
                <Input
                    type="dropdown"
                    grow="1"
                    padding="0 0 0 .5rem"
                    min_width="120px"
                    margin=".5rem 0 0 0"
                    options={ tokens.map( ( { symbol } ) => ( { value: symbol } ) ) }
                    onChange={ ( { target } ) => set_token( tokens.find( ( { symbol } ) => symbol == target.value ) ) }
                    value={ token?.symbol }
                />

                
            </Section>

            { /* Which networks do you want to accept */ }
            <Input
                type="dropdown"
                label="Enable multi-chain payments?"
                options={ [
                    { value: 'yes', label: `Yes: ${ token?.chain_ids?.map( chain_id_to_chain_name ).join( ', ' ) }` },
                    { value: 'no', label: `No, accept ${ chain_id_to_chain_name( token?.chain_ids?.[0] ) } only` }
                ] }
                onChange={ ( { target } ) => set_enable_l2( target.value ) }
                value={ enable_l2 }
            />

            { /* Include a message? */ }
            <Input
                id="pay-create-message"
                type="text"
                label="Message to include (optional)"
                onChange={ ( { target } ) => set_message( target.value ) }
                placeholder="Please pay me <3"
                value={ message }
            />

            <Button id="pay-generate-link" onClick={ generate_payment_link }>Generate { is_donation ? 'donation' : 'payment' } link</Button>
            <Sidenote onClick={ () => set_is_donation( !is_donation ) }>Make { is_donation ? 'payment' : 'donation' } link instead</Sidenote>

        </Section>

    </Container>
}