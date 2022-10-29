import { message_signature, message_to_sign, signature_link, user_address } from "../../fixtures/web3"

context( "Signature verification", () => {

    it( 'Can view and verify a valid signature', () => {

		// Visit code claim page
		cy.visit( signature_link )

        // Can view message verification
        cy.contains( `Message verification` )
        cy.contains( `aka mentor.eth` )
        cy.get( `textarea` ).contains( message_to_sign )

        // Can view cryptographic source
        cy.contains( `Show cryptographic source` ).click()
        cy.contains( `"claimed_message": "message"`, { matchCase: false } )
        cy.contains( `"signed_message": "${ message_signature }"`, { matchCase: false } )
        cy.contains( `"claimed_signatory": "${ user_address }"`, { matchCase: false } )

	} )

    it( 'Fails on an invalid link', () => {

        // Catch alerts
        cy.on( 'window:alert', response => {

            expect( response ).to.contain( `Invalid signature link` )

        } )

		// Visit code claim page
		cy.visit( signature_link.slice( 0, 30 ) )
        cy.contains( `This message appears corrupted or tampered with.` )


	} )



} )