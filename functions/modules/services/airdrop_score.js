const { db, increment, throw_if_invalid_context } = require("../firebase")
const { log } = require("../helpers")

exports.register_potential_airdrop_usage = async ( data, context ) => {

    try {

        // Check appckech validity
        throw_if_invalid_context( context )

        // Get data
        let { address, airdrop_tag } = data
        if( !address || !airdrop_tag ) throw new Error( `Faulty tracking request` )

        // Normalisation
        address = address.toLowerCase()

        // Save data
        await db.collection( `usage_tracking` ).doc( address ).set( {
            [airdrop_tag]: increment( 1 ),
            updated: Date.now(),
            updated_human: new Date().toString()
        }, { merge: true } )

        return

    } catch( e ) {
        log( `Error in register_potential_airdrop_usage: `, e )
        return { error: e.message }
    }

}