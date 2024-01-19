// Import custom commands
import './commands'

// Import failfast
import "cypress-fail-fast"

// Stub google analytics requests
beforeEach( () => {

    if( !cy.connect_metamask ) cy.log( `MISSING CUSTOM COMMANDS: `, cy.connect_metamask )

    cy.intercept( 'https://www.googletagmanager.com/**/*', { middleware: true }, req => {

        // Disable request caching
        req.on( 'before:response', ( res ) => {
            // force all API responses to not be cached
            res.headers['cache-control'] = 'no-store'
        } )

        // Respond with a stubbed function
        req.reply( ' () => console.log( "Stubbed Google Analytics" )' )

    } ).as( 'google_tag_stub' )


} )

// Uncaught errors should no kill tests
// Cypress.on('uncaught:exception', (err, runnable) => {

// 	Cypress.log( err )

// 	// returning false here prevents Cypress from
// 	// failing the test
// 	return false

// })

/* ///////////////////////////////
// CI video quality assurance
// Based on: https://www.cypress.io/blog/2021/03/01/generate-high-resolution-videos-and-screenshots/
// /////////////////////////////*/
// let's increase the browser window size when running headlessly
// this will produce higher resolution images and videos
// https://on.cypress.io/browser-launch-api
Cypress.on( 'before:browser:launch', ( browser = {}, launchOptions ) => {

    console.log(
        'launching browser %s is headless? %s',
        browser.name,
        browser.isHeadless,
    )

    // the browser width and height we want to get
    // our screenshots and videos will be of that resolution
    const width = 1920
    const height = 1080

    console.log( 'setting the browser window size to %d x %d', width, height )

    if( browser.name === 'chrome' && browser.isHeadless ) {
        launchOptions.args.push( `--window-size=${ width },${ height }` )

        // force screen to be non-retina and just use our given resolution
        launchOptions.args.push( '--force-device-scale-factor=1' )

        // Force devtools open
        // See: https://github.com/cypress-io/cypress/issues/2024
        launchOptions.args.push( '--auto-open-devtools-for-tabs' )

    }

    if( browser.name === 'electron' && browser.isHeadless ) {
    // might not work on CI for some reason
        launchOptions.preferences.width = width
        launchOptions.preferences.height = height
        launchOptions.preferences.devTools = true
    }

    if( browser.name === 'firefox' && browser.isHeadless ) {
        launchOptions.args.push( `--width=${ width }` )
        launchOptions.args.push( `--height=${ height }` )
        launchOptions.args.push( '-devtools' )
    }

    // IMPORTANT: return the updated browser launch options
    return launchOptions
} )