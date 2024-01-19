import { useAccount, useEnsName, useNetwork } from 'wagmi'
import { useDisconnectWallets } from '../../modules/web3'
import { chain_id_to_chain_name } from '../../modules/web3/chains'
import Button from '../atoms/Button'
import { ErrorLine } from '../atoms/ErrorLine'

const translate = ( string, chain_name, account_or_ens ) => {

    // Translate technical messages to user-friendly messages
    if( string.includes( 'insufficient funds' ) || string.includes( 'exceeds balance' ) ) return `The balance of ${ account_or_ens } is too low on ${ chain_name }.`

    // Default: return original string
    return string
}

export default ( { error, ...props } ) => {

    const { chain } = useNetwork()
    const { address } = useAccount()
    const { data: ENS } = useEnsName( { address, chainId: 1 } )
    const chain_name = chain?.id ? chain_id_to_chain_name( chain?.id ) : `this network`
    const short_id = ENS || address?.slice( 0, 10 )
    const disconnect = useDisconnectWallets()

    // Destructure the wallet error and take the common user-facing properties
    const { data, error: error_data, message } = error || {}
    const error_message = data?.message || error_data?.message || message || JSON.stringify( error )
    const user_facing_error = translate( error_message, chain_name, short_id )

    const show_full_error = () => alert( `Full error message: ${ JSON.stringify( error, null, 2 ) }` )

    if( !error ) return
    return <>
        <ErrorLine { ...props }>
            Wallet issue: { user_facing_error }
            <sup onClick={ show_full_error }>?</sup>
        </ErrorLine>
        { address && <Button margin="2rem 0 0 0" onClick={ disconnect }>Disconnect { ENS || address?.slice( 0, 10 ) }</Button> }
    </>

}