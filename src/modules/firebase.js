import { initializeApp } from "firebase/app"
import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions'
import { getAnalytics, logEvent } from "firebase/analytics"
import { log } from './helpers'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'

const { REACT_APP_apiKey, REACT_APP_authDomain, REACT_APP_projectId, REACT_APP_storageBucket, REACT_APP_messagingSenderId, REACT_APP_appId, REACT_APP_measurementId, REACT_APP_APPCHECK_DEBUG_TOKEN, REACT_APP_recaptcha_site_key } = process.env

const firebaseConfig = {
  apiKey: REACT_APP_apiKey,
  authDomain: REACT_APP_authDomain,
  projectId: REACT_APP_projectId,
  storageBucket: REACT_APP_storageBucket,
  messagingSenderId: REACT_APP_messagingSenderId,
  appId: REACT_APP_appId,
  measurementId: REACT_APP_measurementId
}

log( `Init firebase with `, firebaseConfig )

export const app = initializeApp( firebaseConfig )
export const analytics = getAnalytics( app )
const functions = getFunctions( app )

// Remote functions
export const register_alias_with_backend = httpsCallable( functions, 'register_alias_with_backend' )
export const confirm_email_forwarder = httpsCallable( functions, 'confirm_email_forwarder' )
export const register_potential_airdrop_usage = httpsCallable( functions, 'register_potential_airdrop_usage' )

// Offline functions emulator
// Connect to functions emulator
if( process.env.REACT_APP_useEmulator ) {
  connectFunctionsEmulator( functions, 'localhost', 5001 )
  log( `Using firebase functions emulator` )
}

// App check config
if( REACT_APP_APPCHECK_DEBUG_TOKEN ) {
	log( `🐞 Setting debug token: `, REACT_APP_APPCHECK_DEBUG_TOKEN )
	self.FIREBASE_APPCHECK_DEBUG_TOKEN = REACT_APP_APPCHECK_DEBUG_TOKEN || true
}
log( `Initialising app check with debug token ${ REACT_APP_APPCHECK_DEBUG_TOKEN }  and recaptcha site key ${ REACT_APP_recaptcha_site_key }`, )
const appcheck = initializeAppCheck( app, {
	provider: new ReCaptchaV3Provider( REACT_APP_recaptcha_site_key ),
	isTokenAutoRefreshEnabled: true
} )


export function log_event( name, details ) {
	if( !name ) return log( `🐛 Log called without name` )
	if( process.env.NODE_ENV == 'development' ) return log( '🤡 Mock analytics event: ', name, details )
	try {
		logEvent( analytics, name, details )
	} catch( e ) {
		log( `Error logging event: `, e )
	}
}