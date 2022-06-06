import { useEffect, useState } from 'react'
import { useAddress, getAddress } from '../../modules/web3'
import { log } from '../../modules/helpers'
import Button from '../atoms/Button'

import Fox from '../../assets/metamask-fox-cleaned.svg'

export default ( { children, onClick, ...props } ) => {

	// State variables
	const address = useAddress()
	const [ internalAddress, setInternalAddress ] = useState()
	const [ loading, setLoading ] = useState(  )

	// On address change, set internal address
	useEffect( f => {

		log( `Listener address changed` )
		setInternalAddress( address )

	}, [ address ] )

	// Connect to metamask
	async function connect_to_metamask(  ) {

		try {

			// Set loading indicator
			setLoading( `Connecting to Metamask...` )

			// Connect to metamask
			const selected_address = await getAddress()
			log( `User selecred ${ selected_address }` )

			// Set internal state since the listener takes a while sometimes
			setInternalAddress( selected_address )

		} catch( e ) {
			log( `Metamask error: `, e )
			alert( e.message )
		} finally {
			setLoading( false )
		}

	}

	if( loading ) return <Button icon={ Fox }>
		Connecting to metamask...
	</Button>

	return <Button icon={ Fox } onClick={ internalAddress ? onClick : connect_to_metamask } { ...props }>
		{ internalAddress && ( children || 'Submit' ) }
		{ !internalAddress && 'Connect to Metamask' }
	</Button>

}