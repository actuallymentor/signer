import { mock_user_signature, user_ens, message_to_sign, signature_link } from "../../fixtures/web3"

context( "Signature tests", () => {

    // Load web3 wallet
    beforeEach( mock_user_signature )

    it( 'Can connect & disconnect wallet', () => {

		// Visit code claim page
		cy.visit( `/sign` )

        // Connection works
        cy.contains( `hereby sign` )
        cy.connect_metamask()
        cy.contains( `I ${ user_ens }` )
        cy.contains( `Sign message` )

        // Disconnection workd
        cy.contains( `Disconnect` ).click()
        cy.connect_metamask()

	} )

    it( `Fails without content`, () => {

        // Catch alerts
        cy.on( 'window:alert', response => {

            expect( response ).to.contain( `No message input` )

        } )

        // Connect 
        cy.visit( `/sign` )
        cy.connect_metamask()
        cy.contains( `Sign message` ).click()

    } )

    it( `Can sign a message`, () => {

        // Catch alerts
        cy.on( 'window:alert', response => {

            expect( response ).to.contain( `Copied to clipboard` )

        } )

        cy.visit( `/sign` )
        cy.connect_metamask()

        cy.get( `textarea#sign-message-input` ).type( message_to_sign )
        cy.contains( `Sign message` ).click()

        cy.contains( `Share this message` )
        cy.contains( `Copy link` )
        cy.get( `#verify-share-input` ).click()
        cy.contains( signature_link )

    } )


} )