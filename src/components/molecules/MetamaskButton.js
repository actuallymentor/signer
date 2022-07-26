import { useEffect, useState } from 'react'
import { useAddress, getAddress, useIsConnected } from '../../modules/web3'
import { log } from '../../modules/helpers'
import Button from '../atoms/Button'

import Fox from '../../assets/metamask-fox-cleaned.svg'
import { wait } from '@testing-library/user-event/dist/utils'

export default ( { children, onClick, ...props } ) => {

	// State variables
	const address = useAddress()
	const connected = useIsConnected()
	const [ loading, setLoading ] = useState(  )

	// Connect to metamask
	async function connect_to_metamask(  ) {

		try {

			// Set loading indicator
			setLoading( `Connecting to Metamask...` )

			// Connect to metamask
			const selected_address = await getAddress()
			log( `User selected ${ selected_address }` )


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

	return <Button icon={ Fox } onClick={ address ? onClick : connect_to_metamask } { ...props }>
		{ !connected && 'Checking for web3...' }
		{ address && ( children || 'Submit' ) }
		{ connected && !address && 'Connect to Metamask' }
	</Button>

}