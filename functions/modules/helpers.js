const functions = require( 'firebase-functions' )
const { environment } = functions.config()
const dev = !!process.env.development

// Dev Logger
const log = ( ...comments ) => {
    const now = new Date()
    if( dev || environment?.verbose ) console.log( `[ ${ now.toLocaleTimeString() }:${ now.getMilliseconds() } ]`, ...comments )
}

// Production errorer
const error = ( ...comments ) => {
    console.error( ...comments )
}

// Object properties checker
const require_properties = ( obj={}, required_properties=[] ) => {

    const keys = Object.keys( obj )
    const contains_all_required = required_properties.every( key => keys.includes( key ) )
    log( `Checking keys `, keys, `against required: `, contains_all_required, ' for object ', obj )
    if( !contains_all_required ) throw new Error( `Missing required properties in request` )

}

// Object unexpected input checker
const allow_only_these_properties = ( obj, allowed_properties ) => {

    const keys = Object.keys( obj )
    const unknownProperties = keys.filter( key => !allowed_properties.includes( key ) )
    log( `Checking keys `, keys, `for non-allowed, found: `, unknownProperties )
    if( unknownProperties.length ) throw new Error( `Unknown properties given: ${ unknownProperties.join( ', ' ) }` )

}

const wait = ( durationinMs=1000 ) => new Promise( resolve => setTimeout( resolve, durationinMs ) )

/* ///////////////////////////////
// Retryable & throttled async
// /////////////////////////////*/
const Throttle = require( 'promise-parallel-throttle' )
const Retrier = require( 'promise-retry' )

/**
* Make async function (promise) retryable
* @param { function } async_function The function to make retryable
* @param { string } logging_label The label to add to the log entries
* @param { number } retry_times The amount of times to retry before throwing
* @param { number } cooldown_in_s The amount of seconds to wait between retries
* @param { boolean } cooldown_entropy Whether to add entropy to the retry delay to prevent retries from clustering in time
* @returns { function } An async function (promise) that will retry retry_times before throwing
*/
function make_retryable( async_function, logging_label='unlabeled retry', retry_times=5, cooldown_in_s=10, cooldown_entropy=true ) {

    // Formulate retry logic
    const retryable_function = () => Retrier( ( do_retry, retry_counter ) => {

        // Failure handling
        return async_function().catch( async e => {

            // If retry attempts exhausted, throw out
            if( retry_counter >= retry_times ) {
                log( `♻️🚨 ${ logging_label } retry failed after ${ retry_counter } attempts: ${ e.message }` )
                throw e
            }

            // If retries left, retry with a progressive delay
            const entropy = !cooldown_entropy ? 0 :  .1 + Math.random() 
            const cooldown_in_ms = ( cooldown_in_s + entropy ) * 1000
            const cooldown = cooldown_in_ms +  cooldown_in_ms * ( retry_counter - 1 ) 
            log( `♻️ ${ logging_label } retry failed ${ retry_counter }x, waiting for ${ cooldown / 1000 }s: ${ e.message }` )
            await wait( cooldown )
            log( `♻️ ${ logging_label } cooldown complete, continuing...` )
            return do_retry()

        } )

    } )

    return retryable_function

}

/**
* Make async function (promise) retryable
* @param { array } async_function_array Array of async functions (promises) to run in throttled parallel
* @param { number } max_parallell The maximum amount of functions allowed to run at the same time
* @param { string } logging_label The label to add to the log entries
* @param { number } retry_times The amount of times to retry before throwing
* @param { number } cooldown_in_s The amount of seconds to wait between retries
* @returns { Promise } An async function (promise) that will retry retry_times before throwing
*/
async function throttle_and_retry( async_function_array=[], max_parallell=2, logging_label, retry_times, cooldown_in_s ) {

    // Create array of retryable functions
    const retryable_async_functions = async_function_array.map( async_function => {
        const retryable_function = make_retryable( async_function, logging_label, retry_times, cooldown_in_s )
        return retryable_function
    } )

    // Throttle configuration
    const throttle_config = {
        maxInProgress: max_parallell	
    }

    // Return throttler
    return Throttle.all( retryable_async_functions, throttle_config )

}


module.exports = {
    throttle_and_retry,
    make_retryable,
    dev,
    log,
    require_properties,
    allow_only_these_properties,
    wait,
    error
}