const fetch = require( 'isomorphic-fetch' )
const functions = require( 'firebase-functions' )
const { improvmx } = functions.config()
const { log, make_retryable } = require( '../helpers' )

async function register_forward_with_improvmx( alias='', to='' ) {

	/* ///////////////////////////////
	// Register alias with API */
	const endpoint = `${ improvmx.baseurl }/domains/${ improvmx.domain }/aliases`
	const options = {
		method: 'POST',
		headers:{
			Authorization: `Basic api:${ improvmx.apikey }`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify( {
			alias: alias,
			forward: to
		} )
	}

	// Call creation endpoint
	const res = await fetch( endpoint, options )

	/* ///////////////////////////////
	// Check the result of our registration */
	const api_response = await res.json()

	/* ///////////////////////////////
	// Rate limit failure */
	if( api_response.code === 429 ) throw new Error( `rate_limit` )

	/* ///////////////////////////////
	// Soft failure: alias already exists */
	if( api_response.errors?.alias?.find( entry => entry.includes( 'update the existing one' ) ) ) {

		log( `Entry exists, updating instead...` )

		const update_endpoint = `${ improvmx.baseurl }/domains/${ improvmx.domain }/aliases/${ alias }`
		const update_options = { ...options, method: 'PUT' }
		const update_response = await fetch( update_endpoint, update_options ).then( r => r.json() )

		// Rate limit failure
		if( update_response.code === 429 ) throw new Error( `rate_limit` )

		if( update_response.errors?.length ) {
			log( `Update error: `, update_response )
			throw new Error( `Error updating alias ${ alias }` )
		}

		return

	}

	// If an error ocurred, save it to the logs
	if( !api_response.success ) {
		log( `API call failed with: `, api_response )
		throw new Error( `Error creating alias` )
	}

	return

}

exports.register_with_improvmx = async function( address, ENS, email ) {

	try {

		/* ///////////////////////////////
		// Register address alias with ImprovMX */
		const alias_registration = () => register_forward_with_improvmx( address, email )
		const retryable_alias_registration = make_retryable( alias_registration, `register ${ address } to ${ email }`, 60, true )
		await retryable_alias_registration()

		if( !ENS ) return

		/* ///////////////////////////////
		// Register ENS alias with ImprovMX */
		const ens_alias_registration = () => register_forward_with_improvmx( ENS, email )
		const retryable_ens_alias_registration = make_retryable( ens_alias_registration, `register ${ ENS } to ${ email }`, 60, true )
		await retryable_ens_alias_registration()

	} catch( e ) {

		log( `ImprovMX registration error: `, e )
		throw new Error( `Error creating alias for ${ address }` )

	}

}