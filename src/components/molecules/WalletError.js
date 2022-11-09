import styled from 'styled-components'
import { useAccount, useEnsName, useNetwork } from 'wagmi'
import { chain_id_to_chain_name } from '../../modules/web3/chains'
import { Sidenote } from '../atoms/Text'

const translate = ( string, chain_name, account_or_ens ) => {

    // Translate technical messages to user-friendly messages
    if( string.includes( 'insufficient funds' ) ) return `The balance of ${ account_or_ens } is too low on ${ chain_name }.`

    // Default: return original string
    return string
}

const ErrorLine = styled( Sidenote )`

    align-items: center;
    justify-content: center;
    & svg {
        height: .8rem;
    }
    sup {
        margin-left: .2rem;
        cursor: pointer;
    }
`

export default ( { error, ...props } ) => {

    const { chain } = useNetwork()
    const { address } = useAccount()
    const { data: ENS } = useEnsName( { address, chainId: 1 } )
    const chain_name = chain?.id ? chain_id_to_chain_name( chain?.id ) : `this network`
    const short_id = ENS || address?.slice( 0, 10 )

    // Destructure the wallet error and take the common user-facing properties
    const { data, error: error_data, message } = error || {}
    const error_message = data?.message || error_data?.message || message || JSON.stringify( error )
    const user_facing_error = translate( error_message, chain_name, short_id )

    const show_full_error = () => alert( `Full error message: ${ JSON.stringify( error, null, 2 ) }` )

    if( !error ) return
    return <ErrorLine>
        Wallet issue: { user_facing_error }
        <sup onClick={ show_full_error }>?</sup>
    </ErrorLine>

}