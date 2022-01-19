import { HashRouter} from 'react-router-dom'
import Router from './components/Router'
import Theme from './components/Theme'


function App() {

	// ///////////////////////////////
	// Rendering
	// ///////////////////////////////

	return <Theme>
		<HashRouter>
		
			<Router />

		</HashRouter>
	</Theme>

}

export default App;
