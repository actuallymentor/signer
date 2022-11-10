import { useEffect, useState } from "react"
import { erc20ABI, useAccount, useContractWrite, useNetwork, usePrepareContractWrite, usePrepareSendTransaction, useSendTransaction } from "wagmi"
import { log } from "../helpers"
import { eth_to_gwei, num_to_bignumber } from "../web3/conversions"

/* ///////////////////////////////
// ETH transaction
// /////////////////////////////*/
const useTransactETH = ( recipient, amount, enabled=true ) => {

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
    log( `${ enabled ? '' : 'NOT ' }Preparing ETH transaction to ${ recipient } for ${ amount } on ${ chain?.id }: `, prepared_transaction )
    const { config: transaction_config, error: transaction_error } = usePrepareSendTransaction( prepared_transaction )

    // Prepare transaction function
    const { sendTransactionAsync, ...rest_of_tx_meta } = useSendTransaction( {
        ...transaction_config,
    } )

    log( `useTransactETH Errors: `, transaction_error, ` resulting write meta: `, rest_of_tx_meta )
    return [ sendTransactionAsync, transaction_error ]

}

/* ///////////////////////////////
// ERC20 approval
// /////////////////////////////*/
const useApproveERC20 = ( recipient, amount, token, enabled=true ) => {

    const { chain } = useNetwork()

    const prepared_contract_function = {
        // Only specify address when connected to polygon
        address: token?.address?.[ chain?.id || 1 ],
        abi: erc20ABI,
        functionName: 'balanceOf',
        args: [ recipient ],
        chainId: chain?.id,
        enabled
    }
    log( `${ enabled ? '' : 'NOT ' }Preparing ERC20 approval to ${ recipient } for ${ amount } on ${ chain?.id }: `, prepared_contract_function )

    // Polygon-specific interfaces
    const { config: weth_contract_config, error: contract_error } = usePrepareContractWrite( prepared_contract_function )

    // Prepare the writing function
    const { writeAsync, ...rest_of_contract_meta } = useContractWrite( {
        ...weth_contract_config,
        onError: err => log( `🛑  useContractWrite`, err )
    } )

    log( `Errors: `, contract_error, ` resulting write meta: `, rest_of_contract_meta )
    return [ writeAsync, contract_error ]
}

/* ///////////////////////////////
// ERC20 transaction
// /////////////////////////////*/
const useTransactERC20 = ( recipient, amount, token, enabled=true ) => {

    const { chain } = useNetwork()

    const prepared_contract_function = {
        // Only specify address when connected to polygon
        address: token?.address?.[ chain?.id || 1 ],
        abi: erc20ABI,
        functionName: 'transfer',
        args: [ recipient, num_to_bignumber( amount, token?.decimals ) ],
        chainId: chain?.id,
        enabled
    }
    log( `${ enabled ? '' : 'NOT ' }Preparing ERDC20 transaction to ${ recipient } for ${ amount } on ${ chain?.id }: `, prepared_contract_function )

    // Polygon-specific interfaces
    const { config: weth_contract_config, error: contract_error } = usePrepareContractWrite( prepared_contract_function )

    // Prepare the writing function
    const { writeAsync, ...rest_of_contract_meta } = useContractWrite( {
        ...weth_contract_config,
        onError: err => log( `🛑  useContractWrite`, err )
    } )

    log( `useTransactERC20 Errors: `, contract_error, ` resulting write meta: `, rest_of_contract_meta )
    return [ writeAsync, contract_error ]
}

/* ///////////////////////////////
// Generic transaction hook
// /////////////////////////////*/
export const useMakeTransaction = ( recipient, token, amount, l2_enabled ) => {

    const { chain } = useNetwork()
    const [ on_right_chain, set_on_right_chain ] = useState( false )
    const is_native_eth_transfer = !token?.address || token?.address == 'native'
    log( `useMakeTransaction to ${ recipient } for ${ amount } of `, token )

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

    const [ make_transaction, error ] = useTransactETH( recipient, amount, on_right_chain && is_native_eth_transfer )
    const [ make_erc20_transfer, erc20_error ] = useTransactERC20( recipient, amount, token, on_right_chain && !is_native_eth_transfer )

    return {
        on_right_chain,
        make_transaction: is_native_eth_transfer ? make_transaction : make_erc20_transfer,
        error: is_native_eth_transfer ? error : erc20_error
    }

}