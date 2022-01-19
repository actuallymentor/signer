const { location } = window
export const dev = process.env.NODE_ENV === 'development' || ( typeof location !== 'undefined' && location.href.includes( 'debug=true' ) )


export const log = ( ...messages ) => {
	if( dev ) console.log( ...messages )
}

export function setListenerAndReturnUnlistener( parent, event, callback ) {

	log( `${ event } listener requested on `, parent )

	if( !parent ) return

	// Set listener
	parent.on( event, callback )
	log( `Created ${ event } listener on `, parent )

	// Return unsubscriber
	return () => {
		log( `Unregistering ${ event } on `, parent, ' with ', callback )
		parent.removeListener( event, callback )
	}

}