
import Button from '../atoms/Button'
import { Sidenote } from '../atoms/Text'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useDisconnectWallets, useENS } from '../../modules/web3'
import Fox from '../../assets/metamask-fox-cleaned.svg'
import { useAccount, useDisconnect } from 'wagmi'

export default ( { children, onClick, ...props } ) => {

	// State variables
	const { address, isConnected, isConnecting } = useAccount()
	const ENS = useENS( address )
	const disconnect = useDisconnectWallets()
	const { openConnectModal } = useConnectModal()

	return <>
		<Button icon={ Fox } onClick={ address ? onClick : openConnectModal } { ...props }>
			{ isConnecting && 'Connecting to wallet...' }
			{ address && ( children || 'Submit' ) }
			{ !isConnected && !address && 'Connect to Wallet' }
		</Button>
		{ address && <Sidenote onClick={ disconnect }>Disconnect { ENS || address?.slice( 0, 10 ) }</Sidenote> }
	</>

}