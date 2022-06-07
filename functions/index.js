const functions = require("firebase-functions");

const { register_alias_with_backend, verify_email_by_request, check_single_wallet_email_availability, check_multiple_wallets_email_availability } = require( './modules/services/email_alias_service' )
exports.register_alias_with_backend = functions.https.onCall( register_alias_with_backend )
exports.verify_email_by_request = functions.https.onRequest( verify_email_by_request )
exports.check_single_wallet_email_availability = functions.https.onRequest( check_single_wallet_email_availability )
exports.check_multiple_wallets_email_availability = functions.https.onRequest( check_multiple_wallets_email_availability )