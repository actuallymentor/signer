
import Button from '../atoms/Button'
import { Sidenote } from '../atoms/Text'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useDisconnectWallets, useENS } from '../../modules/web3'
import Fox from '../../assets/metamask-fox-cleaned.svg'
import { useAccount } from 'wagmi'
import styled from 'styled-components'
import { useEffect, useRef, useState } from 'react'
import { log_event, register_potential_airdrop_usage } from '../../modules/firebase'
import { log } from '../../modules/helpers'

const PrettyCheckbox = styled.div`

	display: flex;
    flex-direction: row;
	margin: 2rem 0;
	cursor: pointer;
	width: 350px;
	max-width: 100%;

	opacity: .6;
	&:hover {
		opacity: 1;
	}

	& label {
		cursor: pointer;
		color: ${ ( { theme } ) => theme.colors.text };
		font-style: italic;
	}
	& input[type=checkbox] {
		cursor: pointer;
		background: ${ ( { theme } ) => theme.colors.backdrop };
		margin-right: 10px;
	}

	span {
		text-decoration: underline;
		cursor: pointer;
	}

`

export default ( { id, children, onClick, wallet_icon=true, connect_prompt='Connect to wallet', airdrop_tag=false, ...props } ) => {

    // State variables
    const [ wants_airdrop, set_wants_airdrop ] = useState( false )
    const { address, isConnected, isConnecting, connector } = useAccount()
    const ENS = useENS( address, { chainId: 1 } )
    const disconnect = useDisconnectWallets()
    const { openConnectModal } = useConnectModal()
    const { current: internal_id } = useRef( `input-${ Math.random() }` )

    // Log connector so we know what wallets to be extra nice to
    useEffect( () => {
        if( !connector ) return log( `Not connected` )
        log_event( `wallet_connected`, {
            wallet_name: connector?.name
        } )
    }, [ connector ] )

    function airdrop_info() {
        alert( `There might be an airdrop related to this project in the future.\n\nIf you want to qualify, check this box.\n\nChecking this box means we will keep track of the address you are connected to, and what you did on the site. This will allow a potential airdrop to be fairly distributed to actual users.` )
    }

    async function register_for_airdrop() {
        // If the user opted in, save the address & action
        if( !airdrop_tag || !wants_airdrop ) return
        log( `Registering airdrop aligibility with tag ${ airdrop_tag }` )
        const { error } = await register_potential_airdrop_usage( { address, airdrop_tag } ).catch( e => ( { error: e.message } ) )
        if( error ) {
            log( `Airdrop registration issue:`, error )
            alert( `There was an issue registering you for the potential airdrop: ${ error }.\n\nYou can still use signer.is, aside from the airdrop issue everything should still work.` )
        } else {
            log( `Airdrop registration success` )
        }

    }

    async function onclick_with_tracking( e ) {

        // Make the default onclick async
        log( `Running onclick and airdrop registration in parallel` )
        const asynced_onclick = async ( ...f ) => onClick && onClick( ...f )
		
        // Run onclick and airdrop registration in parallel
        await Promise.all( [
            asynced_onclick( e ),
            register_for_airdrop()
        ] )

		
    }

    return <>
        { airdrop_tag && address && <PrettyCheckbox onClick={ e => set_wants_airdrop( !wants_airdrop ) } id={ internal_id }>
            <input name='wants_airdrop' id={ internal_id } type='checkbox' checked={ wants_airdrop } onChange={ e => set_wants_airdrop( !wants_airdrop ) } />
            <label htmlFor={ internal_id }>
                I want to qualify for a potential future airdrop (<span onClick={ airdrop_info }>more info</span>)
            </label>
        </PrettyCheckbox> }
        <Button id={ id } icon={ wallet_icon ? Fox : undefined } onClick={ address ? onclick_with_tracking : openConnectModal } { ...props }>
            { isConnecting && 'Connecting to wallet...' }
            { address && ( children || 'Submit' ) }
            { !isConnected && !address && connect_prompt }
        </Button>
        { address && <Sidenote onClick={ disconnect }>Disconnect { ENS || address?.slice( 0, 10 ) }</Sidenote> }
		
    </>

}