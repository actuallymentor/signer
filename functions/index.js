const functions = require("firebase-functions");

/* ///////////////////////////////
// Email forwarding functions
// /////////////////////////////*/
const { register_alias_with_backend, verify_email_by_request, check_single_wallet_email_availability, check_multiple_wallets_email_availability } = require( './modules/services/email_alias_service' )
exports.register_alias_with_backend = functions.https.onCall( register_alias_with_backend )
exports.verify_email_by_request = functions.https.onRequest( verify_email_by_request )
exports.check_single_wallet_email_availability = functions.https.onRequest( check_single_wallet_email_availability )
exports.check_multiple_wallets_email_availability = functions.https.onRequest( check_multiple_wallets_email_availability )

// Metrics functions
const { seed_email_metrics, increment_email_metrics_on_write, public_metrics } = require( './modules/services/email_alias_service' )
exports.seed_email_metrics = functions.https.onCall( seed_email_metrics )
exports.email_statistics = functions.firestore.document( `verified_email_aliases/{ wallet }` ).onWrite( increment_email_metrics_on_write )
exports.public_metrics = functions.https.onRequest( public_metrics )