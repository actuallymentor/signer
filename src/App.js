import { HashRouter } from 'react-router-dom'
import Router from './components/Router'
import Theme from './components/Theme'
import Web3Provider from './modules/web3_provider'


function App() {

    // CRA changed the handling of node dependencies resulting in Buffer not being defined on the window object. This is required for wagmi
    window.Buffer = window.Buffer || require( "buffer" ).Buffer

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

export default App
