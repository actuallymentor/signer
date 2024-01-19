import { BrowserRouter } from 'react-router-dom'
import Router from './components/Router'
import Theme from './components/Theme'
import { useRedirectOldHashpoundUrls } from './modules/hooks/backwards_compatibility'
import Web3Provider from './modules/web3_provider'

/* ///////////////////////////////
// Ideosyncratic fixes
// /////////////////////////////*/

// Rainbowkit polyfills, see https://github.com/rainbow-me/rainbowkit/blob/main/examples/with-vite/src/polyfills.ts
import { Buffer } from 'buffer'
window.global = window.global ?? window
window.Buffer = window.Buffer ?? Buffer
window.process = window.process ?? { env: {} } // Minimal process polyfill

function App() {
    
    // Redirect hash to nonhash urls
    useRedirectOldHashpoundUrls()

    // ///////////////////////////////
    // Rendering
    // ///////////////////////////////
    
    return <Theme>
        <Web3Provider>
            <BrowserRouter>

                <Router />

            </BrowserRouter>
        </Web3Provider>
    </Theme>

}

export default App
