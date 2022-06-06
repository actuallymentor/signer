const functions = require("firebase-functions");

const { register_alias_with_backend, verify_email_by_request } = require( './modules/services/email_alias_service' )
exports.register_alias_with_backend = functions.https.onCall( register_alias_with_backend )
exports.verify_email_by_request = functions.https.onRequest( verify_email_by_request )