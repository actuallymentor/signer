const Web3 = require( 'web3' )
const { log } = require('../helpers')
const web3 = new Web3()

exports.decode_signature_object = function( { claimed_message, signed_message, claimed_signatory } ) {

	// Decode message
	const confirmed_signatory = web3.eth.accounts.recover( claimed_message, signed_message )

	// If the signature does not belongs to the claimed signatory, reject
	log( `Comparing claimed signatory ${ claimed_signatory } to confirmed signatory ${ confirmed_signatory }` )
	if( claimed_signatory.toLowerCase() !== confirmed_signatory.toLowerCase() ) throw new Error( `Signature did not belong to claimed signatory` )

	// Validate message
	const message_object = JSON.parse( claimed_message )
	const { ENS, address, email } = message_object
	if( !address || !email ) throw new Error( `Signature is missing data` )

	// If all is well, return the message object
	return message_object

}