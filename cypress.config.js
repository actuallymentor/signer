const { defineConfig } = require( 'cypress' )
module.exports = defineConfig( {

    defaultCommandTimeout: 60000,
    requestTimeout: 60000,
    video: process.env.CYPRESS_API_URL ? false : true,
    videoCompression: false,
    screenscreenshotOnRunFailureshots: true,
    chromeWebSecurity: false,
    watchForFileChanges: false,
    projectId: 'irrelevant',

    e2e: {

        // testIsolation
        // supportFile

        // Experimental flag that restores the old "run all" button, may have bugs
        experimentalRunAllSpecs: true,
		
        setupNodeEvents( on, config ) {

            // Set up failfast
            require( "cypress-fail-fast/plugin" )( on, config )
			
            // Load environment variables
            let envFile = '.env'

            // // If in offline dev, use development env
            // if( process.env.NODE_ENV == 'development' ) envFile = '.env.development'

            // // If in CI use .env since the workflows write to that file on run
            // if( process.env.CI ) envFile = '.env'

            const dotenvConfig = {
                path: `${ __dirname }/${ envFile }`
            }
            console.log( `Runing cypress with ${ process.env.NODE_ENV }, director ${ process.env.CYPRESS_API_URL }, and ${ envFile }` )

            require( 'dotenv' ).config( dotenvConfig )

            config.env.REACT_APP_publicUrl = process.env.REACT_APP_publicUrl
            return config
		

        },
        specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
        baseUrl: "http://localhost:3000",

    }

} )