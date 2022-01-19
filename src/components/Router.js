import Login from './pages/Login'
import Sign from './pages/Sign'
import Verify from './pages/Verify'
import { Routes, Route } from 'react-router-dom'


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
			
		<Route exact path='/' element={ <Login /> } />
		<Route exact path='/sign' element={ <Sign /> } />
		<Route exact path='/verify/:message/' element={ <Verify /> }>
			<Route exact path='/verify/:message/:share' element={ <Verify /> } />
		</Route>

	</Routes>

}

export default Router
