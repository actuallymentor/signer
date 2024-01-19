import { initializeApp } from "firebase/app"
import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions'
import { getAnalytics, logEvent } from "firebase/analytics"
import { log } from './helpers'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'

const { VITE_apiKey, VITE_authDomain, VITE_projectId, VITE_storageBucket, VITE_messagingSenderId, VITE_appId, VITE_measurementId, VITE_APPCHECK_DEBUG_TOKEN, VITE_recaptcha_site_key } = import.meta.env

const firebaseConfig = {
    apiKey: VITE_apiKey,
    authDomain: VITE_authDomain,
    projectId: VITE_projectId,
    storageBucket: VITE_storageBucket,
    messagingSenderId: VITE_messagingSenderId,
    appId: VITE_appId,
    measurementId: VITE_measurementId
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
if( import.meta.env.VITE_useEmulator ) {
    connectFunctionsEmulator( functions, 'localhost', 5001 )
    log( `Using firebase functions emulator` )
}

// App check config
if( VITE_APPCHECK_DEBUG_TOKEN ) {
    log( `🐞 Setting debug token: `, VITE_APPCHECK_DEBUG_TOKEN )
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = VITE_APPCHECK_DEBUG_TOKEN || true
}
log( `Initialising app check with debug token ${ VITE_APPCHECK_DEBUG_TOKEN }  and recaptcha site key ${ VITE_recaptcha_site_key }`, )
initializeAppCheck( app, {
    provider: new ReCaptchaV3Provider( VITE_recaptcha_site_key ),
    isTokenAutoRefreshEnabled: true
} )


export function log_event( name, details ) {
    if( !name ) return log( `🐛 Log called without name` )
    if( import.meta.env.NODE_ENV == 'development' ) return log( '🤡 Mock analytics event: ', name, details )
    try {
        logEvent( analytics, name, details )
    } catch ( e ) {
        log( `Error logging event: `, e )
    }
}