import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Sign from './pages/Sign'
import Verify from './pages/Verify'
import Email from './pages/Email'
import ConfirmEmail from './pages/ConfirmEmail'
import PaylinkCreate from './pages/PaylinkCreate'
import PaylinkView from './pages/PaylinkView'
import PaylinkSuccess from './pages/PaylinkSuccess'
import ManualVerify from './pages/ManualVerify'

function Router() {

	// ///////////////////////////////
	// States
	// ///////////////////////////////

	// ///////////////////////////////
	// Lifecycle
	// ///////////////////////////////



	// ///////////////////////////////
	// Rendering
	// ///////////////////////////////
	return <Routes>
			
		
		<Route exact path='/sign' element={ <Sign /> } />
		<Route exact path='/sign/:signature_request' element={ <Sign /> } />

		<Route exact path='/email' element={ <Email /> } />
		<Route exact path='/email/:notice' element={ <Email /> } />
		<Route exact path='/email/confirm/:verification_uid' element={ <ConfirmEmail /> } />


		<Route exact path='/verify/:message/' element={ <Verify /> } />
		<Route exact path='/verify/:message/:share' element={ <Verify /> } />
		<Route exact path='/manualverify/' element={ <ManualVerify /> } />

		<Route exact path='/pay/create' element={ <PaylinkCreate /> } />
		<Route exact path='/pay/success/' element={ <PaylinkSuccess /> } />
		<Route exact path='/pay/success/:chain_id/:tx_hash' element={ <PaylinkSuccess /> } />
		<Route exact path='/pay/:payment_string' element={ <PaylinkView /> } />
		<Route exact path='/pay/:payment_string/:action' element={ <PaylinkView /> } />

		<Route exact path='/' element={ <Home /> } />
		<Route exact path='/:signature_request' element={ <Home /> } />

	</Routes>

}

export default Router
