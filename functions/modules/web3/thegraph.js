const fetch = require( 'isomorphic-fetch' ) // Apollo client requires global fetch for some reason
const { createClient } = require( 'urql' )
const { log } = require( '../helpers' )
const APIURL = `https://api.thegraph.com/subgraphs/name/ensdomains/ens`
const client = createClient( { url: APIURL } )

const timeout_with_data = ms => new Promise( resolve => {

    setTimeout( f => resolve( { data: { domains:  [ {} ] } } ), ms )

} )

exports.get_address_of_ens = async function( ENS ) {

    try {

        const ens_query = `
			query {
				domains(where: { name: "${ ENS }" }) {
					resolvedAddress {
						id
					}
				}
			}
		`

        log( `Querying the graph with `, ens_query )
        const { data: ens_data } = await Promise.race( [
            timeout_with_data( 3000 ),
            client.query( ens_query ).toPromise().catch( e => ( { data: {} } ) )
        ] )

        log( `The graph returned: `, ens_data )

        // Destructure the graph data
        const resolved_address = ens_data?.domains[0]?.resolvedAddress?.id
        log( `${ ENS } resolved to ${ resolved_address }` )

        if( !resolved_address ) throw new Error( `Unable to determine resolved address for ${ ENS }` )

        return resolved_address

    } catch ( e ) {
        log( `Graph error: `, e )
        throw new Error( `Thegraph errored, this is not your fault. Please contact the Signer.is team.` )
    }

}

exports.get_ensses_of_address = async function( address ) {

    try {

        const ens_query = `
			query {
				domains(where: { resolvedAddress: "${ address }" }) {
					resolvedAddress {
						id
					}
				}
			}
		`

        log( `Querying the graph with `, ens_query )
        const { data: ens_data } = await Promise.race( [
            timeout_with_data( 3000 ),
            client.query( ens_query ).toPromise().catch( e => ( { data: {} } ) )
        ] )

        log( `The graph returned: `, ens_data )

        // Destructure the graph data
        const enssses = ens_data?.domains.map( ( { name } ) => name )
        log( `${ address } resolved to ${ enssses.join( ', ' ) }` )

        return enssses

    } catch ( e ) {
        log( `Graph error: `, e )
        throw new Error( `Thegraph errored, this is not your fault. Please contact the Signer.is team.` )
    }

}