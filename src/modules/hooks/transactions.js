import { useEffect, useState } from "react"
import { useNetwork, usePrepareSendTransaction, useSendTransaction } from "wagmi"
import { log } from "../helpers"
import { eth_to_gwei } from "../web3/conversions"

const useTransactETH = ( recipient, amount, enabled=true ) => {

    const [ error, set_error ] = useState(  )
    const { chain } = useNetwork()

    // Keep a prepared transaction
    const prepared_transaction = {
        request: {
            to: recipient,
            value: eth_to_gwei( amount ),
            chainId: chain?.id || 1
        },
        enabled
    }
    const { config: transaction_config, error: transaction_error } = usePrepareSendTransaction( prepared_transaction )

    if( transaction_error && !error ) {
        log( `Transaction error: `, transaction_error )
        set_error( transaction_error )
    }

    // Prepare transaction function
    const { sendTransactionAsync, ...rest_of_transaction_meta } = useSendTransaction( {
        ...transaction_config,
        onError: err => log( `🛑  useSendTransaction`, err )
    } )

    async function validateAndSend() {

        log( `Prepared transaction: `, prepared_transaction )
        log( `Transaction config: `, transaction_config )
        log( `useSendTransaction meta: `, rest_of_transaction_meta )

        if( error ) {
            log( `Cannot transact error: `, error )
            throw new Error( `${ error.code }` )
        }

        // Execute transaction
        const { hash: tx_hash } = await sendTransactionAsync()
        return { tx_hash }

    }

    return validateAndSend

}

export const useMakeTransaction = ( recipient, token, amount, l2_enabled ) => {

    const { chain } = useNetwork()
    const [ on_right_chain, set_on_right_chain ] = useState( false )

    // Check for chain validity
    useEffect( () => {

        if( !token || !chain ) return

        // Check if we are on a valid chain
        const { chain_ids } = token
        log( `Chain switched to `, chain, ` checking against `, chain_ids[0] )

        // If no L2, then just first chain ID in config
        if( !l2_enabled && chain_ids[0] != chain?.id ) return set_on_right_chain( false )
        if( !l2_enabled && chain_ids[0] == chain?.id ) return set_on_right_chain( true )
        

        // If L2 enabled, check if we are on an allowed chain
        if( chain_ids.includes( chain?.id ) ) return set_on_right_chain( true )
        return set_on_right_chain( false )

    }, [ chain, token ] )

    const make_transaction = useTransactETH( recipient, amount, on_right_chain )

    return { on_right_chain, make_transaction }

}