import { rp_signature_string_invalid, rp_signature_string_valid } from "../../fixtures/web3"

context( "Manual signature verification", () => {


    it( `Can verify a message`, () => {

        cy.on( 'window:alert', response => {

            expect( response ).to.contain( `Copied to clipboard` )

        } )

        cy.visit( `/manualverify` )

        cy.get( `textarea#message-to-verify` ).type( rp_signature_string_valid )

        cy.contains( `verifyably signed` )
        cy.contains( `Get sharable link` ).click()


    } )

    it( `Fails on faulty message`, () => {

        cy.visit( `/manualverify` )

        cy.get( `textarea#message-to-verify` ).type( rp_signature_string_invalid )

        cy.contains( `Error: cannot verify that this message was signed by this address` )

    } )


} )