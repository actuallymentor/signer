// Firebase interactors
const { initializeApp } = require( "firebase-admin/app" )
const { getFirestore, FieldValue } = require(  'firebase-admin/firestore' )
const { log, dev } = require( './helpers' )

const app = initializeApp()
const db = getFirestore( app )

const dataFromSnap = ( snapOfDocOrDocs, withDocId=true ) => {
	
	// If these are multiple docs
	if( snapOfDocOrDocs.docs ) return snapOfDocOrDocs.docs.map( doc => ( { uid: doc.id, ...doc.data( ) } ) )

	// If this is a single document
	return { ...snapOfDocOrDocs.data(), ...( withDocId && { uid: snapOfDocOrDocs.id } ) }

}

const throw_if_invalid_context = context => {

	return log( `APP CHECK DISABLED` )

	if( dev ) return log( '⚠️ DEV detected, skipping app context check' )

	// Appcheck validation
	if( context.app == undefined ) {
		throw new Error( `App context error` )
	}

}

module.exports = {
	app,
	db,
	dataFromSnap,
	throw_if_invalid_context,
	increment: FieldValue.increment
}