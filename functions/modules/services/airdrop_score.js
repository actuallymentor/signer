const { db, increment, throw_if_invalid_context, dataFromSnap } = require("../firebase")
const { log, dev } = require("../helpers")

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

exports.export_airdrop_data = async ( data, context ) => {

    try {

        // Only allow exports in dev
        if( !dev ) throw new Error( `Function can only be manually called in a privileged environment.` )

        // Grab all accounts satisfying a condition
        const addresses = await db.collection( `usage_tracking` ).where( 'payment_link_paid', '>=', 1 ).get().then( dataFromSnap )
        log( `${ addresses.length } addresses satisfy condition` )

    } catch( e ) {
        log( `Error exporting airdrop data: `, e )
        return { error: e.message }
    }

}