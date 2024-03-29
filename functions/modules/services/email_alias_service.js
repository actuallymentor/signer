const { decode_signature_object } = require( '../web3/cryptography' )
const { get_address_of_ens } = require( '../web3/thegraph' )
const { send_verification_email, send_welcome_email, send_spam_check_email } = require( '../apis/ses' )
const { register_with_improvmx } = require( '../apis/improv_mx' )
const { log, throttle_and_retry, error, dev, wait } = require( '../helpers' )
const { db, dataFromSnap, increment } = require( '../firebase' )
const { v4: uuidv4 } = require( 'uuid' )

exports.register_alias_with_backend = async function( data, context ) {

    try {

        const day_in_ms = 1000 * 60 * 60 * 24
        log( `Starting registration with data: `, data )
        await wait( 2000 )

        // Destructure signature input
        const { claimed_message, signed_message, claimed_signatory } = data

        // Decode and verify message
        const decoded_and_verified_signature = decode_signature_object( data )
        const { ENS, address, email } = decoded_and_verified_signature
        log( `Decoded data: `, decoded_and_verified_signature )
        await wait( 2000 )

        // Verify that the signatory is the owner of the requested address
        if( claimed_signatory.toLowerCase() !== address.toLowerCase() ) {
            log( `Mismatch between ${ claimed_signatory.toLowerCase() } and ${ address.toLowerCase() }` )
            await wait( 2000 )
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


    } catch ( e ) {

        error( `register_alias_with_backend error: `, e )
        return { error: e.message }

    }


}

const app = require( '../apis/express' )()
exports.verify_email_by_request = app.get( '/verify_email/:auth_token', async ( req, res ) => {

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

        // Step 2: send welcome and spam-ceck emails
        log( `Sending emails with `, address, ENS, email )
        await send_welcome_email( email, address, ENS )
        await send_spam_check_email( `${ address }@signer.is`, address, ENS )

        // Step 3, mark internally
        await db.collection( 'verified_email_aliases' ).doc( address ).set( { address, email, ENS, created: Date.now(), updated: Date.now(), updated_human: new Date().toString() } )
        await db.collection( 'unverified_email_aliases' ).doc( verification.uid ).delete()

        return res.redirect( 307, `https://signer.is/#/email/email_verified` )


    } catch ( e ) {

        log( `Error verifying email: `, e )
        return res.send( `Error verifying your email: ${ e.message }` )

    }

} )

exports.confirm_email_forwarder = async ( auth_token, context ) => {

    try {

        // Check for pending verifications while
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

        // Step 2: send welcome and spam-ceck emails
        log( `Sending emails with `, address, ENS, email )
        // await send_welcome_email( email, address, ENS )
        await send_spam_check_email( `${ address }@signer.is`, address, ENS )

        // Step 3, mark internally
        await db.collection( 'verified_email_aliases' ).doc( address ).set( { address, email, ENS, created: Date.now(), updated: Date.now(), updated_human: new Date().toString() } )
        await db.collection( 'unverified_email_aliases' ).doc( verification.uid ).delete()

        return { success: true }


    } catch ( e ) {

        log( `Error verifying email: `, e )
        return { error: e.message }

    }

}

/* ///////////////////////////////
// Check if wallets have forwards
// /////////////////////////////*/
exports.check_single_wallet_email_availability = app.get( '/check_availability/:address', async ( req, res ) => {

    try {

        // Check if wallet has registered forward
        const { address } = req.params
        const has_alias = await db.collection( 'verified_email_aliases' ).doc( address.toLowerCase() ).get().then( ( { exists } ) => exists )
        return res.json( { email_available: !!has_alias } )


    } catch ( e ) {

        log( `Error getting wallet email status: `, e )
        return res.json( { error: e.message } )

    }

} )
exports.check_multiple_wallets_email_availability = app.post( '/check_availability/', async ( req, res ) => {

    try {

        // Check if wallet has registered forward
        const { addresses } = req.body
        const list_to_check = addresses.map( address => f => db.collection( 'verified_email_aliases' ).doc( address.toLowerCase() ).get().then( ( { exists } ) => ( { exists, address } ) ) )
        const checked_for_alias = await throttle_and_retry( list_to_check, 100, `check addresses`, 2, 10 )
        const has_alias_list = checked_for_alias.filter( ( { exists } ) => exists ).map( ( { address } ) => address.toLowerCase() )
        return res.json( { emails_available: has_alias_list } )


    } catch ( e ) {

        log( `Error getting wallets email status: `, e )
        return res.json( { error: e.message } )

    }

} )

/* ///////////////////////////////
// Statistics
// /////////////////////////////*/
exports.seed_email_metrics = async function( ) {

    try {

        if( !dev ) return log( `Dev only action` )

        // Get all node data
        const email = await db.collection( 'verified_email_aliases' ).get().then( dataFromSnap )

        // Manual export for POAP usage
        return email.map( ( { uid } ) => uid ).concat( '\n' )

        // Seed metadata
        // await db.collection( 'metrics' ).doc( 'email' ).set( {
        // 	verified_email_aliases: email.length,
        // 	updated: Date.now(),
        // 	updated_human: new Date().toString(),
        // }, { merge: true } )

    } catch ( e ) {
        error( 'seed_email_metrics error: ', e )
    }

}

exports.increment_email_metrics_on_write = async function( change, context ) {

    try {

        // If this was a creation, increment
        if( change.before.exists ) await db.collection( 'metrics' ).doc( 'email' ).set( {
            verified_email_aliases: increment( 1 ),
            updated: Date.now(),
            updated_human: new Date().toString(),
        }, { merge: true } )

        // If this was a deletion, decrement
        if( !change.after.exists ) await db.collection( 'metrics' ).doc( 'email' ).set( {
            verified_email_aliases: increment( -1 ),
            updated: Date.now(),
            updated_human: new Date().toString()
        }, { merge: true } )

    } catch ( e ) {
        error( 'increment_email_metrics_on_write error: ', e )
    }

}

exports.public_metrics = app.get( '/metrics/', async ( req, res ) => {

    try {

        // Retreive metrics
        const metrics = await db.collection( 'metrics' ).doc( 'email' ).get().then( dataFromSnap )
        return res.json( metrics )


    } catch ( e ) {

        return res.json( { error: e.message } )

    }

} )