const { decode_signature_object } = require( '../web3/cryptography' )
const { get_address_of_ens } = require( '../web3/thegraph' )
const { send_verification_email } = require( '../apis/ses' )
const { register_with_improvmx } = require( '../apis/improv_mx' )
const { log } = require( '../helpers' )
const { db, dataFromSnap } = require( '../firebase' )
const { v4: uuidv4 } = require('uuid')

exports.register_alias_with_backend = async function( data, context ) {

	try {

		const day_in_ms = 1000 * 60 * 60 * 24
		log( `Starting registration with data: `, data )

		// Destructure signature input
		const { claimed_message, signed_message, claimed_signatory } = data

		// Decode and verify message
		const decoded_and_verified_signature = decode_signature_object( data )
		const { ENS, address, email } = decoded_and_verified_signature
		log( `Decoded data: `, decoded_and_verified_signature )

		// Verify that the signatory is the owner of the requested address
		if( claimed_signatory.toLowerCase() !== address.toLowerCase() ) {
			log( `Mismatch between ${ claimed_signatory.toLowerCase() } and ${ address.toLowerCase() }` )
			throw new Error( `Signer is not the owner of requested address` )
		}

		// If the signature supplied an ENS, check with the graph whether this address resolves there
		if( ENS ) {

			const ens_resolved_address = await get_address_of_ens( ENS )
			if( ens_resolved_address.toLowerCase() !== address.toLowerCase() ) throw new Error( `This address does not appear to own that ENS` )

		}

		// Generate auth token for verification
		const auth_token = uuidv4()

		// Send verification email
		await send_verification_email( auth_token, email, address, ENS )

		// Save unverified entries
		await db.collection( 'unverified_email_aliases' ).doc( address ).set( {
			address,
			email,
			auth_token,
			ENS: ENS || false,
			verified: false,
			updated: Date.now(),
			expires: Date.now() + day_in_ms,
			updated_human: new Date().toString()
		} )

		return { success: true }


	} catch( e ) {

		log( `register_alias_with_backend error: `, e )
		return { error: e.message }

	}


}

const app = require( '../apis/express' )()
exports.verify_email_by_request = app.get( '/verify_email/:auth_token', async function( req, res ) {

	try {

		// Check for pending verifications while
		const { auth_token } = req.params
		const [ verification ] = await db.collection( 'unverified_email_aliases' ).where( 'auth_token', '==', auth_token ).limit( 1 ).get().then( dataFromSnap )

		/* ///////////////////////////////
		// Failure mode 1: Not found */
		if( !verification ) throw new Error( `This link was already used or invalid` )

		/* ///////////////////////////////
		// Failure more 2: link expired */
		if( verification.expires < Date.now() ) {
			await db.collection( 'unverified_email_aliases' ).doc( verification.uid ).delete()
			throw new Error( `This verification link has expired` )
		}

		/* ///////////////////////////////
		// Failure mode 3: ENS no longer yours */
		if( verification.ENS ) {

			const ens_address = await get_address_of_ens( verification.ENS )
			if( ens_address.toLowerCase() !== verification.address.toLowerCase() ) throw new Error( `The ENS ${ ens_address } no longer resolves to ${ verification.address }` )

		}

		/* ///////////////////////////////
		// Success: register forward
		// /////////////////////////////*/

		// Step 1, register with improvMX
		const { address, ENS, email } = verification
		await register_with_improvmx( address, ENS, email )

		// Step 2, mark internally
		await db.collection( 'verified_email_aliases' ).doc( address ).set( { address, email, ENS, created: Date.now(), updated: Date.now(), updated_human: new Date().toString() } )
		await db.collection( 'unverified_email_aliases' ).doc( verification.uid ).delete()

		return res.send( `Email verified, your alias is now operational!` )


	} catch( e ) {

		log( `Error verifying email: `, e )
		return res.send( `Error verifying your email: ${ e.message }` )

	}

} )