const { location } = window
export const dev = process.env.NODE_ENV === 'development' || ( typeof location !== 'undefined' && location.href.includes( 'debug=true' ) )


export const log = ( ...messages ) => {
	const now = new Date()
	if( dev ) console.log( `[ ${ now.toLocaleTimeString() }:${ now.getMilliseconds() } ]`, ...messages )
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

export const wait = ( durationInMs=0 ) => new Promise( resolve => {

	setTimeout( resolve, durationInMs )

} )