import { initializeApp } from "firebase/app"
import { getAnalytics, logEvent } from "firebase/analytics"
import { log } from './helpers'

const { REACT_APP_apiKey, REACT_APP_authDomain, REACT_APP_projectId, REACT_APP_storageBucket, REACT_APP_messagingSenderId, REACT_APP_appId, REACT_APP_measurementId } = process.env

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
export const log_event = event => {
  try {
    log( `Analytics event: `, event )
    logEvent( analytics, event )
  } catch( e ) {
    log( 'analytics error: ', e )
  }
}