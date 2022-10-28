import { HashRouter} from 'react-router-dom'
import Router from './components/Router'
import Theme from './components/Theme'
import Web3Provider from './modules/web3_provider'


function App() {

	// ///////////////////////////////
	// Rendering
	// ///////////////////////////////

	return <Theme>
		<Web3Provider>
			<HashRouter>

				<Router />

			</HashRouter>
		</Web3Provider>
	</Theme>

}

export default App;
