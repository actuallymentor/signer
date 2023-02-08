const { location } = window
export const dev = process.env.NODE_ENV === 'development' ||  typeof location !== 'undefined' && location.href.includes( 'debug=true' ) 


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

export const to_url_safe_base64 = input => btoa( encodeURIComponent( JSON.stringify( input ) ) )
export const json_from_url_safe_base64 = input => JSON.parse( decodeURIComponent( atob( input ) ) )

export const clipboard = async text => {
    if( !navigator.clipboard ) return alert( `Your browser doesn't support auto-copying text, please manually copy the link.` )
    await navigator.clipboard?.writeText( text )
    alert( 'Copied to clipboard!' )
}