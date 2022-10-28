import { useEffect, useState } from 'react'
import { log } from '../../modules/helpers'
import Button from '../atoms/Button'
import { useAccountModal, useConnectModal } from '@rainbow-me/rainbowkit'
import Fox from '../../assets/metamask-fox-cleaned.svg'
import { useAccount } from 'wagmi'

export default ( { children, onClick, ...props } ) => {

	// State variables
	const { address, isConnected, isConnecting } = useAccount()
	const { openConnectModal } = useConnectModal()

	return <Button icon={ Fox } onClick={ address ? onClick : openConnectModal } { ...props }>
		{ isConnecting && 'Connecting to wallet...' }
		{ address && ( children || 'Submit' ) }
		{ !isConnected && !address && 'Connect to Wallet' }
	</Button>

}