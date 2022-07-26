const { location } = window
export const dev = process.env.NODE_ENV === 'development' || ( typeof location !== 'undefined' && location.href.includes( 'debug=true' ) )


export const log = ( ...messages ) => {
	const now = new Date()
	if( dev ) console.log( `[ ${ now.toLocaleTimeString() }:${ now.getMilliseconds() } ]`, ...messages )
}

export function setListenerAndReturnUnlistener( parent, event, callback ) {

	if( !parent ) return log( `${ event } listener failed` )

	// Set listener
	parent.on( event, callback )
	log( `✅ Created ${ event } listener` )

	// Return unsubscriber
	return () => {
		log( `🗑 Unregistering ${ event }` )
		parent.removeListener( event, callback )
	}

}

export const wait = ( durationInMs=0 ) => new Promise( resolve => {

	setTimeout( resolve, durationInMs )

} )